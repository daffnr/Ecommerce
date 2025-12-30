import React from "react";

const TableComponent = ({ children, height, id }) => {
  return (
    <div className="bg-white p-2 border shadow rounded">
      <div style={{ height: height }} className="d-flex flex-column gap-2">
        <div className="d-flex flex-wrap align-items-center justify-content-between">
          <input
            className="form-control"
            name="search"
            id="search"
            placeholder="Ketikan di sini..."
            style={{ width: 300 }}
          />

          <div className="d-flex gap-2">
            <select
              style={{ width: 100 }}
              name="limit"
              id="limit"
              className="form-select"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>

            {id && (
              <button
                data-bs-toggle="modal"
                data-bs-target={`#${id}`}
                className="btn btn-success"
              >
                Tambah
              </button>
            )}
          </div>
        </div>
        {/* Table */}
        <div className="table-responsive rounded border">{children}</div>

        {/* fungsi */}
        <div className="d-flex align-items-center justify-content-between flex-wrap">
          <nav aria-label="Page navigation example" className="m-0">
            <ul className="pagination">
              <li className="page-item">
                <div className="page-link" aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
                </div>
              </li>
              <li className="page-item">
                <div className="page-link">1</div>
              </li>
              <li className="page-item">
                <div className="page-link">2</div>
              </li>
              <li className="page-item">
                <div className="page-link">3</div>
              </li>
              <li className="page-item">
                <a className="page-link" aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav>

          <p className="m-0">
            Total Data <span>100</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TableComponent;
