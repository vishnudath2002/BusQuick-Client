import axios from "axios";
import  store  from "../redux/store"; // Import your Redux store
import { setToken, clearToken } from "../redux/slices/authSlice";
const BASE_URL = import.meta.env.VITE_BASE_URL;




export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});




// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {

    const state = store.getState();
    const token = state.auth.authToken; // Access token from Redux
     
   
    if (token) {
      
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }
);



apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const state = store.getState()
  
    const role = state.auth.role;

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry ) {
      try {
       originalRequest._retry = true;
        const response = await axios.post(`${BASE_URL}/refresh-token`, {   }, { withCredentials: true });
      
       
        apiClient.defaults.headers.common["Authorization"] = `bearer ${response.data.accessToken}`

        const newToken = response.data.accessToken;



        store.dispatch(setToken({ authToken:newToken, refreshToken:'' , role }));

   
       originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.log(refreshError);
        store.dispatch(clearToken());
        window.location.href = "/login";

      }
    }

    return Promise.reject(error);
  }
);
