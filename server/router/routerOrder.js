import express from "express";
import axios from "axios";
import { nanoid } from "nanoid";
import { client } from "../config/connection.js";
import { authorize } from "../middleware/Authorize.js";

const router = express.Router();

const config = {
  authorization: `Basic ${Buffer.from(
    process.env.MID_SERVER_KEY + ":"
  ).toString("base64")}`,
};

router.post("/create-order", authorize("user"), async (req, res) => {
  try {
    const { products, gross_amount } = req.body;

    const user = req.user;

    const productsData = products;

    const orderid = `ORDER-${nanoid(5)}-${nanoid(5)}`;

    await client.query("BEGIN");

    const rawData = await client.query(
      `INSERT INTO 
      orders(transaction_id, user_id, gross_amount)
      VALUES($1, $2, $3) RETURNING *`,
      [orderid, user.id, gross_amount]
    );
    const order = rawData.rows[0];

    for (const product of productsData) {
      await client.query(
        `INSERT INTO order_items(order_id, product_id, quantity, price, shipping) 
        VALUES($1, $2, $3, $4, $5)`,
        [
          order.id,
          product.id,
          product.quantity,
          product.price,
          product.shipping,
        ]
      );
    }

    await client.query("COMMIT");

    const data = {
      customer_details: {
        first_name: user.name,
        email: user.email,
        phone: user.phone,
      },
      transaction_details: {
        order_id: orderid,
        gross_amount: gross_amount,
      },
      credit_card: {
        secure: true,
      },
    };

    const response = await axios.post(
      `${process.env.MID_BASE_URL}/snap/v1/transactions`,
      data,
      {
        headers: config,
      }
    );

    res.status(201).json(response.data);
  } catch (error) {
    await pool.query("ROLLBACK");
    res.status(500).json({ message: error.message });
  }
});

const updateStatusOrder = async (status, orderid) => {
  console.log(status, orderid);

  await client.query(
    `UPDATE orders SET transaction_status = $1 WHERE transaction_id = $2`,
    [status, orderid]
  );
};

router.post("/transaction-notification", async (req, res) => {
  try {
    const data = req.body;

    let orderId = data.order_id;
    let transactionStatus = data.transaction_status;
    let fraudStatus = data.fraud_status;

    // Sample transactionStatus handling logic

    if (transactionStatus == "capture") {
      if (fraudStatus == "accept") {
        // TODO set transaction status on your database to 'success'
        // and response with 200 OK
        updateStatusOrder(transactionStatus, orderId);
      }
    } else if (transactionStatus == "settlement") {
      // TODO set transaction status on your database to 'success'
      // and response with 200 OK
      updateStatusOrder(transactionStatus, orderId);
    } else if (
      transactionStatus == "cancel" ||
      transactionStatus == "deny" ||
      transactionStatus == "expire"
    ) {
      // TODO set transaction status on your database to 'failure'
      // and response with 200 OK
      updateStatusOrder(transactionStatus, orderId);
    } else if (transactionStatus == "pending") {
      // TODO set transaction status on your database to 'pending' / waiting payment
      // and response with 200 OK
      updateStatusOrder(transactionStatus, orderId);
    }
    res.status(200).json({ status: "succes", message: "OK" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.put("/confirm/:id", authorize("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const status = "processing";
    const checkOrder = await client.query(
      `SELECT * FROM orders WHERE id = $1`,
      [id]
    );
    const order = checkOrder.rows[0];

    const checkProduct = await client.query(
      `SELECT * FROM product WHERE id = $1`,
      [order.product_id]
    );
    const product = checkProduct.rows[0];

    const updateStock = product.stock - order.items;

    await client.query(`UPDATE product SET stock = $1 WHERE id = $2`, [
      updateStock,
      product.id,
    ]);

    await client.query(`UPDATE orders SET status_order = $1 WHERE id = $2`, [
      status,
      id,
    ]);

    res.status(200).json({ message: "Order diproses" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.put("/give-resi/:id", authorize("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { resi } = req.body;
    const status = "shipping";

    await client.query(
      `UPDATE orders SET resi = $1, status_order = $2 WHERE id = $3`,
      [resi, status, id]
    );

    res.status(200).json({ message: "Berhasil diperbaharui" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.put("/cancel/:id", authorize("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const status = "cancel";

    await client.query(`UPDATE orders SET status_order = $1 WHERE id = $2`, [
      status,
      id,
    ]);

    res.status(200).json({ message: "Berhasil diperbaharui" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/get-orders", authorize("admin", "user"), async (req, res) => {
  try {
    const level = req.user.level;
    const userid = req.user.id;

    const query = `SELECT orders.*, users.*, address.*,
      users.name AS user_name,
      COALESCE(json_agg(DISTINCT jsonb_build_object(
      'id', product.id,
      'name', product.name,
      'quantity', order_items.quantity,
      'price', order_items.price,
      'capital', order_items.quantity * product.capital,
      'profit',(order_items.price - (order_items.quantity * product.capital)),
      'shipping', order_items.shipping
      )) FILTER (WHERE product.id IS NOT NULL), '[]') AS products
      FROM orders
      INNER JOIN users ON orders.user_id = users.id
      INNER JOIN order_items ON orders.id = order_items.order_id
      INNER JOIN product ON order_items.product_id = product.id
      INNER JOIN address ON users.id = address.user_id  
      ${level !== "admin" ? "WHERE orders.user_id = $1" : ""}
      GROUP BY orders.id, users.id, address.id`;

    const data = await client.query(query, level !== "admin" ? [userid] : []);

    const rawData = data.rows;

    let orders;
    orders = rawData?.map((order) => ({
      id: order.id,
      transaction_id: order.transaction_id,
      transaction_status: order.transaction_status,
      status_order: order.status_order,
      resi: order.resi,
      user: {
        user_id: 3,
        name: order.user_name,
        email: order.email,
        phone: order.phone,
      },
      product: order.products.map((product) => ({
        id: product.id,
        name: product.name,
        quantity: product.quantity,
        shipping: product.shipping,
        price: product.price,
        capital: level !== "admin" ? null : product.capital,
        profit: level !== "admin" ? null : product.profit,
      })),
      gross_amount: Number(order.gross_amount),
      address: {
        province: order.province,
        city: order.city,
        district: order.district,
        village: order.village,
        detail: order.detail,
        shipping: Number(order.shipping),
      },
      createdat: order.createdat,
    }));

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
