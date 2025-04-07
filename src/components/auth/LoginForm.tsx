import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });


  const formik = useFormik({
    initialValues: {
      email: 'sree@gmail.com',
      password: 'Asdf1@',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(values.email, values.password);
    },
  });
  

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
          alt="Bus Travel Adventure"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-gray-900/25" />
      </div>

      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-sm">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Login</h2>
            </div>

            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...formik.getFieldProps('email')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
               
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500 text-sm">{formik.errors.email}</div>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...formik.getFieldProps('password')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="text-red-500 text-sm">{formik.errors.password}</div>
                )}
              </div>

              <div className="text-right text-sm">
          
                <a href="/forgotpassword" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
            </div>
            
            </div>

            

            <button
              type="submit"
              disabled={!formik.isValid || formik.isSubmitting}
              className="w-full rounded-md bg-[#007074] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#005c5e] focus:outline-none focus:ring-2 focus:ring-[#007074] focus:ring-offset-2 transition-colors duration-200"
            >
              Start Your Journey
            </button>
          </form>

          <div className="text-center text-sm">
            <span className="text-gray-600">Create New Account?</span>{' '}
            <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Register
            </a>
          </div>

          {/* <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 text-gray-500 bg-white">Or</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#007074]"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google logo" 
              className="w-5 h-5"
            />
            Login with Google
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
