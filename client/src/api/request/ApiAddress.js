import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ApiAddress = createApi({
  reducerPath: "/ApiAddress",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API}/address`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getProvinces: builder.query({
      query: () => ({
        url: "/get-provinces",
        method: "GET",
      }),
    }),
    getCities: builder.query({
      query: (provinceId) => ({
        url: `/get-cities/${provinceId}`,
        method: "GET",
      }),
    }),
    getDistricts: builder.query({
      query: (cityId) => ({
        url: `/get-district/${cityId}`,
        method: "GET",
      }),
    }),
    getVillages: builder.query({
      query: (districtId) => ({
        url: `/get-villages/${districtId}`,
        method: "GET",
      }),
    }),
    addAddress: builder.mutation({
      query: (body) => ({
        url: "/add",
        method: "POST",
        body
      })
    })
  }),
});

export const {
  useGetProvincesQuery,
  useGetCitiesQuery,
  useGetDistrictsQuery,
  useGetVillagesQuery,
  useAddAddressMutation,
} = ApiAddress;
