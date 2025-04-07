import React from "react";
import { useDispatch } from "react-redux";
import LoginForm from "../../components/auth/LoginForm";
import { adminLogin } from "../../api/adminApi";
import { performAdminLogin } from "../../redux/actions/adminActions";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const AdminLogPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await adminLogin(email, password);

      if (response.success == true) {
       

        dispatch(
          performAdminLogin(
            response.authToken,
            response.refreshToken,
            response.user.role
          )
        );

       

        toast.success("Successfully Logined!");
        navigate("/admindash");
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
};

export default AdminLogPage;
