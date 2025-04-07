import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";


interface UserRouteProps {
  children: React.ReactNode;
}

const UserRoute: React.FC<UserRouteProps> = ({ children }) => {
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const role = useSelector((state: RootState) => state.auth.role);


  useEffect(() => {
  
    if (!isLoggedIn && role !== "user") {
      navigate("/login");
    } 
    
  }, [isLoggedIn, role, navigate]);

  return children;
};

export default UserRoute;
