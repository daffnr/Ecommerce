import React from "react";

const Footer = ({ categories }) => {
  return (
    <footer
      style={{ minHeight: 100 }}
      className="container-fluid p-2 bg-white border"
    >
      <div className="container">
        <div className="row g-2 h-100 w-100">
          <div className="col-lg-3 col-12">
            <p className="fw-bold fs-5">AlmaDev</p>
            <p className="zfst-italic">Jln Merdeka Finansial Jawa Barat</p>
          </div>
          <div className="col-lg-3 col-12">
            <p className="fs-5 fw-bold">Kategori Produk</p>
            {categories?.map((item, i) => (
              <p key={i} className="pointer">
                {item.name}
              </p>
            ))}
          </div>
          <div className="col-lg-3 col-12">
            <p className="fs-5 fw-bold">Keamanan & Privasi</p>
            <p className="pointer">Syarat dan Ketentuan</p>
            <p className="pointer">Kebijakan Privasi</p>
          </div>
          <div className="col-lg-3 col-12 d-flex align-items-center justify-content-center">
            <div
              className="overflow-hidden"
              style={{ height: 100, width: 100 }}
            >
              <img
                src="/image/logo.png"
                width="100%"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
