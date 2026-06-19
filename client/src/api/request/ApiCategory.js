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
      query: ({ search, page, limit }) => ({
        url: "/get-categories",
        method: "GET",
        params: { search, page, limit },
      }),
      providesTags: ["categories"],
    }),
    addCategory: builder.mutation({
      query: (body) => ({
        url: "/add-category",
        method: "POST",
        body,
      }),
      invalidatesTags: ["categories"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
} = ApiCategory;
