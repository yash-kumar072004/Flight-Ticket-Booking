import { createSlice } from "@reduxjs/toolkit";
import { getCurrentUser, setCurrentUser, logoutUser } from "../../utils/authStorage.js";

const initialUser = getCurrentUser();

const initialState = {
  user: initialUser,
  isAuthenticated: Boolean(initialUser),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      setCurrentUser(action.payload);
    },
    registerSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      setCurrentUser(action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      logoutUser();
    },
    updateProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        setCurrentUser(state.user);
      }
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginSuccess,
  registerSuccess,
  logout,
  updateProfile,
  setAuthError,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
