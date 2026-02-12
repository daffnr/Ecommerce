import { configureStore } from "@reduxjs/toolkit";
import { ApiProduct } from "./request/ApiProduct";
import { ApiCategory } from "./request/ApiCategory";

const store = configureStore({
  reducer: {
    [ApiProduct.reducerPath]: ApiProduct.reducer,
    [ApiCategory.reducerPath]: ApiCategory.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      ApiProduct.middleware,
      ApiCategory.middleware,
    ]),
});

export default store;
