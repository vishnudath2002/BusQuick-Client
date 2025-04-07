import React from 'react';

import RegisterForm from '../../components/auth/RegisterForm';
import { register } from '../../api/authApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
const RegisterPage: React.FC = () => {

   
    const navigate =  useNavigate()

    const handleRegister = async (
      name:string,
      email:string,
      password:string,
      phone:string,
      role: string) => {
     


      try {
        const response = await register(name,email,password,phone,role);
        if(response.success){
          localStorage.removeItem("otpTimer");  
          localStorage.removeItem("otpTimestamp");  
          toast.success("Otp Created Successfully!")
          navigate('/otp',{state:{email:email}})
        }else{
          toast.error(response.message);
        }
      
      } catch (err) {
      
        if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.error('An unknown error occurred:', err);
        }

      }
  };
  return <RegisterForm onSubmit={handleRegister}/>;
};

export default RegisterPage;
