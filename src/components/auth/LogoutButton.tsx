import { useDispatch } from 'react-redux';
import { logout } from '../../api/authApi';
import { LogOut } from 'lucide-react';

export const LogoutButton = () => {
  const dispatch = useDispatch();
  
  const handleLogout = async () => {
    await logout(dispatch);
  };
  return (
    <LogOut onClick={handleLogout} />
  ) 
}