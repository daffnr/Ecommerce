import React, { useState, useEffect } from "react";

const ProductQuickPreviewModal = ({ id, product, categoryName, onEdit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = (product?.images || []).filter((img) => img && img.link);

  useEffect(() => {
    setCurrentIndex(0);
  }, [product]);

  const handlePrev = () => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const formatRupiah = (val) => {
    if (val === undefined || val === null || val === "") return "-";
    return "Rp " + parseFloat(val).toLocaleString("id-ID");
  };

  return (
    <div
      className="modal fade"
      id={id}
      tabIndex="-1"
      aria-labelledby="productQuickPreviewModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content bg-white text-dark border-0 shadow-lg rounded-3">
          <div className="modal-header border-bottom border-light bg-light py-3">
            <h5 className="modal-title fw-semibold text-truncate fs-5 text-dark" id="productQuickPreviewModalLabel" style={{ maxWidth: "80%" }}>
              Quick Preview - {product?.name || "Produk"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body p-4 p-lg-5 bg-white">
            <div className="row g-4 g-lg-5">
              {/* Left Column: Image Gallery */}
              <div className="col-12 col-md-6 d-flex flex-column align-items-center justify-content-center border-end border-light pb-4 pb-md-0">
                <div
                  className="position-relative bg-light rounded-3 border border-light-subtle d-flex align-items-center justify-content-center w-100 shadow-sm"
                  style={{ height: "420px", overflow: "hidden" }}
                >
                  {images.length > 0 ? (
                    <>
                      <img
                        src={images[currentIndex].link}
                        alt={`Preview ${currentIndex + 1}`}
                        className="rounded-3"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                          padding: "10px",
                        }}
                      />

                      {images.length > 1 && (
                        <>
                          <button
                            className="btn btn-sm position-absolute start-0 top-50 translate-middle-y ms-3 rounded-circle d-flex align-items-center justify-content-center"
                            onClick={handlePrev}
                            style={{
                              width: "42px",
                              height: "42px",
                              border: "1px solid rgba(0,0,0,0.1)",
                              backgroundColor: "rgba(255, 255, 255, 0.8)",
                              color: "black",
                              backdropFilter: "blur(4px)",
                              transition: "all 0.2s ease-in-out",
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = "rgba(13, 110, 253, 0.9)";
                              e.currentTarget.style.color = "white";
                              e.currentTarget.style.borderColor = "rgba(13, 110, 253, 1)";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
                              e.currentTarget.style.color = "black";
                              e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)";
                            }}
                            aria-label="Previous image"
                          >
                            <span className="fs-5" style={{ marginTop: "-2px" }}>&larr;</span>
                          </button>
                          <button
                            className="btn btn-sm position-absolute end-0 top-50 translate-middle-y me-3 rounded-circle d-flex align-items-center justify-content-center"
                            onClick={handleNext}
                            style={{
                              width: "42px",
                              height: "42px",
                              border: "1px solid rgba(0,0,0,0.1)",
                              backgroundColor: "rgba(255, 255, 255, 0.8)",
                              color: "black",
                              backdropFilter: "blur(4px)",
                              transition: "all 0.2s ease-in-out",
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = "rgba(13, 110, 253, 0.9)";
                              e.currentTarget.style.color = "white";
                              e.currentTarget.style.borderColor = "rgba(13, 110, 253, 1)";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
                              e.currentTarget.style.color = "black";
                              e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)";
                            }}
                            aria-label="Next image"
                          >
                            <span className="fs-5" style={{ marginTop: "-2px" }}>&rarr;</span>
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="text-center text-muted py-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="64"
                        height="64"
                        fill="currentColor"
                        className="bi bi-image text-secondary mb-3"
                        viewBox="0 0 16 16"
                      >
                        <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                        <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
                      </svg>
                      <p className="fs-5 fw-light m-0">Tidak ada gambar untuk produk ini</p>
                    </div>
                  )}
                </div>

                {images.length > 0 && (
                  <div className="d-flex align-items-center justify-content-between w-100 mt-3 px-1">
                    <span className="text-muted small fw-medium">
                      Gambar {currentIndex + 1} dari {images.length}
                    </span>
                    <div className="d-flex gap-2 overflow-auto" style={{ maxWidth: "60%" }}>
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          className={`btn p-0 rounded-circle ${
                            idx === currentIndex ? "bg-primary" : "bg-light border border-secondary border-opacity-50"
                          }`}
                          onClick={() => setCurrentIndex(idx)}
                          style={{
                            width: "8px",
                            height: "8px",
                            border: "none",
                            transition: "all 0.2s",
                          }}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Product Info Details */}
              <div className="col-12 col-md-6 d-flex flex-column justify-content-between">
                <div>
                  <div className="mb-3">
                    <span className="badge bg-light border border-light-subtle text-secondary px-3 py-2 fs-7 rounded-2">
                      Kategori: <strong className="text-dark">{categoryName || "Tanpa Kategori"}</strong>
                    </span>
                  </div>
                  <h2 className="fw-bold text-dark text-break mb-3 fs-3 leading-tight">{product?.name || "-"}</h2>

                  {/* Financial Summary Cards (Only Harga Jual & Harga Modal) */}
                  <div className="row g-3 mb-4">
                    <div className="col-6">
                      <div className="p-3 rounded bg-light border border-light-subtle text-center h-100 d-flex flex-column justify-content-center shadow-sm">
                        <span className="text-muted fs-8 text-uppercase fw-semibold mb-1 tracking-wider" style={{ letterSpacing: "0.5px" }}>Harga Jual</span>
                        <span className="text-dark fw-bold fs-6 text-truncate">{formatRupiah(product?.price)}</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-3 rounded bg-light border border-light-subtle text-center h-100 d-flex flex-column justify-content-center shadow-sm">
                        <span className="text-muted fs-8 text-uppercase fw-semibold mb-1 tracking-wider" style={{ letterSpacing: "0.5px" }}>Harga Modal</span>
                        <span className="text-dark fw-bold fs-6 text-truncate">{formatRupiah(product?.capital)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Inventory / Spec Summary */}
                  <div className="row g-3 mb-4">
                    <div className="col-6">
                      <div className="p-3 rounded bg-light border border-light-subtle d-flex align-items-center justify-content-between shadow-sm">
                        <span className="text-muted fs-7">Stok</span>
                        <span className="text-dark fw-bold fs-6">{product?.stock !== undefined ? `${product.stock} unit` : "-"}</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-3 rounded bg-light border border-light-subtle d-flex align-items-center justify-content-between shadow-sm">
                        <span className="text-muted fs-7">Berat</span>
                        <span className="text-dark fw-bold fs-6">{product?.weight ? `${product.weight} gram` : "-"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rich Text Description Box */}
                <div className="d-flex flex-column mb-3">
                  <h6 className="fw-semibold text-muted mb-2">Deskripsi Produk</h6>
                  <div
                    className="p-3 rounded bg-light border border-light-subtle text-secondary overflow-auto"
                    style={{ maxHeight: "170px", minHeight: "120px", fontSize: "0.95rem", lineHeight: "1.6" }}
                    dangerouslySetInnerHTML={{ __html: product?.description || "Tidak ada deskripsi." }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer border-top border-light bg-light py-3">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm px-4 py-2 rounded-2"
              data-bs-dismiss="modal"
              style={{ transition: "all 0.2s ease-in-out" }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#dc3545";
                e.currentTarget.style.color = "white";
                e.currentTarget.style.borderColor = "#dc3545";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "";
                e.currentTarget.style.color = "";
                e.currentTarget.style.borderColor = "";
              }}
            >
              Tutup
            </button>
            {onEdit && (
              <button
                type="button"
                className="btn btn-primary btn-sm px-4 py-2 rounded-2 fw-semibold"
                data-bs-toggle="modal"
                data-bs-target="#addProduct"
                onClick={() => onEdit(product)}
              >
                Edit Produk
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickPreviewModal;
