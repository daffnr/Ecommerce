import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import { useSelector } from "react-redux";

const UserDash = () => {
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    oldPassword: "",
    newPassword: "",
    province_id: "",
    province: "",
    city_id: "",
    city: "",
    district: "",
    village_id: "",
    village: "",
    detail: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id || "",
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        province_id: user.address?.province_id || "",
        province: user.address?.province || "",
        city_id: user.address?.city_id || "",
        city: user.address?.city || "",
        district_id: user.address?.district_id || "",
        district: user.address?.district || "",
        village_id: user.address?.village_id || "",
        village: user.address?.village || "",
        detail: user.address?.detail || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const {name, value} = e.target


    setFormData({... formData, [name]: value})

  }

  const updateProfile = (e) => {
    e.preventDefault()
    const data = {formData};

    console.log(data)
  }

  return (
    <Layout>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom bg-white border p-2 rounded shadow">
        <h1 className="h2">Dashboard</h1>
      </div>

      <div className="bg-white p-4 border shadow rounded orverflow-auto">
        <div className="row">
          <div className="col-lg-6 col-12">
            <form className="d-flex flex-column gap-3 mb-4" onSubmit={updateProfile}>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Username"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
              />

              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
              />

              <input
                type="number"
                name="phone"
                id="phone"
                placeholder="No Whatsapp"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
              />

              <input
                type="password"
                name="oldPassword"
                id="oldPassword"
                placeholder="Password Lama"
                className="form-control"
                value={formData.oldPassword}
                onChange={handleChange}
              />

              <input
                type="password"
                name="newPassword"
                id="newPassword"
                placeholder="Password Baru"
                className="form-control"
                value={formData.newPassword}
                onChange={handleChange}
              />

              <div className="text-end">
                <button className="btn btn-success" type="submit">Update</button>
              </div>
            </form>
          </div>
          <div className="col-lg-6 col-12">
            <form className="d-flex flex-column gap-3">
              <select name="provinces" id="province" className="form-select">
                <option value="" hidden>
                  Provinsi
                </option>
                <option value="">Jawa Barat</option>
                <option value="">Jawa Timur</option>
              </select>

              <select name="cities" id="city" className="form-select">
                <option value="" hidden>
                  Kota / Kabupaten
                </option>
                <option value="">Kab Bogor</option>
                <option value="">Kota Bogor</option>
              </select>

              <select name="cities" id="city" className="form-select">
                <option value="" hidden>
                  Kecamatan
                </option>
                <option value="">Kecamatan 1</option>
                <option value="">Kecamatan 2</option>
              </select>

              <select name="cities" id="city" className="form-select">
                <option value="" hidden>
                  Desa
                </option>
                <option value="">Desa 1</option>
                <option value="">Desa 2</option>
              </select>

              <textarea
                name="address"
                id="address"
                className="form-control"
                placeholder="Alamat Lengkap"
                rows={4}
              ></textarea>

              <div className="text-end">
                <button className="btn btn-success">Update</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserDash;
