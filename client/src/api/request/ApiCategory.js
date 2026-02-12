import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ApiCategory = createApi({
  reducerPath: "apiCategory",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API}/category`,
    credentials: "include",
  }),
  tagTypes: ["categories"],
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({
        url: "/get-categories",
        method: "GET",
      }),
      providesTags: ["categories"],
    }),
  }),
});

export const { useGetCategoriesQuery } = ApiCategory;
