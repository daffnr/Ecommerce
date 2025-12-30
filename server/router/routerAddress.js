import express from "express";
import { client } from "../config/connection.js";
import { authorize } from "../middleware/Authorize.js";

const router = express.Router();
const api = process.env.BINDER_API;

router.get("/get-provinces", authorize("user"), async (req, res) => {
  try {
    const response = await fetch(
      `https://api.binderbyte.com/wilayah/provinsi?api_key=${api}`
    );
    const data = await response.json();
    res.status(200).json(data.value);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/get-cities/:provinceId", authorize("user"), async (req, res) => {
  try {
    const { provinceId } = req.params;

    const response = await fetch(
      `https://api.binderbyte.com/wilayah/kabupaten?api_key=${api}&id_provinsi=${provinceId}`
    );
    const data = await response.json();
    res.status(200).json(data.value);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/get-district/:cityId", authorize("user"), async (req, res) => {
  try {
    const { cityId } = req.params;

    const response = await fetch(
      `https://api.binderbyte.com/wilayah/kecamatan?api_key=${api}&id_kabupaten=${cityId}`
    );
    const data = await response.json();
    res.status(200).json(data.value);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/get-villages/:districtId", authorize("user"), async (req, res) => {
  try {
    const { districtId } = req.params;

    const response = await fetch(
      `https://api.binderbyte.com/wilayah/kelurahan?api_key=${api}&id_kecamatan=${districtId}`
    );
    const data = await response.json();
    res.status(200).json(data.value);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});


router.post("/add", authorize("user"), async (req, res) => {
  try {
    const {
      id,
      province_id,
      province,
      city_id,
      city,
      district_id,
      district,
      village_id,
      village,
      detail,
    } = req.body;

    const user_id = req.user.id;

    if (id) {
      await client.query(
        `UPDATE address
          province_id = $1, province = $2, city_id = $3, city = $4, 
          district_id = $5, district = $6, village_id = $7, village = $8, detail = $9 
        WHERE id = $10`,
        [
          province_id,
          province,
          city_id,
          city,
          district_id,
          district,
          village_id,
          village,
          detail,
          id,
        ]
      );
    } else {
      await client.query(
        `INSERT INTO address
          (user_id, province_id, province, city_id, city, district_id, district, village_id, village, detail)
         VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          user_id,
          province_id,
          province,
          city_id,
          city,
          district_id,
          district,
          village_id,
          village,
          detail,
        ]
      );
    }

    res.status(201).json({
      message: id ? "Berhasil diperbarui" : "Berhasil disimpan",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.delete("/delete/:id", authorize("user"), async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await client.query(
      `DELETE FROM address WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, user_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Alamat tidak ditemukan" });
    }

    res.status(200).json({ message: "Alamat berhasil dihapus" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.put("/update/:id", authorize("user"), async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const {
      province_id,
      province,
      city_id,
      city,
      district_id,
      district,
      village_id,
      village,
      detail,
    } = req.body;

    const result = await client.query(
      `UPDATE address
       SET province_id=$1, province=$2, city_id=$3, city=$4,
           district_id=$5, district=$6, village_id=$7, village=$8, detail=$9
       WHERE id=$10 AND user_id=$11
       RETURNING *`,
      [
        province_id,
        province,
        city_id,
        city,
        district_id,
        district,
        village_id,
        village,
        detail,
        id,
        user_id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Alamat tidak ditemukan atau bukan milikmu" });
    }

    res.status(200).json({ message: "Alamat berhasil diperbarui", data: result.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/all", authorize("user"), async (req, res) => {
  try {
    const user_id = req.user.id;
    const result = await client.query(
      `SELECT * FROM address WHERE user_id=$1 ORDER BY id DESC`,
      [user_id]
    );

    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});



export default router;
