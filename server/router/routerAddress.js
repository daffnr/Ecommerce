import express from "express";
import { client } from "../config/connection.js";
import { authorize } from "../middleware/Authorize.js";

const router = express.Router();
const api = process.env.API;

router.get(
  "/get-cities/:city",
  authorize("user", "admin"),
  async (req, res) => {
    try {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          key: process.env.API,
        },
      };

      const response = await fetch(
        `https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?search=${req.params.city}&limit=1000000`,
        options,
      );

      const data = await response.json();

      if (!data || !data.data || !Array.isArray(data.data)) {
        console.error("RajaOngkir API error or empty data:", data);
        return res.status(response.status || 400).json({
          message:
            data?.message ||
            "Gagal mendapatkan data kota dari RajaOngkir. Periksa API Key Anda.",
        });
      }

      const sorted = data.data.sort((a, b) => a.label.localeCompare(b.label));

      res.status(200).json(sorted);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
);

router.get("/cost", authorize("user"), async (req, res) => {
  try {
    const {
      courier = "jne",
      origin = "8122",
      destination = "8122",
      weight = 1000,
    } = req.query;

    const data = new URLSearchParams();
    data.append("courier", courier);
    data.append("origin", origin);
    data.append("destination", destination);
    data.append("weight", weight);

    const options = {
      method: "POST",
      headers: {
        accept: "application/x-www-form-urlencoded",
        key: process.env.API,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data.toString(),
    };

    const response = await fetch(
      "https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost",
      options,
    );

    const service = await response.json();

    if (!response.ok || service.meta?.status === "error") {
      return res.status(response.status || 400).json({
        message: service.meta?.message || "Gagal mendapatkan biaya ongkos kirim.",
      });
    }

    res.status(200).json(service.data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/get-provinces", authorize("user"), async (req, res) => {
  try {
    const response = await fetch(
      `https://api.binderbyte.com/wilayah/provinsi?api_key=${api}`,
    );
    const data = await response.json();

    if (!data || !data.value || !Array.isArray(data.value)) {
      console.error("BinderByte API error or empty data:", data);
      return res.status(response.status || 400).json({
        message:
          data?.messages ||
          "Gagal mendapatkan data provinsi dari BinderByte. Periksa API Key Anda.",
      });
    }

    const sorted = data.value.sort((a, b) => a.name.localeCompare(b.name));
    res.status(200).json(sorted);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/get-cities/:provinceId", authorize("user"), async (req, res) => {
  try {
    const { provinceId } = req.params;

    const response = await fetch(
      `https://api.binderbyte.com/wilayah/kabupaten?api_key=${api}&id_provinsi=${provinceId}`,
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
      `https://api.binderbyte.com/wilayah/kecamatan?api_key=${api}&id_kabupaten=${cityId}`,
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
      `https://api.binderbyte.com/wilayah/kelurahan?api_key=${api}&id_kecamatan=${districtId}`,
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
      data_id,
      label,
      province_name,
      city_name,
      district_name,
      subdistrict_name,
      zip_code,
      detail,
    } = req.body;
    const user_id = req.user.id;

    if (id) {
      await client.query(
        `UPDATE address
         SET data_id = $1,
             label = $2,
             province_name = $3,
             city_name = $4,
             district_name = $5,
             subdistrict_name = $6,
             zip_code = $7,
             detail = $8 
         WHERE id = $9`,
        [
          data_id,
          label,
          province_name,
          city_name,
          district_name,
          subdistrict_name,
          zip_code,
          detail,
          id,
        ],
      );
    } else {
      await client.query(
        `INSERT INTO address (user_id, data_id, label, province_name, city_name, district_name, subdistrict_name, zip_code, detail)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          user_id,
          data_id,
          label,
          province_name,
          city_name,
          district_name,
          subdistrict_name,
          zip_code,
          detail,
        ],
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
      [id, user_id],
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
      ],
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Alamat tidak ditemukan atau bukan milikmu" });
    }

    res
      .status(200)
      .json({ message: "Alamat berhasil diperbarui", data: result.rows[0] });
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
      [user_id],
    );

    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
