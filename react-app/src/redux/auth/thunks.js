import { createAsyncThunk } from "@reduxjs/toolkit";
import AuthService from "./service";

export const actionTypes = {
  // LOGIN: "auth/login",
  CHECK_AUTH: "auth/check_auth",
};

export const checkAuthAsync = createAsyncThunk(
  actionTypes.CHECK_AUTH,
  async () => {
    return await AuthService.checkAuth();
  }
);
