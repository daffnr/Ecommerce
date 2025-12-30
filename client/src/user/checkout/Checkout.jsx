import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="p-2 bg-white shadow">
      <div className="container">
        <div
          className="overflow-hidden"
          style={{ height: 50, width: 50 }}
          onClick={() => navigate("/")}
          role="button"
        >
          <img
            src="/image/logo.png"
            width="100%"
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
    </div>
  );
};

const AddressSection = () => (
  <div className="rounded border shadow p-3 bg-white">
    <div className="d-flex justify-content-between align-items-center">
      <p className="h5 text-muted">Alamat Pengiriman</p>
      <button className="btn btn-info">Ganti</button>
    </div>
    <p className="h6">Nama User</p>
    <p className="fst-italic">Jln Merdeka Finansial, Jawa Barat</p>
  </div>
);

const ProductItem = ({ product, updateQuantity }) => (
  <div className="row align-items-center">
    <div className="col-lg-3 col-6 mb-2">
      <div className="overflow-hidden" style={{ height: 80, width: 80 }}>
        <img src={product.img} width="100%" style={{ objectFit: "cover" }} />
      </div>
    </div>
    <div className="col-lg-6 col-6">
      <p className="m-0">{product.name}</p>
      <p className="m-0 text-muted">{`${
        product.totalWeight || product.weight
      } gram`}</p>
      <p className="h6">{`Rp ${parseFloat(product.subtotal).toLocaleString(
        "id-ID"
      )}`}</p>
    </div>
    <div className="col-lg-3 col-6">
      <div className="d-flex gap-1 align-items-center justify-content-center">
        <button
          className="btn btn-pill btn-light"
          onClick={() => updateQuantity(product.id, "decrease")}
        >
          -
        </button>
        <p className="m-0 text-center text-secondary" style={{ width: 60 }}>
          {product.quantity}
        </p>
        <button
          className="btn btn-pill btn-light"
          onClick={() => updateQuantity(product.id, "increase")}
        >
          +
        </button>
      </div>
    </div>
    <div className="col-lg-12 col-6 mt-2">
      <select name="shipping" id="shipping" className="form-select">
        <option value="jne">JNE</option>
        <option value="tiki">TIKI</option>
        <option value="j&t">J&T</option>
      </select>
    </div>
  </div>
);

const ProductList = ({ checkoutProduct, updateQuantity }) => (
  <div className="rounded border shadow bg-white p-2 mb-3 d-flex flex-column gap-2">
    {checkoutProduct.map((product) => (
      <ProductItem
        key={product.id}
        product={product}
        updateQuantity={updateQuantity}
      />
    ))}
  </div>
);

const Summary = ({ checkoutProduct }) => (
  <div className="rounded border shadow p-3 bg-white">
    <p className="h5">Ringkasan Belanja</p>
    <p>
      Total: Rp{" "}
      {checkoutProduct
        .reduce((acc, product) => acc + product.subtotal, 0)
        .toLocaleString("id-ID")}
    </p>
    <button className="btn btn-primary w-100">Bayar Sekarang</button>
  </div>
);

const Checkout = () => {
  const [checkoutProduct, setCheckoutProduct] = useState([]);

  useEffect(() => {
    const storedProduct = sessionStorage.getItem("checkout_product");
    if (storedProduct) {
      setCheckoutProduct(JSON.parse(storedProduct));
    }
  }, []);

  const updateQuantity = (id, action) => {
    setCheckoutProduct((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id === id) {
          let newQuantity =
            action === "increase" ? product.quantity + 1 : product.quantity - 1;
          newQuantity = Math.max(1, Math.min(newQuantity, product.stock));
          return {
            ...product,
            quantity: newQuantity,
            subtotal: newQuantity * product.price,
            totalWeight: newQuantity * product.weight,
          };
        }
        return product;
      })
    );
  };

  return (
    <div className="min-vh-100 bg-light">
      <Header />
      <div className="container mt-4">
        <p className="h3">Checkout</p>
        <div className="row">
          <div className="col-lg-8 col-12">
            <div className="d-flex flex-column gap-2">
              <AddressSection />
              <ProductList
                checkoutProduct={checkoutProduct}
                updateQuantity={updateQuantity}
              />
            </div>
          </div>
          <div className="col-lg-4 col-12">
            <Summary checkoutProduct={checkoutProduct} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
