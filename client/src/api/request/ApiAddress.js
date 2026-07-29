import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ApiAddress = createApi({
  reducerPath: "/ApiAddress",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API}/address`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getCities: builder.mutation({
      query: (city) => ({
        url: `/get-cities/${city}`,
        method: "GET",
      }),
    }),
    addAddress: builder.mutation({
      query: (body) => ({
        url: "/add",
        method: "POST",
        body,
      }),
    }),
    getShippingCost: builder.mutation({
      query: ({ courier, origin, destination, weight }) => ({
        url: "/cost",
        method: "GET",
        params: {
          courier,
          origin,
          destination,
          weight,
        },
      }),
    }),
  }),
});

export const {
  useGetCitiesMutation,
  useAddAddressMutation,
  useGetShippingCostMutation,
} = ApiAddress;
