import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminState {
  isAdminLogged: boolean;
  authToken: string | null;
  refreshToken: string | null;
  role: string;
}

const initialState: AdminState = {
  isAdminLogged: localStorage.getItem("adminToken") ? true : false,
  authToken: localStorage.getItem('adminToken'),
  refreshToken: localStorage.getItem("admimRefresh"),
  role: localStorage.getItem("Role") || "",
};

const adminSlice = createSlice({
  name: "admin",
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
      state.isAdminLogged = true;
      state.role = action.payload.role;
      state.authToken = action.payload.authToken;
      state.refreshToken = action.payload.refreshToken;

      localStorage.setItem("adminToken", action.payload.authToken);
      localStorage.setItem("adminRefresh", action.payload.refreshToken);
      localStorage.setItem("Role", action.payload.role);
    },
    clearToken: (state) => {
      state.isAdminLogged = false;
      state.role = '';
      state.authToken = null;
      state.refreshToken = null;
      
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminrefresh");
      localStorage.removeItem("Role");

    },
  },
});

export const { setToken, clearToken } = adminSlice.actions;
export default adminSlice.reducer;
