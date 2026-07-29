import { configureStore } from "@reduxjs/toolkit";
import { ApiProduct } from "./request/ApiProduct";
import { ApiCategory } from "./request/ApiCategory";
import AuthSlice from "./slice/AuthSlice";
import { ApiAuth } from "./request/ApiAuth";
import { ApiUser } from "./request/ApiUsers";
import { ApiAddress } from "./request/ApiAddress";
import {ApiOrder} from "./request/ApiOrder";

const store = configureStore({
  reducer: {
    auth: AuthSlice,
    [ApiAuth.reducerPath]: ApiAuth.reducer,
    [ApiUser.reducerPath]: ApiUser.reducer,
    [ApiAddress.reducerPath]: ApiAddress.reducer,
    [ApiProduct.reducerPath]: ApiProduct.reducer,
    [ApiCategory.reducerPath]: ApiCategory.reducer,
    [ApiOrder.reducerPath]: ApiOrder.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      ApiAuth.middleware,
      ApiUser.middleware,
      ApiAddress.middleware,
      ApiProduct.middleware,
      ApiCategory.middleware,
      ApiOrder.middleware,
    ]),
});

export default store;
