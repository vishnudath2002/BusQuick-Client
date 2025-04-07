import React , { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => { 
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.admin.isAdminLogged);
  const role = useSelector((state: RootState)=> state.admin.role)

useEffect(() => {
  
  if (!isLoggedIn && role != 'admin') {
    navigate('/adminlogin');
  }
}, [isLoggedIn, role, navigate]); 

  return children;
};

export default AdminRoute;
