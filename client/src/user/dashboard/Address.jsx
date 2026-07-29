/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  useGetCitiesMutation,
  useAddAddressMutation,
} from "../../api/request/ApiAddress";
import { toast } from "react-toastify";
import { useLoadUserMutation } from "../../api/request/ApiAuth";

const Address = ({ user }) => {
  const [city, setCity] = useState("");
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  const filteredResult = result?.filter((item) =>
    item.subdistrict_name.toLowerCase().includes(search.toLowerCase()),
  );

  const [formData, setFormData] = useState({
    id: "",
    data_id: "",
    label: "",
    province_name: "",
    city_name: "",
    district_name: "",
    subdistrict_name: "",
    zip_code: "",
    detail: "",
  });

  const [
    getCities,
    {
      data: cities,
      isLoading: cLoading,
      isSuccess: cSuccess,
      error: cError,
      reset: cReset,
    },
  ] = useGetCitiesMutation();

  const [addAddress, { data, isSuccess, isLoading, error, reset }] =
    useAddAddressMutation();
  const [loadUser] = useLoadUserMutation();

  const getCitiesData = () => {
    getCities(city);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    addAddress(formData);
  };

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.address?.id || "",
        data_id: user.address?.data_id || "",
        label: user.address?.label || "",
        province_name: user.address?.province_name || "",
        city_name: user.address?.city_name || "",
        district_name: user.address?.district_name || "",
        subdistrict_name: user.address?.subdistrict_name || "",
        zip_code: user.address?.zip_code || "",
        detail: user.address?.detail || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (selectedCity) {
      setFormData({
        id: user.address?.id || "",
        data_id: selectedCity?.id,
        label: selectedCity?.label,
        province_name: selectedCity?.province_name,
        city_name: selectedCity?.city_name,
        district_name: selectedCity?.district_name,
        subdistrict_name: selectedCity?.subdistrict_name,
        zip_code: selectedCity?.zip_code,
        detail: user.address?.detail || "",
      });
    }
  }, [selectedCity]);

  useEffect(() => {
    if (cSuccess) {
      setResult(cities);
    }

    if (cError) {
      toast.error(cError.data.message);
      cReset();
    }
  }, [cSuccess, cError]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message);
      reset();

      setFormData({
        id: "",
        data_id: "",
        label: "",
        province_name: "",
        city_name: "",
        district_name: "",
        subdistrict_name: "",
        zip_code: "",
        detail: "",
      });
      setSelectedCity(null);
      loadUser();
    }

    if (error) {
      toast.error(error.data.message);
      reset();
    }
  }, [isSuccess, data, error]);

  return (
    <form className="d-flex flex-column gap-3" onSubmit={submitHandler}>
      <div className="d-flex gap-2">
        <input
          type="text"
          name="city"
          id="city"
          className="form-control"
          placeholder="Masukan kota tempat kamu tinggal"
          value={city || ""}
          onChange={(e) => setCity(e.target.value)}
        />

        <button
          type="button"
          className="btn btn-success"
          disabled={cLoading}
          onClick={getCitiesData}
        >
          {cLoading ? "Mencari..." : "Cari"}
        </button>
      </div>

      {result.length > 0 && (
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Masukan Kecamatan"
          className="form-control"
          value={search || ""}
          onChange={(e) => setSearch(e.target.value)}
        />
      )}

      {filteredResult.length > 0 && (
        <select
          className="form-select"
          onChange={(e) => {
            const selected = result?.find((item) => item.id == e.target.value);
            setSelectedCity(selected);
          }}
        >
          <option value="" hidden>
            Pilih Alamat
          </option>
          {filteredResult?.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      )}

      <input
        type="text"
        name="detail"
        id="detail"
        value={formData.label}
        className="form-control"
        readOnly
      />

      <textarea
        name="address"
        id="address"
        className="form-control"
        placeholder="Alamat Lengkap"
        rows={4}
        value={formData.detail}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, detail: e.target.value }))
        }
      ></textarea>

      <div className="text-end">
        <button className="btn btn-success" type="submit">
          Update
        </button>
      </div>
    </form>
  );
};

export default Address;
