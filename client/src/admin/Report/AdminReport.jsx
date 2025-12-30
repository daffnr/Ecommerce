import React from "react";
import Layout from "../layout/Layout";
import TableComponent from "../table/TableComponent";

const AdminReport = () => {
  return (
    <Layout pageName={"Laporan"}>
      <TableComponent height={"75vh"}>
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>No</th>
              <th>Kode Transaksi</th>
              <th>Penjualan</th>
              <th>Modal</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
            </tr>
          </tbody>

          <tfoot>
            <tr>Total Penjulan</tr>
          </tfoot>
        </table>
      </TableComponent>
    </Layout>
  );
};

export default AdminReport;
