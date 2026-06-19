import {useState} from "react";

const TableComponent = ({
  children,
  height,
  id,
  totalData,
  page,
  setPage,
  totalPages,
  setLimit,
  setSearch,
}) => {

  const [limitValue, setLimitValue] = useState(1)

  const handleLimit = (e) =>{
    const newLimit = parseInt(e.target.value)
    setLimit(newLimit)
    setLimitValue(newLimit)

  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
  const getPageNumbers = () => {
    let pages = [];
    if (totalPages <= 3) {
      pages = [...Array(totalPages).keys()].map((i) => i + 1);
    } else {
      if (page == 1) {
        pages = [1, 2, 3];
      } else if (page == totalPages) {
        pages = [totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [page - 1, page, page + 1];
      }
    }

    return pages;
  };
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
            onChange={(e) => setSearch (e.target.value)}
          />

          <div className="d-flex gap-2">
            <select
              style={{ width: 100 }}
              name="limit"
              id="limit"
              className="form-select"
              value={limitValue || ""}
              onChange={handleLimit}
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
              <li className={`page-item ${page == 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  aria-label="Previous"
                  onClick={() => handlePageChange(page - 1)}
                >
                  <span aria-hidden="true">&laquo;</span>
                </button>
              </li>
              {getPageNumbers().map((pageNumber) => (
                <li key={pageNumber} className={`page-item ${page == pageNumber ? "active" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                </li>
              ))}

              <li
                className={`page-item ${page == totalPages ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  aria-label="Next"
                  onClick={() => handlePageChange(page + 1)}
                >
                  <span aria-hidden="true">&raquo;</span>
                </button>
              </li>
            </ul>
          </nav>

          <p className="m-0">
            Total Data <span>{totalData}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TableComponent;
