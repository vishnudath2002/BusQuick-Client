import React from 'react';
import ResetPasswordForm from '../../components/auth/ForgotPassword';
import { requestPasswordReset } from '../../api/authApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ResetPasswordPage: React.FC = () => {
    const navigate = useNavigate()
    const handleResetPassword = async (email:string) => {


        try {
           const response = await requestPasswordReset(email);
           if(response.success == true){
            toast.success('Otp Send Successfully!');
            navigate('/otp',{state:{email,isForgot:true}})
           }else{
            toast.error(response.message);
          }
        }catch (err) {
      
          if (err instanceof Error) {
            console.error(err.message);
          } else {
            console.error('An unknown error occurred:', err);
          }
  
        }
    
    }   
  return <ResetPasswordForm onSubmit={handleResetPassword}/>;
};

export default ResetPasswordPage;
