import React from "react";
import Layout from "../layout/Layout";

const Order = () => {
  return (
    <Layout>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom bg-white border p-2 rounded shadow">
        <h1 className="h2">Transaksi</h1>
      </div>

      <div className="bg-white p-4 border shadow rounded orverflow-auto">
        <div className="border rounded p-2 d-flex flex-column gap-2">
          <div className="d-flex gap-2 flex-wrap">
            <i className="bi bi-bag-check"></i>
            <p className="m-0">
              Belanja <span>20 feb 2025</span>
            </p>

            <p className="m-0">No Resi: sdasd9dasdasijasdasbdjasd</p>
          </div>
          <div className="row">
            <div className="col-lg-10 col-12 mb-3">
              <p className="m-0">{`Nama Produk`}</p>
              <p className="m-0">{`Jumlah Produk`}</p>
            </div>
            <div className="col-lg-2 col-12">
              <p className="m-0 text-center">Total Belanja</p>
              <p className="m-0 text-center fw-bold">Rp 200.000</p>
            </div>
          </div>

          <div className="text-end">
            <button className="btn btn-success">Detail Transaksi</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Order;
