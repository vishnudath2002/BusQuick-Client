import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface UserSignupProps {
  children: React.ReactNode; 
}


const UserSignup: React.FC<UserSignupProps> = ({ children }) => {
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

export default UserSignup;
