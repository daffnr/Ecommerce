import React from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const formatRupiah = (value) => {
  if (value === undefined || value === null || value === "") return "";
  const cleanValue = value.toString().split(".")[0].replace(/[^0-9]/g, "");
  if (!cleanValue) return "";
  return "Rp " + parseInt(cleanValue, 10).toLocaleString("id-ID");
};

const ProductModal = ({
  id,
  name,
  setName,
  categoryId,
  setCategoryId,
  value,
  setValue,
  price,
  setPrice,
  capital,
  setCapital,
  stock,
  setStock,
  weight,
  setWeight,
  fileInput,
  unifiedImages = [],
  onAddImages,
  onRemoveImage,
  onSwapImages,
  categories,
  isLoading,
  closeHandler,
  addHandler,
}) => {
  const handleCapitalChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    setCapital(rawValue);
  };

  const handlePriceChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    setPrice(rawValue);
  };

  return (
    <div
      className="modal fade"
      id={id}
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">
              Detail / Tambah Produk
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={closeHandler}
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-2">
              <label htmlFor="prod_name" className="form-label mb-1">
                Nama Produk
              </label>
              <input
                type="text"
                name="name"
                id="prod_name"
                placeholder="Nama Produk"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-2">
              <label htmlFor="prod_cat" className="form-label mb-1">
                Kategori
              </label>
              <select
                name="categoryId"
                id="prod_cat"
                className="form-select"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">-- Pilih Kategori --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-2">
              <label htmlFor="prod_capital" className="form-label mb-1">
                Harga Modal (Capital)
              </label>
              <input
                type="text"
                name="capital"
                id="prod_capital"
                placeholder="Harga Modal"
                className="form-control"
                value={formatRupiah(capital)}
                onChange={handleCapitalChange}
              />
            </div>

            <div className="mb-2">
              <label htmlFor="prod_price" className="form-label mb-1">
                Harga Jual
              </label>
              <input
                type="text"
                name="price"
                id="prod_price"
                placeholder="Harga Jual"
                className="form-control"
                value={formatRupiah(price)}
                onChange={handlePriceChange}
              />
            </div>

            <div className="mb-2">
              <label htmlFor="prod_stock" className="form-label mb-1">
                Stok
              </label>
              <input
                type="number"
                name="stock"
                id="prod_stock"
                placeholder="Jumlah Stok"
                className="form-control"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>

            <div className="mb-2">
              <label htmlFor="prod_weight" className="form-label mb-1">
                Berat (gram)
              </label>
              <input
                type="number"
                name="weight"
                id="prod_weight"
                placeholder="Berat Produk"
                className="form-control"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label mb-2 fw-semibold">Gambar Produk (Urutan: Kiri ke Kanan)</label>
              
              {/* Image Previews & Actions Grid */}
              <div className="border border-2 rounded p-3 bg-light">
                <div className="row g-2 justify-content-start">
                  {unifiedImages.map((img, idx) => {
                    const src = img.type === "server" ? img.link : img.previewUrl;
                    return (
                      <div key={img.id || idx} className="col-4 text-center position-relative mb-2">
                        <div className="ratio ratio-1x1 rounded border border-secondary bg-white shadow-sm" style={{ overflow: "hidden", minHeight: "80px" }}>
                          <img
                            src={src}
                            alt={`Preview ${idx + 1}`}
                            style={{ objectFit: "cover", width: "100%", height: "100%" }}
                          />
                        </div>
                        
                        {/* Position Indicator Badge */}
                        <span className="badge bg-dark position-absolute top-0 start-0 m-2 shadow-sm" style={{ zIndex: 1 }}>
                          #{idx + 1}
                        </span>

                        {/* Delete Button */}
                        <button
                          type="button"
                          className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                          style={{ width: "22px", height: "22px", padding: 0, zIndex: 1, fontSize: "0.75rem" }}
                          onClick={() => onRemoveImage(img, idx)}
                          title="Hapus gambar"
                        >
                          ✕
                        </button>

                        {/* Swap Order Controls */}
                        <div className="d-flex justify-content-center gap-1 mt-1">
                          <button
                            type="button"
                            className="btn btn-outline-secondary py-0 px-2"
                            style={{ fontSize: "0.7rem", lineHeight: 1.2 }}
                            onClick={() => onSwapImages(idx, idx - 1)}
                            disabled={idx === 0}
                            title="Pindah ke kiri"
                          >
                            &larr;
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary py-0 px-2"
                            style={{ fontSize: "0.7rem", lineHeight: 1.2 }}
                            onClick={() => onSwapImages(idx, idx + 1)}
                            disabled={idx === unifiedImages.length - 1}
                            title="Pindah ke kanan"
                          >
                            &rarr;
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Placeholder State */}
                  {unifiedImages.length === 0 && (
                    <div className="text-muted py-4 text-center w-100">
                      <i className="bi bi-image" style={{ fontSize: "2rem" }}></i>
                      <div>Belum ada gambar terpilih</div>
                    </div>
                  )}
                </div>

                {/* Add Image Control Button */}
                <div className="mt-3 text-center">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary fw-semibold px-3"
                    onClick={() => fileInput.current?.click()}
                  >
                    Tambah Gambar
                  </button>
                </div>
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                name="images"
                id="prod_images"
                className="d-none"
                accept="image/*"
                multiple
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const filesArray = Array.from(e.target.files);
                    onAddImages(filesArray);
                    e.target.value = "";
                  }
                }}
                ref={fileInput}
              />
            </div>

            <div className="mb-2">
              <label htmlFor="prod_desc" className="form-label mb-1">
                Deskripsi
              </label>
              <div className="border border-2 rounded overflow-hidden">
                <ReactQuill
                  placeholder="Masukkan Deskripsi Produk"
                  theme="snow"
                  value={value}
                  onChange={setValue}
                  style={{ height: 300 }}
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={closeHandler}
            >
              Batal
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={addHandler}
              disabled={isLoading}
            >
              {isLoading ? "menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
