import React from "react";

const createMarkup = (html) => {
  return { __html: html };
};

const Desc = ({ product }) => {
  return (
    <div className="d-flex flex-column gap-2 rounded bg-white p-2 border border-2 shadow">
      <p className="h4 m-0">{product.name}</p>
      <div className="d-flex gap-2">
        <p className="m-0">{`Terjual ${250}+`}</p>
        <div className="vr"></div>
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-star-fill" style={{ color: "#ffa534" }}></i>
          <p className="m-0">{product.rating}</p>
        </div>
      </div>
      <p className="h4 m-0">{`Rp ${parseFloat(product.price).toLocaleString(
        "id-ID"
      )}`}</p>

      <p
        className="m-0"
        dangerouslySetInnerHTML={createMarkup(product.description)}
      />

      <p className="h5 m-0">Ulasan Pembeli</p>
      {product.reviews?.map((review, index) => (
        <div
          key={index}
          className="d-flex flex-column gap-1 rounded bg-white p-2 border shdadow"
        >
          <div className="d-flex align-items-center justify-content-between gap-1">
            <div>
              <p className="h6 fst-italic m-0">{review.user}</p>
              <p className="m-0 fst-italic" style={{ fontSize: 10 }}>
                11 jam lalu
              </p>
            </div>
            <div className="d-flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <i
                  key={i}
                  className="bi bi-star-fill"
                  style={{ color: i < review.rating ? "#ffa534" : "#ccc" }}
                ></i>
              ))}
            </div>
          </div>
          <p className="m-0 fst-italic">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default Desc;
