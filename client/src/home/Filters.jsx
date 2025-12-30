import React from "react";

const Filters = () => {
  return (
    <div className="d-flex gap-4">
      <select name="price" id="sort" className="form-select pointer">
        <option value="" hidden>
          --Urutkan--
        </option>
        <option value="lowest">Terendah</option>
        <option value="lowest">Tertinggi</option>
        <option value="lowest">Terbaru</option>
        <option value="lowest">Terlaris</option>
      </select>

      <select name="price" id="sort" className="form-select pointer">
        <option value="" hidden>
          --Tampilkan Produk--
        </option>
        <option value="lowest">10</option>
        <option value="lowest">30</option>
        <option value="lowest">50</option>
      </select>
    </div>
  );
};

export default Filters;
