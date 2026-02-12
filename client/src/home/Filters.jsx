import React, {useState} from "react";

const Filters = ({setLimit}) => {

  const [value, setValue] = useState("")

  const handleLimit = (e) => {
    const newLimit = parseInt(e.target.value)
    setLimit(newLimit)
    setValue(newLimit)
  }
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

      <select name="price" id="sort" className="form-select pointer" value={value || ""}onChange={handleLimit}>
        <option value="" hidden>
          --Tampilkan Produk--
        </option>
        <option value="14">14</option>
        <option value="28">28</option>
        <option value="42">42</option>
        <option value="64">64</option>
        <option value="128">128</option>
      </select>
    </div>
  );
};

export default Filters;
