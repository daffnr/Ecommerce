import express from "express";
import { client } from "../config/connection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authorize } from "../middleware/Authorize.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    bcrypt.hash(password, 10, async function (err, hash) {
      // Store hash in your password DB.
      if (err) {
        return res.status(500).json({ message: err.message });
      } else {
        const data = await client.query(
          `
            INSERT INTO users (name, email, password, phone) VALUES ($1, $2, $3, $4) RETURNING *`,
          [name, email, hash, phone]
        );

        const user = data.rows[0];

        res.status(201).json({ message: "Pendaftaran Berhasil", user });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = await client.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    if (data.rowCount === 0) {
      return res.status(404).json({ message: "Email tidak ditemukan" });
    }

    const user = data.rows[0];

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      if (!result) {
        return res.status(400).json({ message: "Password Salah" });
      }

      const token = jwt.sign(
        { id: user.id, level: user.level },
        process.env.KEY,
        { expiresIn: "7d" }
      );

      res.cookie("token", token, { httpOnly: true });
      res.status(200).json({ message: "Berhasil Login" });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/get-user", authorize("admin"), async (req, res) => {
  try {
    const data = await client.query(
      `SELECT id, name, email, phone, level FROM users`
    );
    res.status(200).json(data.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/load-user", authorize("user", "admin"), async (req, res) => {
  try {
    const data = await client.query(`SELECT * FROM users WHERE id = $1`, [
      req.user.id,
    ]);

    const user = data.rows[0];

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.delete("/delete-user/:id", authorize("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    const data = await client.query(
      `DELETE FROM users WHERE id = $1 RETURNING *`,
      [id]
    );

    if (data.rowCount === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res
      .status(200)
      .json({ message: "User berhasil dihapus", deletedUser: data.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
