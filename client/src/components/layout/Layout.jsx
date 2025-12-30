import React from "react";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { products } from "../../Data";

const Layout = ({ children }) => {
  return (
    <div className="bg-light ">
      <Navbar />
      <div style={{ padding: "80px 0", minHeight: "78vh" }}>{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
