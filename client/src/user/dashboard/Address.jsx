/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  useGetProvincesQuery,
  useGetCitiesQuery,
  useGetDistrictsQuery,
  useGetVillagesQuery,
  useAddAddressMutation,
} from "../../api/request/ApiAddress";
import { toast } from "react-toastify";
import { useLoadUserMutation } from "../../api/request/ApiAuth";

const Address = ({ user }) => {
  const [formData, setFormData] = useState({
    id: "",
    province_id: "",
    province: "",
    city_id: "",
    city: "",
    district: "",
    village_id: "",
    village: "",
    detail: "",
  });

  const { data: provinces } = useGetProvincesQuery();

  const { data: cities } = useGetCitiesQuery(formData.province_id, {
    skip: !formData.province_id,
  });

  const { data: districts } = useGetDistrictsQuery(formData.city_id, {
    skip: !formData.city_id,
  });

  const { data: villages } = useGetVillagesQuery(formData.district_id, {
    skip: !formData.district_id,
  });

  const [addAddress, { data, isSuccess, isLoading, error, reset }] =
    useAddAddressMutation();
  const [loadUser] = useLoadUserMutation();

  const handleChange = (e, list, idKey, nameKey) => {
    const { name, value } = e.target;
    const selectedItem = list?.find((item) => item[idKey] == value);

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      [name.replace("_id", "")]: selectedItem ? selectedItem[nameKey] : "",
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();

    addAddress(formData);
  };

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.address?.id || "",
        province_id: user.address?.province_id || "",
        province: user.address?.province || "",
        city_id: user.address?.city_id || "",
        city: user.address?.city || "",
        district_id: user.address?.district_id || "",
        district: user.address?.district || "",
        village_id: user.address?.village_id || "",
        village: user.address?.village || "",
        detail: user.address?.detail || "",
      });
    }
  }, [user]);

  useEffect(() => {
  if (isSuccess) {
    toast.success(data.message);
    reset();

    setFormData({
      id: "",
      province_id: "",
      province: "",
      city_id: "",
      city: "",
      district_id: "",
      district: "",
      village_id: "",
      village: "",
      detail: "",
    });

    loadUser();
  }

  if (error) {
    toast.error(error.data.message);
    reset();
  }
}, [isSuccess, data, error]);
  return (
    <form className="d-flex flex-column gap-3" onSubmit={submitHandler}>
      <select
        name="province_id"
        id="province"
        className="form-select"
        value={formData.province_id || ""}
        onChange={(e) => handleChange(e, provinces, "id", "name")}
      >
        <option value="" hidden>
          Provinsi
        </option>
        {provinces?.map((province, i) => (
          <option key={i} value={province.id}>
            {province.name}
          </option>
        ))}
      </select>

      <select
        name="city_id"
        id="city"
        className="form-select"
        value={formData.city_id || ""}
        onChange={(e) => handleChange(e, cities, "id", "name")}
      >
        <option value="" hidden>
          Kota / Kabupaten
        </option>

        {cities?.map((city, i) => (
          <option key={i} value={city.id}>
            {city.name}
          </option>
        ))}
      </select>

      <select
        name="district_id"
        id="district"
        className="form-select"
        value={formData.district_id || ""}
        onChange={(e) => handleChange(e, districts, "id", "name")}
      >
        <option value="" hidden>
          Kecamatan
        </option>

        {districts?.map((district, i) => (
          <option key={i} value={district.id}>
            {district.name}
          </option>
        ))}
      </select>

      <select
        name="village_id"
        id="village"
        className="form-select"
        value={formData.village_id || ""}
        onChange={(e) => handleChange(e, villages, "id", "name")}
      >
        <option value="" hidden>
          Desa
        </option>

        {villages?.map((village, i) => (
          <option key={i} value={village.id}>
            {village.name}
          </option>
        ))}
      </select>

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
