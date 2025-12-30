import express from "express";
import { client } from "../config/connection.js";
import multer from "multer";
import path from "path";
import {v4 as uuidv4} from "uuid";
import { authorize } from "../middleware/Authorize.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./assets");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4()
    const ext = path.extname(file.originalname)
    const name = path.basename(file.originalname, ext).replace(/\s+/g,"-")
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
})

const upload = multer({ storage: storage });

const router = express.Router();

const create = "Berhasil disimpan";
const update = "Berhasil diperbaharui";

router.post("/add-product", authorize("admin"),  upload.array("images", 10), async (req, res) => {
  try {
    const { id, categoryId, name, desc, price, capital, stock, weight } = 
      req.body;
    const profit = price - capital;


    await client.query("BEGIN");

    let productId;

    if (id) {
      await client.query(
      `UPDATE product SET 
        category_id= $1,
        name = $2,
        description = $3,
        price = $4,
        capital = $5,
        profit = $6,
        stock = $7,
        weight = $8
      WHERE id = $9`,
      [categoryId, name, desc, price, capital, profit, stock, weight, id]
        );
        productId = id;
    }else{
    const data = await client.query(
      `INSERT INTO product
        (category_id, name, description, price, capital, profit, stock, weight)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
  [categoryId, name, desc, price, capital, profit, stock, weight]
    );

    productId = data.rows[0].id;
  }

    if(req.files && req.files.length > 0){
      const images = req.files.map(
        (file) => `${process.env.URL}/assets/${file.filename}`
      );
      for (const image of images){
        await client.query(`INSERT INTO image(product_id, link) VALUES($1, $2)`, 
          [productId, image]
        );
      }
    }

    await client.query("COMMIT")

    res.status(201).json({ message: id ? update : create});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/get-products", async (req, res) =>{
  try {
    const data = await client.query(`
      SELECT product.*,
        ROUND(AVG(review.rating), 1) AS rating,
        json_agg(json_build_object('id', image.id, 'product_id', image.product_id, 'link', image.link)) AS images,
        COALESCE(json_agg(json_build_object( 'user', users.name, 'rating', review.rating, 'comment', review.comment))
        FILTER (WHERE review.id is NOT NULL), '[]') AS reviews
        FROM product
        LEFT JOIN image ON product.id = image.product_id
        LEFT JOIN review ON product.id = review.product_id
        LEFT JOIN users ON review.user_id = users.id
        GROUP BY product.id
        ORDER BY product.id ASC`);

    const products = data.rows

    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
})

router.delete("/delete/:id", authorize("admin"),  async (req, res) => {
    try {

        await client.query(`DELETE FROM product WHERE id = $1`, [req.params.id]);
        
        res.status(200).json({ message: "Berhasil dihapus" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message : error.message });
    }
})

router.delete("/delete-image/:id", authorize("admin"),  async (req, res) => {
    try {

        await client.query(`DELETE FROM image WHERE id = $1`, [req.params.id]);
        
        res.status(200).json({ message: "Berhasil dihapus" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message : error.message });
    }
})
export default router;
