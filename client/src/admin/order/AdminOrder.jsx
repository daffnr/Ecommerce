import React from "react";
import Layout from "../layout/Layout";
import TableComponent from "../table/TableComponent";

const AdminOrder = () => {
  return (
    <Layout pageName={"Pesanan"}>
      <TableComponent height={"75vh"}>
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>No</th>
              <th>Kode Transaksi</th>
              <th>User</th>
              <th>Produk</th>
              <th>Jumlah</th>
              <th>Status Pembayaran</th>
              <th>Status Pesanan</th>
              <th>Resi</th>
              <th>Aksi</th>
            </tr>
          </thead>
        </table>
      </TableComponent>
    </Layout>
  );
};

export default AdminOrder;
