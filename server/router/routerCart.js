import express from "express";
import { client } from "../config/connection.js";
import { authorize } from "../middleware/Authorize.js";

const router = express.Router();


router.get("/", authorize("user"), async (req, res) => {
  try {
    const userId = req.user.id;

    const query = `
      SELECT 
        cart.id AS cart_id,
        COALESCE(
          json_agg(
            jsonb_build_object(
              'cart_item_id', cart_items.id,
              'product_id', product.id,
              'name', product.name,
              'price', cart_items.price,
              'quantity', cart_items.quantity,
              'subtotal', cart_items.price * cart_items.quantity
            )
          ) FILTER (WHERE product.id IS NOT NULL),
          '[]'
        ) AS products
      FROM cart
      JOIN cart_items ON cart.id = cart_items.cart_id
      JOIN product ON cart_items.product_id = product.id
      WHERE cart.user_id = $1
      GROUP BY cart.id
    `;

    const { rows } = await client.query(query, [userId]);

    res.json(rows[0] || { products: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post("/", authorize("user"), async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity } = req.body;

    await client.query("BEGIN");

    // ambil harga product
    const productRes = await client.query(
      "SELECT price FROM product WHERE id = $1",
      [product_id]
    );

    if (productRes.rows.length === 0) {
      throw new Error("Product tidak ditemukan");
    }

    const price = productRes.rows[0].price;

    // cek cart
    const cartRes = await client.query(
      "SELECT id FROM cart WHERE user_id = $1",
      [userId]
    );

    let cartId;
    if (cartRes.rows.length === 0) {
      const newCart = await client.query(
        "INSERT INTO cart(user_id) VALUES($1) RETURNING id",
        [userId]
      );
      cartId = newCart.rows[0].id;
    } else {
      cartId = cartRes.rows[0].id;
    }

    // cek item
    const exist = await client.query(
      `SELECT id FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
      [cartId, product_id]
    );

    if (exist.rows.length > 0) {
      await client.query(
        `UPDATE cart_items
         SET quantity = quantity + $1
         WHERE id = $2`,
        [quantity, exist.rows[0].id]
      );
    } else {
      await client.query(
        `INSERT INTO cart_items(cart_id, product_id, quantity, price)
         VALUES($1, $2, $3, $4)`,
        [cartId, product_id, quantity, price]
      );
    }

    await client.query("COMMIT");
    res.status(201).json({ message: "Product added to cart" });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: error.message });
  }
});


router.put("/:id", authorize("user"), async (req, res) => {
  try {
    const { quantity } = req.body;
    const { id } = req.params;

    await client.query(
      "UPDATE cart_items SET quantity = $1 WHERE id = $2",
      [quantity, id]
    );

    res.json({ message: "Cart updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", authorize("user"), async (req, res) => {
  try {
    await client.query(
      "DELETE FROM cart_items WHERE id = $1",
      [req.params.id]
    );

    res.json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

