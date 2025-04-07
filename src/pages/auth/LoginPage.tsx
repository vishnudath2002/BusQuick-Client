import React  from "react";
import { useDispatch } from "react-redux";
import LoginForm from "../../components/auth/LoginForm";
import { login } from "../../api/authApi";
import { performLogin } from "../../redux/actions/authActions";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { performStoreUser } from "../../redux/actions/userActions";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  

  const handleLogin = async (email: string, password: string) => {



    try {
      const response = await login(email, password);
  
      if (response.success == true) {
        
        dispatch(performLogin(response.accessToken, response.refreshToken ,response.user.role));

        const { id, name, email } = response.user;
        dispatch(performStoreUser({ id, name, email }));

        toast.success("You have Successfully Logined!", {});
        if (response.user.role === "user") {
          navigate("/home");
        } else if (response.user.role === "owner") {
          navigate("/ownerhome");
        } else {
          navigate("/operatordash");
        }
      } else {
         
        toast.error(response.message);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("An unknown error occurred:", err);
      }
    }
  };


  return <LoginForm onSubmit={handleLogin} />;

};

export default LoginPage;
