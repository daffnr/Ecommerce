import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSmall, setSmall] = useState(window.innerWidth > 768);
  const isUser = false;
  const home = location.pathname;

  useEffect(() => {
    const handleResize = () => {
      setSmall(window.innerWidth >= 821);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className="container-fluid d-flex align-items-center bg-info position-fixed"
      style={{ zIndex: 1000 }}
    >
      <div className="container p-2">
        <div className="row">
          {isSmall && (
            <div className={`${home === "/" ? "col-lg-4" : "col-lg-6"}`}>
              <div
                className="overflow-hidden pointer"
                style={{ height: 50, width: 50 }}
                onClick={() => navigate("/")}
              >
                <img
                  src="/image/logo.png"
                  width="100%"
                  style={{ objectFit: "cover" }}
                  alt="Logo"
                />
              </div>
            </div>
          )}

          {home === "/" && (
            <div className="col-lg-4 col-6 d-flex align-items-center">
              <input
                type="text"
                placeholder="Cari apa aja..."
                className="form-control"
              />
            </div>
          )}

          <div
            className={`${
              home === "/" ? "col-lg-4" : "col-lg-6"
            } col-6 d-flex align-items-center justify-content-end`}
          >
            {isUser ? (
              <div className="d-flex gap-2">
                <button
                  className="btn btn-light"
                  onClick={() => navigate("/cart")}
                >
                  <i className="bi bi-cart"></i>
                </button>
                <div className="vr"></div>
                <button
                  className="btn btn-light"
                  onClick={() => navigate("/user-dashboard")}
                >
                  Dashboard
                </button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <button
                  className="btn btn-light"
                  onClick={() => navigate("/signin")}
                >
                  Masuk
                </button>
                <div className="vr"></div>
                <button
                  className="btn btn-light"
                  onClick={() => navigate("/signup")}
                >
                  Daftar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
