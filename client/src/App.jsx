import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./home/Index";
import Signin from "./components/auth/Signin";
import Signup from "./components/auth/Signup";

const Detail = lazy(() => import("./product/Detail"));
const Checkout = lazy(() => import("./user/checkout/Checkout"));
const Cart = lazy(() => import("./user/cart/Cart"));
const UserDash = lazy(() => import("./user/dashboard/UserDash"));
const Order = lazy(() => import("./user/order/Order"));

const AdminDash = lazy(() => import("./admin/dashboard/AdminDash"));
const AdminUser = lazy(() => import("./admin/user/AdminUser"));
const AdminCat = lazy(() => import("./admin/category/AdminCat"));
const AdminProd = lazy(() => import("./admin/product/AdminProd"));
const AdminOrder = lazy(() => import("./admin/order/AdminOrder"));
const AdminReport = lazy(() => import("./admin/Report/AdminReport"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route path="/signin" element={<Signin />} />

          <Route path="/signup" element={<Signup />} />

          <Route path="/" element={<Index />} />

          <Route path="/:id/:name" element={<Detail />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route path="/cart" element={<Cart />} />

          <Route path="/user-dashboard" element={<UserDash />} />

          <Route path="/user-transaksi" element={<Order />} />

          <Route path="/admin-dashboard" element={<AdminDash />} />

          <Route path="/admin-user" element={<AdminUser />} />

          <Route path="/admin-kategori" element={<AdminCat />} />

          <Route path="/admin-produk" element={<AdminProd />} />

          <Route path="/admin-pesanan" element={<AdminOrder />} />

          <Route path="/admin-laporan" element={<AdminReport />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
