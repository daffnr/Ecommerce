import React from "react";
import { Menus } from "./Menus";
import { useNavigate } from "react-router-dom";

const Layout = ({ children, pageName }) => {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 bg-light">
      <div className="container-fluid bg-info">
        <header className="navbar navbar-dark sticky-top flex-md-nowrap p-2">
          <a className="navbar-brand col-md-3 col-lg-2 me-0 px-5" href="/">
            Nama Aplikasi
          </a>
          <button
            className="position-absolute  d-md-none collapsed btn btn-light"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#sidebarMenu"
            aria-controls="sidebarMenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="bi bi-list"></i>
          </button>

          <div className="navbar-nav">
            <div className="nav-item text-nowrap">
              <button className="btn btn-danger">
                <i className="bi bi-box-arrow-left"></i>
              </button>
            </div>
          </div>
        </header>
      </div>

      <div className="container-fluid">
        <div className="row" style={{ minHeight: "93vh" }}>
          <nav
            id="sidebarMenu"
            className="col-md-3 col-lg-2 d-md-block bg-white sidebar collapse border shadow"
          >
            <div className="position-sticky pt-3">
              <ul className="nav flex-column">
                {Menus.map((menu, i) => (
                  <li
                    key={i}
                    className="nav-item"
                    onClick={() => navigate(menu.link)}
                  >
                    <div className="nav-link d-flex align-items-center gap-2 pointer">
                      {menu.icon}
                      <p className="m-0">{menu.label}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom bg-white border p-2 rounded shadow">
              <h3 className="h4">{pageName}</h3>
            </div>

            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
