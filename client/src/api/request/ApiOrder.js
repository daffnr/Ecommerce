import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ApiOrder = createApi({
  reducerPath: "/ApiOrder",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API}/order`,
    credentials: "include",
  }),

  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (body) => ({
        url: "/create-order",
        method: "POST",
        body, 
      }),
    }),
  }),
});

export const { useCreateOrderMutation } = ApiOrder;