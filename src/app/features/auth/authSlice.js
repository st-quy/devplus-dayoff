import { getStorageData } from "@app/configs/storage";
import { ACCESS_TOKEN } from "@app/constants/auth";
import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
const checkAuth = () => Boolean(getStorageData(ACCESS_TOKEN));

const getUserRole = () => {
  try {
    const token = getStorageData(ACCESS_TOKEN);
    if (!token) return null;
    const decodedToken = jwtDecode(token);

    return decodedToken.role || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const getUserData = () => {
  try {
    const token = getStorageData(ACCESS_TOKEN);
    if (!token) return null;
    const decodedToken = jwtDecode(token);

    return decodedToken || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
const initialState = {
  isAuth: checkAuth(),
  role: getUserRole(),
  user: getUserData(),
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state) {
      state.isAuth = true;
      state.user = getUserData();
    },
    logout(state) {
      state.isAuth = false;
      state.role = null;
      state.user = null;
    },
    updateRole(state) {
      state.role = getUserRole();
    },
  },
});
const { reducer, actions } = authSlice;
export const { logout, login } = actions;
export default reducer;
