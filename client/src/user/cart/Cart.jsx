import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import { products } from "../../Data";
import Products from "./Products";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState(products.slice(0, 2));
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const navigate = useNavigate();

  const handleSelectProduct = (product, quantity, weight, price, isChecked) => {
    let updatedItems;
    if (isChecked) {
      updatedItems = [
        ...selectedItems,
        { ...product, quantity, weight, price },
      ];
    } else {
      updatedItems = selectedItems.filter((item) => item.id !== product.id);
    }
    setSelectedItems(updatedItems);
  };

  useEffect(() => {
    const total = selectedItems.reduce((acc, item) => acc + item.price, 0);
    const weight = selectedItems.reduce((acc, item) => acc + item.weight, 0);
    setTotalPrice(total);
    setTotalWeight(weight);
  }, [selectedItems]);

  const handleBuy = () => {
    sessionStorage.removeItem("checkout_product");

    const checkoutProduct = selectedItems.map((item) => ({
      id: item.id,
      name: item.name,
      img: item.images[0].link,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.price,
      stock: item.stock,
      weight: item.weight,
    }));

    sessionStorage.setItem("checkout_product", JSON.stringify(checkoutProduct));

    navigate("/checkout");
  };

  return (
    <Layout>
      <div className="container mt-4">
        <p className="h3">Keranjang</p>
        <div className="row">
          <div className="col-lg-8 col-12">
            <div className="d-flex flex-column gap-2">
              {cartItems?.map((product, i) => (
                <Products
                  key={i}
                  product={product}
                  onSelect={handleSelectProduct}
                />
              ))}
            </div>
          </div>
          <div className="col-lg-4 col-12">
            <div className="rounded bg-white p-2 border shadow d-flex flex-column gap-2">
              <p className="h6">Ringkasan Belanja</p>
              <div className="d-flex justify-content-between">
                <p className="m-0">Total Harga</p>
                <p className="m-0 fw-bold">{`Rp ${totalPrice.toLocaleString(
                  "id-ID"
                )}`}</p>
              </div>
              <div className="d-flex justify-content-between">
                <p className="m-0">Total Berat</p>
                <p className="m-0 fw-bold">{`${totalWeight} gram`}</p>
              </div>
              <button
                className="btn btn-success w-100"
                onClick={handleBuy}
                disabled={selectedItems.length === 0}
              >
                Beli
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
