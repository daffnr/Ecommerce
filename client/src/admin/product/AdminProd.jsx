import React from "react";
import Layout from "../layout/Layout";
import TableComponent from "../table/TableComponent";
import { products } from "../../Data";

const AdminProd = () => {
  return (
    <Layout pageName={"Daftar Produk"}>
      <TableComponent height={"75vh"}>
        <table className="table table-hover table-striped">
          <thead>
            <tr>
              <th className="text-center align-middle">No</th>
              <th className="text-center align-middle">Kategori</th>
              <th className="text-center align-middle">Gambar</th>
              <th className="text-center align-middle">Produk</th>
              <th className="text-center align-middle">Modal</th>
              <th className="text-center align-middle">Harga</th>
              <th className="text-center align-middle">Stok</th>
              <th className="text-center align-middle">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((item, i) => (
              <tr key={i}>
                <td className="text-center align-middle">{i + 1}</td>
                <td className="text-center align-middle">{item.category}</td>
                <td className="text-center align-middle">
                  <div
                    className="rounded overflow-hidden"
                    style={{ height: 100, width: 100 }}
                  >
                    <img
                      src={item.images[0].link}
                      alt={`Gambar produk ${item.name}`}
                      width="100%"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </td>
                <td className="text-center align-middle">{item.name}</td>
                <td className="text-center align-middle">{`Rp ${parseFloat(
                  item.capital
                ).toLocaleString("id-ID")}`}</td>
                <td className="text-center align-middle">{`Rp ${parseFloat(
                  item.price
                ).toLocaleString("id-ID")}`}</td>
                <td className="text-center align-middle">{item.stock}</td>
                <td className="text-center align-middle">
                  <div className="d-flex justify-content-center gap-2">
                    <button className="btn btn-primary">Detail</button>
                    <button className="btn btn-danger">Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableComponent>
    </Layout>
  );
};

export default AdminProd;
