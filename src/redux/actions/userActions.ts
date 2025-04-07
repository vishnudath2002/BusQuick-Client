import { AppDispatch } from '../store';
import { setUser , clearUser } from '../slices/userSlice';

export const performStoreUser = (user: { id: string; name: string; email: string } ) => (dispatch: AppDispatch) => {

  dispatch(setUser(user));
};

export const performClearUser = () => (dispatch: AppDispatch) => {

  dispatch(clearUser());
};
