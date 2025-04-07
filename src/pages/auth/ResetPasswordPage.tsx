import React from "react";

import { resetPassword } from "../../api/authApi";

import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleReset = async (password: string) => {
    try {
      const response = await resetPassword(email, password);
      if (response.success == true) {
        toast.success("Your password  Successfully changed!", {});

        navigate("/login");
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

  return <ResetPasswordForm onSubmit={handleReset} />;
};

export default ResetPasswordPage;
