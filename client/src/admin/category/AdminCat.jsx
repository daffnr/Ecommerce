import React from "react";
import Layout from "../layout/Layout";
import TableComponent from "../table/TableComponent";
import { categories } from "../../Data";

const AdminCat = () => {
  return (
    <Layout pageName={"Daftar Kategori"}>
      <TableComponent height={"75vh"}>
        <table className="table table-hover table-striped">
          <thead>
            <tr>
              <th className="text-center align-middle">No</th>
              <th className="text-center align-middle">_id</th>
              <th className="text-center align-middle">Kategori</th>
              <th className="text-center align-middle">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((item, i) => (
              <tr key={i}>
                <td className="text-center align-middle">{i + 1}</td>
                <td className="text-center align-middle">{item.id}</td>
                <td className="text-center align-middle">{item.name}</td>
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

export default AdminCat;
