import React, { useState, useEffect, useRef } from "react";
import Layout from "../layout/Layout";
import TableComponent from "../table/TableComponent";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
  useUpdateProductMutation,
} from "../../api/request/ApiProduct";
import { useGetCategoriesQuery } from "../../api/request/ApiCategory";
import { toast } from "react-toastify";
import ProductModal from "./ProductModal";
import ProductQuickPreviewModal from "./ProductQuickPreviewModal";



const AdminProd = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const id = "addProduct";

  // Form states
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [value, setValue] = useState("");
  const [price, setPrice] = useState("");
  const [capital, setCapital] = useState("");
  const [stock, setStock] = useState("");
  const [weight, setWeight] = useState("");
  
  // Image states
  const [unifiedImages, setUnifiedImages] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);
  
  const [detail, setDetail] = useState({});
  const [previewProduct, setPreviewProduct] = useState(null);
  const fileInput = useRef(null);


  const { data: rawData = {} } = useGetProductsQuery({ search, page, limit });
  const { products = [], totalProducts = 0, totalPages = 0 } = rawData;

  const { data: categories = [] } = useGetCategoriesQuery({});
  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.id] = cat.name;
    return acc;
  }, {});

  const [deleteProduct] = useDeleteProductMutation();
  const [createProduct, createResult] = useCreateProductMutation();
  const [updateProduct, updateResult] = useUpdateProductMutation();

  const isSuccess = createResult.isSuccess || updateResult.isSuccess;
  const isLoading = createResult.isLoading || updateResult.isLoading;
  const error = createResult.error || updateResult.error;
  const data = createResult.data || updateResult.data;

  const reset = () => {
    createResult.reset();
    updateResult.reset();
  };

  const addHandler = () => {
    const formData = new FormData();
    formData.append("categoryId", categoryId);
    formData.append("name", name);
    formData.append("desc", value);
    formData.append("price", price);
    formData.append("capital", capital);
    formData.append("stock", stock);
    formData.append("weight", weight);
    formData.append("removedImageIds", JSON.stringify(removedImageIds));

    const imageOrder = [];
    unifiedImages.forEach((img) => {
      if (img.type === "server") {
        imageOrder.push({ type: "server", link: img.link });
      } else {
        imageOrder.push({ type: "new" });
        formData.append("images", img.file);
      }
    });

    formData.append("imageOrder", JSON.stringify(imageOrder));

    if (detail.id) {
      updateProduct({ id: detail.id, body: formData });
    } else {
      createProduct(formData);
    }
  };

  const deleteHandler = async (id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus produk ini?");

    if (!confirmDelete) return;

    try {
      const result = await deleteProduct(id).unwrap();
      toast.success(result.message);
    } catch (err) {
      toast.error(err?.data?.message || "Gagal menghapus produk");
    }
  };

  const closeHandler = () => {
    setName("");
    setCategoryId("");
    setValue("");
    setPrice("");
    setCapital("");
    setStock("");
    setWeight("");
    unifiedImages.forEach((img) => {
      if (img.type === "new" && img.previewUrl) {
        URL.revokeObjectURL(img.previewUrl);
      }
    });
    setUnifiedImages([]);
    setRemovedImageIds([]);
    setDetail({});
    if (fileInput.current) {
      fileInput.current.value = "";
    }
  };

  useEffect(() => {
    if (detail && detail.id) {
      setName(detail.name || "");
      setCategoryId(detail.category_id || "");
      setValue(detail.description || "");
      setPrice(detail.price || "");
      setCapital(detail.capital || "");
      setStock(detail.stock !== undefined ? detail.stock : "");
      setWeight(detail.weight || "");

      // Filter out null/empty images
      const imgs = (detail.images || []).filter((img) => img && img.link);
      setUnifiedImages(
        imgs.map((img) => ({ type: "server", id: img.id, link: img.link }))
      );
      setRemovedImageIds([]);
    } else {
      setName("");
      setCategoryId("");
      setValue("");
      setPrice("");
      setCapital("");
      setStock("");
      setWeight("");
      setUnifiedImages([]);
      setRemovedImageIds([]);
    }
  }, [detail]);

  const handleAddImages = (filesArray) => {
    const newItems = filesArray.map((file) => ({
      type: "new",
      file,
      id: Math.random().toString(36).substring(7),
      previewUrl: URL.createObjectURL(file),
    }));
    setUnifiedImages([...unifiedImages, ...newItems]);
  };

  const handleRemoveImage = (img, index) => {
    if (img.type === "server") {
      setRemovedImageIds([...removedImageIds, img.id]);
    }
    if (img.type === "new" && img.previewUrl) {
      URL.revokeObjectURL(img.previewUrl);
    }
    setUnifiedImages(unifiedImages.filter((_, i) => i !== index));
  };

  const handleSwapImages = (idx1, idx2) => {
    const updated = [...unifiedImages];
    const temp = updated[idx1];
    updated[idx1] = updated[idx2];
    updated[idx2] = temp;
    setUnifiedImages(updated);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message);
      
      // Close Bootstrap modal programmatically
      const modalCloseBtn = document.querySelector(`#${id} [data-bs-dismiss="modal"]`);
      if (modalCloseBtn) {
        modalCloseBtn.click();
      } else {
        closeHandler();
      }
      
      reset();
    }

    if (error) {
      toast.error(error.data.message);
    }
  }, [data, isSuccess, error, id]);

  return (
    <Layout pageName={"Daftar Produk"}>
      <TableComponent
        height={"75vh"}
        totalData={totalProducts}
        page={page}
        setPage={(e) => setPage(e)}
        totalPages={totalPages}
        setLimit={(e) => setLimit(e)}
        setSearch={(e) => setSearch(e)}
        id={id}
      >
        <table className="table table-hover table-striped">
          <thead>
            <tr>
              <th className="text-center align-middle">No</th>
              <th className="text-center align-middle">Kategori</th>
              <th className="text-center align-middle">Gambar</th>
              <th className="text-center align-middle">Produk</th>
              <th className="text-center align-middle">Modal</th>
              <th className="text-center align-middle">Harga</th>
              <th className="text-center align-middle">Stok</th>
              <th className="text-center align-middle">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((item, i) => (
              <tr
                key={i}
                style={{ cursor: "pointer" }}
                data-bs-toggle="modal"
                data-bs-target="#productQuickPreviewModal"
                onClick={() => setPreviewProduct(item)}
                title="Klik baris untuk quick preview"
              >
                <td className="text-center align-middle">
                  {(page - 1) * limit + i + 1}
                </td>
                <td className="text-center align-middle">
                  {categoryMap[item.category_id] || "Tanpa Kategori"}
                </td>
                <td className="text-center align-middle">
                  <div
                    className="rounded overflow-hidden mx-auto"
                    style={{ height: 100, width: 100 }}
                  >
                    <img
                      src={item.images?.[0]?.link || ""}
                      alt={`Gambar produk ${item.name}`}
                      width="100%"
                      style={{ objectFit: "cover", height: "100%" }}
                    />
                  </div>
                </td>
                <td className="text-center align-middle">{item.name}</td>
                <td className="text-center align-middle">{`Rp ${parseFloat(
                  item.capital
                ).toLocaleString("id-ID")}`}</td>
                <td className="text-center align-middle">{`Rp ${parseFloat(
                  item.price
                ).toLocaleString("id-ID")}`}</td>
                <td className="text-center align-middle">{item.stock}</td>
                <td className="text-center align-middle" onClick={(e) => e.stopPropagation()}>
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target={`#${id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetail(item);
                      }}
                    >
                      Detail
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteHandler(item.id);
                      }}
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableComponent>

      <ProductModal
        id={id}
        name={name}
        setName={setName}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        value={value}
        setValue={setValue}
        price={price}
        setPrice={setPrice}
        capital={capital}
        setCapital={setCapital}
        stock={stock}
        setStock={setStock}
        weight={weight}
        setWeight={setWeight}
        fileInput={fileInput}
        unifiedImages={unifiedImages}
        onAddImages={handleAddImages}
        onRemoveImage={handleRemoveImage}
        onSwapImages={handleSwapImages}
        categories={categories}
        isLoading={isLoading}
        closeHandler={closeHandler}
        addHandler={addHandler}
      />
      <ProductQuickPreviewModal
        id="productQuickPreviewModal"
        product={previewProduct}
        categoryName={categoryMap[previewProduct?.category_id] || "Tanpa Kategori"}
        onEdit={(prod) => setDetail(prod)}
      />
    </Layout>
  );
};

export default AdminProd;
