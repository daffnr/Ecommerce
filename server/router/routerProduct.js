import express from "express";
import { client } from "../config/connection.js";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { authorize } from "../middleware/Authorize.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./assets");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4();
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/\s+/g, "-");
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

const create = "Berhasil disimpan";
const update = "Berhasil diperbaharui";

const deleteProductImageFile = async (link) => {
  if (!link) return;
  try {
    const filename = link.split("/assets/")[1];
    if (filename) {
      const filepath = path.join("assets", filename);
      try {
        await fs.access(filepath);
        await fs.unlink(filepath);
      } catch (accessOrUnlinkError) {
        // File does not exist or cannot be accessed/deleted; ignore
      }
    }
  } catch (err) {
    console.error("Error deleting image file:", err);
  }
};

router.post(
  "/",
  authorize("admin"),
  upload.array("images", 10),
  async (req, res) => {
    try {
      const { categoryId, name, desc, price, capital, stock, weight, imageOrder } = req.body;
      const profit = price - capital;

      const data = await client.query(
        `INSERT INTO product
        (category_id, name, description, price, capital, profit, stock, weight)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [categoryId, name, desc, price, capital, profit, stock, weight]
      );

      const productId = data.rows[0].id;

      let uploadedLinks = [];
      if (req.files && req.files.length > 0) {
        uploadedLinks = req.files.map(
          (file) => `${process.env.URL}/assets/${file.filename}`
        );
      }

      let parsedOrder = [];
      if (imageOrder) {
        try {
          parsedOrder = JSON.parse(imageOrder);
        } catch (e) {
          // ignore parsing error
        }
      }

      const finalLinks = [];
      let newFileIndex = 0;
      if (parsedOrder && parsedOrder.length > 0) {
        for (const item of parsedOrder) {
          if (item.type === "new") {
            if (uploadedLinks[newFileIndex]) {
              finalLinks.push(uploadedLinks[newFileIndex++]);
            }
          }
        }
      } else {
        finalLinks.push(...uploadedLinks);
      }

      for (const link of finalLinks) {
        await client.query(
          `INSERT INTO image(product_id, link) VALUES($1, $2)`,
          [productId, link]
        );
      }

      res.status(201).json({ message: create, id: productId });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
);

router.put(
  "/:id",
  authorize("admin"),
  upload.array("images", 10),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { categoryId, name, desc, price, capital, stock, weight, removedImageIds, imageOrder } = req.body;
      const profit = price - capital;

      // Update product fields
      await client.query(
        `UPDATE product SET 
          category_id = $1,
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

      // Handle image deletion/replacement logic
      let parsedRemovedIds = [];
      if (removedImageIds) {
        try {
          parsedRemovedIds = JSON.parse(removedImageIds);
        } catch (e) {
          // Ignore parse errors, fallback to empty array
        }
      }

      if (parsedRemovedIds && parsedRemovedIds.length > 0) {
        // 1. Get existing images from database to delete from disk later
        const imagesToDelete = await client.query(
          "SELECT link FROM image WHERE id = ANY($1::int[])",
          [parsedRemovedIds]
        );

        // 2. Clean up old files from disk asynchronously
        for (const img of imagesToDelete.rows) {
          if (img.link) {
            await deleteProductImageFile(img.link);
          }
        }
      }

      let uploadedLinks = [];
      if (req.files && req.files.length > 0) {
        uploadedLinks = req.files.map(
          (file) => `${process.env.URL}/assets/${file.filename}`
        );
      }

      let parsedOrder = [];
      if (imageOrder) {
        try {
          parsedOrder = JSON.parse(imageOrder);
        } catch (e) {
          // ignore parsing error
        }
      }

      const finalLinks = [];
      let newFileIndex = 0;
      if (parsedOrder && parsedOrder.length > 0) {
        for (const item of parsedOrder) {
          if (item.type === "server") {
            finalLinks.push(item.link);
          } else if (item.type === "new") {
            if (uploadedLinks[newFileIndex]) {
              finalLinks.push(uploadedLinks[newFileIndex++]);
            }
          }
        }
      } else {
        // Fallback: get remaining database links for this product, then append new uploads
        const existing = await client.query("SELECT link FROM image WHERE product_id = $1", [id]);
        finalLinks.push(...existing.rows.map(r => r.link));
        finalLinks.push(...uploadedLinks);
      }

      // Rebuild the image records in the specified order
      await client.query("DELETE FROM image WHERE product_id = $1", [id]);

      for (const link of finalLinks) {
        await client.query(
          `INSERT INTO image(product_id, link) VALUES($1, $2)`,
          [id, link]
        );
      }

      res.status(200).json({ message: update });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
);

router.get("/get-products", async (req, res) => {
  try {
    let { search = "", page = 1, limit = 14, categoryId } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT product.*,
        ROUND(AVG(review.rating), 1) AS rating,
        json_agg(json_build_object('id', image.id, 'product_id', image.product_id, 'link', image.link)) AS images,
        COALESCE(json_agg(DISTINCT jsonb_build_object( 'user', users.name, 'rating', review.rating, 'comment', review.comment))
        FILTER (WHERE review.id is NOT NULL), '[]') AS reviews
        FROM product
        LEFT JOIN image ON product.id = image.product_id
        LEFT JOIN review ON product.id = review.product_id
        LEFT JOIN users ON review.user_id = users.id
        WHERE product.name ILIKE $1`;

    let countQuery = `SELECT COUNT(*) AS total FROM product WHERE name ILIKE $1`;
    let queryParams = [`%${search}%`];

    if (categoryId) {
      query += ` AND product.category_id = $2`;
      countQuery += ` AND Category_id = $2`;
      queryParams.push(categoryId);
    }

    query += ` GROUP BY product.id ORDER BY product.id ASC LIMIT $${queryParams.length + 1}
      OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);

    const data = await client.query(query, queryParams);
    const countData = await client.query(
      countQuery,
      queryParams.slice(0, queryParams.length - 2),
    );

    const totalProducts = parseInt(countData.rows[0].total);
    const totalPages = Math.ceil(totalProducts / limit);

    const products = data.rows;

    res.status(200).json({ totalProducts, totalPages, products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const data = await client.query(
      `
    SELECT product.*,
        ROUND(AVG(review.rating), 1) AS rating,
        COALESCE (json_agg(DISTINCT jsonb_build_object('id', image.id, 'product_id', image.product_id, 'link', image.link))
        FILTER (WHERE image.id is NOT NULL), '[]') AS images,
        COALESCE(json_agg(json_build_object( 'user', users.name, 'rating', review.rating, 'comment', review.comment))
        FILTER (WHERE review.id is NOT NULL), '[]') AS reviews
        FROM product
        LEFT JOIN image ON product.id = image.product_id
        LEFT JOIN review ON product.id = review.product_id
        LEFT JOIN users ON review.user_id = users.id
        WHERE product.id = $1 GROUP BY product.id`,
      [req.params.id],
    );

    if (data.rowCount === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }
    const product = data.rows[0];

    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", authorize("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Get existing image URLs to delete files from disk later
    const existingImages = await client.query(
      "SELECT link FROM image WHERE product_id = $1",
      [id]
    );

    // 2. Delete image records
    await client.query("DELETE FROM image WHERE product_id = $1", [id]);

    // 3. Delete product record
    await client.query(`DELETE FROM product WHERE id = $1`, [id]);

    // 4. Safely delete files asynchronously
    for (const img of existingImages.rows) {
      if (img.link) {
        await deleteProductImageFile(img.link);
      }
    }

    res.status(200).json({ message: "Berhasil dihapus" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
export default router;
