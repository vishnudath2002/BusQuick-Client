import { AppDispatch } from '../store';
import { setToken , clearToken} from '../slices/authSlice';
import { performClearUser } from './userActions';


export const performLogin = (authToken: string, refreshToken: string,role:string) => (dispatch: AppDispatch) => {
  // Perform login logic here
  dispatch(setToken({ authToken, refreshToken,role }));
};

export const performLogout = () => (dispatch: AppDispatch) => {
  // Perform logout logic here
  dispatch(clearToken());

  dispatch(performClearUser());

};
