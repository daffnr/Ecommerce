import React, { useState } from "react";

const Images = ({ product }) => {
  const [img, setImg] = useState(product.images[0].link);
  return (
    <div className="rounded p-2 bg-white border border-2 shadow w-100">
      <div className="overflow-hidden rounded" style={{ height: 240 }}>
        <img
          src={img}
          alt={`Gambar produk ${product.name}`}
          className="img-fluid"
          style={{ objectFit: "contain", width: "100%", height: "100%" }}
        />
      </div>

      <div className="d-flex gap-2 overflow-auto p-1 mt-2">
        {product.images?.map((img, i) => (
          <div
            key={i}
            className="rounded pointer border"
            style={{ height: 50, width: 50 }}
            onClick={() => setImg(img.link)}
          >
            <img
              src={img.link}
              alt={`Gambar produk ${product.name}`}
              className="img-fluid"
              style={{ objectFit: "contain", width: "100%", height: "100%" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Images;
