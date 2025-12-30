import express from "express";
import { client } from "../config/connection.js";
import {authorize} from "../middleware/Authorize.js"

const router = express.Router();

router.post("/add-category", authorize("admin"),  async (req, res) => {
  try {
    const { name, id } = req.body;
    if (id) {
      await client.query(
        `UPDATE category SET name = $1 WHERE id = $2 RETURNING *`,
        [name, id]
      );
      res.status(200).json({ message: "Berhasil diperbaharui" });
    } else {
        const data = await client.query(
      `INSERT INTO category(name) VALUES($1) RETURNING *`,
      [name]
    );

    const result = data.rows[0];

    res.status(200).json({ message: "Berhasil disimpan", result });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/get-all", async (req, res) => {
    
  try {
    const data = await client.query(`SELECT * FROM category`);

    res.status(200).json(data);
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
        [name, id]
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
        res.status(500).json({ message : error.message });
    }
})

export default router;
