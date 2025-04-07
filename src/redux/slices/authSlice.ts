import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  authToken: string | null;
  refreshToken: string | null;
  role: string;
}

const initialState: AuthState = {
  isLoggedIn: localStorage.getItem("authToken") ? true : false,
  authToken: localStorage.getItem('authToken'),
  refreshToken: localStorage.getItem("refreshToken"),
  role: localStorage.getItem("userRole") || "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (
      state,
      action: PayloadAction<{
        authToken: string;
        refreshToken: string;
        role: string;
      }>
    ) => {
      state.isLoggedIn = true;
      state.role = action.payload.role;
      state.authToken = action.payload.authToken;
      state.refreshToken = action.payload.refreshToken;

      localStorage.setItem("authToken", action.payload.authToken);
      localStorage.setItem("RefreshToken", action.payload.refreshToken);
      localStorage.setItem("userRole", action.payload.role);
    },
    clearToken: (state) => {
      state.isLoggedIn = false;
      state.role = '';
      state.authToken = null;
      state.refreshToken = null;
      
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRole");

    },
  },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
