import React from 'react';
import OtpForm from '../../components/auth/OtpForm';
import { otpResend, otpVerify } from '../../api/authApi';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const OtpPage: React.FC = () => {
  const location = useLocation();
  const email = location.state?.email;
  const isForgot = location.state?.isForgot;
  const navigate = useNavigate();

  

  const handleOtp = async (otp: string) => {
    try {
      const response = await otpVerify(email, otp);
      console.log("otp",response)
      if (response.success) {
        toast.success('Your Registration completed!', {
          style: {
            border: '1px solid #4CAF50',
            padding: '16px',
            color: '#4CAF50',
          },
        });
        navigate('/login');
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

  const resendOtp = async () => {
    try {
      const response = await otpResend(email);
      if (response.success == true) {
        toast.success('OTP resent successfull!');
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

  const handleForgot = async (otp: string) => {
    try {

      const response = await otpVerify(email, otp);
      if (response.success) {
        toast.success('Verification Successful!');
        navigate('/resetpassword',{state:{email}});
      }
    } catch (err) {
      toast.error('Invalid OTP');
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error('An unknown error occurred:', err);
      }
    }
  };

  const handleSubmit = (otp: string) => {
    if (isForgot) {
      handleForgot(otp);
    } else {
      handleOtp(otp);
    }
  };

  return <OtpForm onSubmit={handleSubmit} onResend={resendOtp} />;
};

export default OtpPage;
