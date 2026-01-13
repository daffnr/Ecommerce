import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ApiProduct = createApi({
  reducerPath: "/apiProduct",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API}/product`,
    credentials: "include",
  }),
  tagTypes: ["products"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({
        url: "/get-products",
        method: "GET",
      }),
      providesTags: ["products"],
    }),
  }),
});

export const { useGetProductsQuery } = ApiProduct;
