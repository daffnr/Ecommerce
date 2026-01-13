import { configureStore } from "@reduxjs/toolkit";
import { ApiProduct } from "./request/ApiProduct";

const store = configureStore({
  reducer: {
    [ApiProduct.reducerPath]: ApiProduct.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([ApiProduct.middleware]),
});

export default store;
