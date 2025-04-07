import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"; 
import userReducer from "./slices/userSlice"
import adminReducer from "./slices/adminSlice"


const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    admin: adminReducer
  },
});

// Define types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
