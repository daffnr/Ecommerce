import { createSlice } from "@reduxjs/toolkit";
import { ApiAuth } from "../request/ApiAuth";

const AuthSlice = createSlice({
  name: "authization",
  initialState: {
    user: {},
    isSignin: false,
    isLoading: false,
  },
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload;
      state.isSignin = true;
      state.isLoading = false;
    },
    setLogout: (state) => {
      (state.user = {}), (state.isSignin = false);
    },
    setLoading: (state) => {
      state.isLoading = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(ApiAuth.endpoints.signin.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(
        ApiAuth.endpoints.signin.matchFulfilled,
        (state, { payload }) => {
          (state.user = payload),
            (state.isSignin = true),
            (state.isLoading = false);
        },
      )
      .addMatcher(ApiAuth.endpoints.signin.matchRejected, (state) => {
        (state.isLoading = false), (state.isSignin = false);
      }).addMatcher(ApiAuth.endpoints.loadUser.matchFulfilled,
        (state, {payload}) => {
            state.user= payload;
            state.isSignin= true;
        }
      )
  },
});

export const {setLogin, setLogout, setLoading} = AuthSlice.actions
export default AuthSlice.reducer;