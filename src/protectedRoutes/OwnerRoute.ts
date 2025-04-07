import React , { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface OwnerRouteProps {
  children: React.ReactNode;
}

const OwnerRoute: React.FC<OwnerRouteProps> = ({ children }) => { 
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const role = useSelector((state: RootState)=> state.auth.role)



 useEffect(()=>{
  if (!isLoggedIn || role != 'busOwner') {
    navigate('/login');
  }
 },[isLoggedIn,role,navigate])
  

  return children;
};

export default OwnerRoute;
