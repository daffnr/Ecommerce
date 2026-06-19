import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ApiUser = createApi({
  reducerPath: "/ApiUser",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API}/user`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: (body) => ({
        url: "/update-profile",
        method: "PUT",
        body,
      }),
    }),
    getUsers: builder.query({
      query: ({search, page, limit}) => ({
        url: "/get-user",
        method: "GET",
        params: {search, page, limit}
      })
    })
  }),
});

export const { useUpdateProfileMutation, useGetUsersQuery } = ApiUser;
