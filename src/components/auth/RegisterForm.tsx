import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

interface RegisterFormProps {
  onSubmit: (name: string, email: string, password: string, phoneNumber: string, role: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
  const initialValues = {
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
  };

  const validationSchema = Yup.object({
    name: Yup.string()
    .trim()
    .required("Name is required")
    .matches(/^[A-Za-z]+(?: [A-Za-z]+)*(?:-[A-Za-z]+)?$/, "Enter a valid name")
    .min(2, "Name must be at least 2 characters"),
    email: Yup.string()
    .trim()
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please provide a valid email"
    ),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "Password must include uppercase, lowercase, number, and special character"
      )
      .required("Password is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
    role: Yup.string().required("Role is required"),
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
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              onSubmit(values.name, values.email, values.password, values.phone, values.role);
              console.log("Form submitted:", values);
            }}
          >
            {() => (
              <Form className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Register</h2>
                  <p className="mt-2 text-sm text-gray-600">Create your account to get started</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <Field
                      id="name"
                      name="name"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your name"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="you@example.com"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
                    />
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Number
                    </label>
                    <Field
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                      Select Role
                    </label>
                    <Field
                      as="select"
                      id="role"
                      name="role"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="user">User</option>
                      <option value="busOwner">Bus Owner</option>
                      <option value="busOwner">Operator</option>

                    </Field>
                    <ErrorMessage name="role" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-md bg-[#007074] px-4 py-2 text-sm font-semibold text-white shadow-sm 
                  hover:bg-[#005c5e] focus:outline-none focus:ring-2 focus:ring-[#007074] focus:ring-offset-2 
                  transition-colors duration-200"
                >
                  Start Your Journey
                </button>
              </Form>
            )}
          </Formik>

          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account?</span>{" "}
            <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </a>
          </div>

          {/* <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">Or</span>
            </div>
          </div>

          <a
            href="/"
            className="w-full flex items-center justify-center gap-3 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google logo" 
              className="w-5 h-5"
            />
            Register with Google
          </a> */}
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
