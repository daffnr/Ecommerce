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
      query: ({search, page, limit, categoryId}) => ({
        url: "/get-products",
        method: "GET",
        params: {search, page, limit, categoryId}
      }),
      providesTags: ["products"],
    }),
    getProduct: builder.query({
      query: (id) => ({
        url:`/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetProductsQuery, useGetProductQuery } = ApiProduct;
