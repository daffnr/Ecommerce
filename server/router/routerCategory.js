import express from "express";
import { client } from "../config/connection.js";
import multer from "multer";
import path from "path";
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

router.post(
  "/add-category",
  authorize("admin"),
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, id } = req.body;

      let categoryId;

      if (id) {
        await client.query(
          `UPDATE category SET name = $1 WHERE id = $2 RETURNING *`,
          [name, id],
        );

        categoryId = id;
      } else {
        const data = await client.query(
          `INSERT INTO category(name) VALUES($1) RETURNING *`,
          [name],
        );

        categoryId = data.rows[0].id;
      }

      if (req.file) {
        const image = `${process.env.URL}/assets/${req.file.filename}`;
        await client.query(`UPDATE category SET image = $1 WHERE id = $2`, [
          image,
          categoryId,
        ]);
      }

      res.status(200).json({
        message: id ? "Berhasil diperbarui" : "Berhasil disimpan",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
);

router.get("/get-categories", async (req, res) => {
  try {
    const { search = "", page, limit } = req.query;
    const offset = (page - 1) * limit;

    if (!page && !limit) {
      const data = await client.query(
        `SELECT * FROM category ORDER BY name ASC`,
      );
      const categories = data.rows;

      res.status(200).json(categories);
    } else {
      let query = `SELECT * FROM category WHERE name ILIKE $1`;
      let countQuery = `SELECT count(*) AS total FROM category WHERE name ILIKE $1`;
      let queryParams = [`%${search}%`];

      query += ` ORDER BY name ASC LIMIT $${queryParams.length + 1}
              OFFSET $${queryParams.length + 2}`;
      queryParams.push(limit, offset);

      const data = await client.query(query, queryParams);
      const countData = await client.query(
        countQuery,
        queryParams.slice(0, queryParams.length - 2),
      );

      const totalCategories = parseInt(countData.rows[0].total);
      const totalPages = Math.ceil(totalCategories / limit);
      const categories = data.rows;

      res.status(200).json({ categories, totalPages, totalCategories });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { name } = req.body;

    await client.query(
      `UPDATE category SET name = $1 WHERE id = $2 RETURNING *`,
      [name, id],
    );
    res.status(200).json({ message: "Berhasil diperbaharui" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await client.query(`DELETE FROM category WHERE id = $1`, [id]);

    res.status(200).json({ message: "Berhasil dihapus" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
