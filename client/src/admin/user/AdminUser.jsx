import React from "react";
import Layout from "../layout/Layout";
import TableComponent from "../table/TableComponent";
import { users } from "../../Data";

const AdminUser = () => {
  return (
    <Layout pageName={"Daftar Pengguna"}>
      <TableComponent height={"75vh"}>
        <table className="table table-hover table-striped">
          <thead>
            <tr>
              <th className="text-center align-middle">No</th>
              <th className="text-center align-middle">Nama</th>
              <th className="text-center align-middle">Email</th>
              <th className="text-center align-middle">Whatsapp</th>
              <th className="text-center align-middle">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user, i) => (
              <tr key={i}>
                <td className="text-center align-middle">{i + 1}</td>
                <td>{user.nama}</td>
                <td className="text-center align-middle">{user.email}</td>
                <td className="text-center align-middle">{user.phone}</td>
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

export default AdminUser;
