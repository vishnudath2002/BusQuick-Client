import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface UserLoginRouteProps {
  children: React.ReactNode; 
}


const UserLoginRoute: React.FC<UserLoginRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const role = useSelector((state: RootState) => state.auth.role);
 
  useEffect(() => {
    if (isLoggedIn) {
      if (role === "user") {
        navigate("/home");
      } else if (role === "busOwner") {
        navigate("/ownerhome");
      } else if (role === "admin") {
        navigate("/admindash");
      }
    }
  }, [isLoggedIn, navigate, role]);

  
  if (isLoggedIn) {
    return null; 
  }

  return children;
};

export default UserLoginRoute;
