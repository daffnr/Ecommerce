import React from "react";
import { useNavigate } from "react-router-dom";

const Product = ({ product }) => {
  const navigate = useNavigate();

  const goToPage = (name, id) => {
    const formatted = name.replace(/\s+/g, "-");

    navigate(`/${id}/${formatted}`);
  };
  return (
    <div
      style={{ width: 180 }}
      className="rounded p-1 border bg-white pointer"
      onClick={() => goToPage(product.name, product.id)}
    >
      <div style={{ height: 170 }} className="w-100 border">
        <img
          src={product.images[0].link}
          alt={`Gambar produl ${product.name}`}
          width="100%"
          height="100%"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="mt-1 p-1">
        <p className="m-0" style={{ fontSize: 12 }}>
          {product.name.length >= 26
            ? product.name.slice(0, 26) + "..."
            : product.name}
        </p>
        <p className="m-0 fw-bold">{`Rp ${parseFloat(
          product.price
        ).toLocaleString("id-ID")}`}</p>

        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-star-fill" style={{ color: "#ffa534" }}></i>

          <p className="m-0">{product.rating}</p>

          <div className="vr"></div>

          <p className="m-0" style={{ fontSize: 12 }}>
            100+ terjual
          </p>
        </div>
      </div>
    </div>
  );
};

export default Product;
