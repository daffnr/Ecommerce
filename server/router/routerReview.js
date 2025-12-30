import express from "express";
import { client } from "../config/connection.js";
import { authorize } from "../middleware/Authorize.js";

const router = express.Router();

router.post("/add-review", authorize("user"), async (req, res) => {
  try {
    const { id, product_id, rating, comment } = req.body;
    const userid = req.user.id;

    if (id) {
      await client.query(
        `UPDATE review SET rating = $1, comment = $2, WHERE id = $3`,
        [rating, comment, id]
      );
    } else {
      await client.query(
        `INSERT INTO review(user_id, product_id, rating, comment)
                VALUES($1, $2, $3, $4)`,
        [userid, product_id, rating, comment]
      );
    }

    res
      .status(201)
      .json({ message: id ? "Berhasil diperbarui" : "Berhasil disimpan" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
