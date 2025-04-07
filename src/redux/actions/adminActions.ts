import { AppDispatch } from '../store';
import { setToken , clearToken } from '../slices/adminSlice';



export const performAdminLogin = (authToken: string, refreshToken: string,role:string) => (dispatch: AppDispatch) => {
  


  // Perform login logic here
  dispatch(setToken({ authToken, refreshToken,role }));
};

export const performAdminLogout = () => (dispatch: AppDispatch) => {
  // Perform logout logic here
  dispatch(clearToken());

 

};
