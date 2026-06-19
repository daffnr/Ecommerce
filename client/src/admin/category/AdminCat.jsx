import Layout from "../layout/Layout";
import TableComponent from "../table/TableComponent";
import { useEffect, useState } from "react";
import {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
} from "../../api/request/ApiCategory";
import { toast } from "react-toastify";
import { useRef } from "react";

const AdminCat = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const id = "addCategory";

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [detail, setDetail] = useState({});
  const fileInput = useRef(null);

  const { data: rawData = {} } = useGetCategoriesQuery({ search, page, limit });
  const { categories = [], totalCategories, totalPages } = rawData;
  const [addCategory, { data, isSuccess, isLoading, error, reset }] =
    useAddCategoryMutation();

  const [deleteCategory] = useDeleteCategoryMutation();

  const addHandler = () => {
    const formData = new FormData();
    formData.append("id", detail.id ? detail.id : "");
    formData.append("name", name ? name : detail.name);
    formData.append("image", image);

    addCategory(formData);
  };

  const deleteHandler = async (id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus kategori ini?");

    if (!confirmDelete) return;

    try {
      const result = await deleteCategory(id).unwrap();

      toast.success(result.message);
    } catch (err) {
      toast.error(err?.data?.message || "Gagal menghapus kategori");
    }
  };

  const closeHandler = () => {
    setName("");
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message);
      setName("");
      setImage(null);
      setDetail({});
      if (fileInput.current) {
        fileInput.current.value = "";
      }
      reset();
    }

    if (error) {
      toast.error(error.data.message);
    }
  }, [data, isSuccess, error]);

  console.log(image);
  return (
    <Layout pageName={"Daftar Kategori"}>
      <TableComponent
        height={"75vh"}
        totalData={totalCategories}
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
              <th className="text-center align-middle">_id</th>
              <th className="text-center align-middle">Kategori</th>
              <th className="text-center align-middle">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((item, i) => (
              <tr key={i}>
                <td className="text-center align-middle">{i + 1}</td>
                <td className="text-center align-middle">{item.id}</td>
                <td className=" align-middle">
                  <div className="d-flex gap-2">
                    <img src={item.image} alt={item.name} className="circle" />

                    <p className="m-0">{item.name}</p>
                  </div>
                </td>
                <td className="text-center align-middle">
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target={`#${id}`}
                      onClick={() => setDetail(item)}
                    >
                      Detail
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteHandler(item.id)}
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
      <div
        className="modal fade"
        id={id}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                Modal title
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
              <input
                type="text"
                name="category"
                id="category_name"
                placeholder="Nama Category"
                className="form-control"
                value={name ? name : detail.name || ""}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="file"
                name="icon"
                className="form-control mt-2"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                ref={fileInput}
              />
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
    </Layout>
  );
};

export default AdminCat;
