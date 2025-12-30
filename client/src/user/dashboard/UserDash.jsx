import React from "react";
import Layout from "../layout/Layout";

const UserDash = () => {
  return (
    <Layout>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom bg-white border p-2 rounded shadow">
        <h1 className="h2">Dashboard</h1>
      </div>

      <div className="bg-white p-4 border shadow rounded orverflow-auto">
        <div className="row">
          <div className="col-lg-6 col-12">
            <form className="d-flex flex-column gap-3 mb-4">
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Username"
                className="form-control"
              />

              <input
                type="email"
                name="Email"
                id="email"
                placeholder="Email"
                className="form-control"
              />

              <input
                type="number"
                name="phone"
                id="phone"
                placeholder="No Whatsapp"
                className="form-control"
              />

              <input
                type="password"
                name="oldPassword"
                id="oldPassword"
                placeholder="Password Lama"
                className="form-control"
              />

              <input
                type="password"
                name="newPassword"
                id="newPassword"
                placeholder="Password Baru"
                className="form-control"
              />

              <div className="text-end">
                <button className="btn btn-success">Update</button>
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
