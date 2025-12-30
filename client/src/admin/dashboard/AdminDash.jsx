import React from "react";
import Layout from "../layout/Layout";

const AdminDash = () => {
  return (
    <Layout pageName={"Dashboard"}>
      <div className="bg-white p-4 border shadow rounded orverflow-auto">
        Laporan keuangan 7 hari kebelakang
      </div>
    </Layout>
  );
};

export default AdminDash;
