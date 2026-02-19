import { configureStore } from "@reduxjs/toolkit";
import { ApiProduct } from "./request/ApiProduct";
import { ApiCategory } from "./request/ApiCategory";
import AuthSlice from "./slice/AuthSlice";
import { ApiAuth } from "./request/ApiAuth";

const store = configureStore({
  reducer: {
    auth: AuthSlice,
    [ApiProduct.reducerPath]: ApiProduct.reducer,
    [ApiCategory.reducerPath]: ApiCategory.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      ApiAuth.middleware,
      ApiProduct.middleware,
      ApiCategory.middleware,
    ]),
});

export default store;
