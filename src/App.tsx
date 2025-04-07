import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import store from './redux/store';
import LandingPage from './pages/user/landingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import OtpPage from './pages/auth/OtpPage';
import HomePage from './pages/user/HomePage';
import OwnHomePage from './pages/owner/OwnHomePage';
import AdminLogPage from './pages/admin/AdminLogPage';
import AdminDash from './pages/admin/AdminDash';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

//import Header from './components/layouts/Header';
//import Footer from './components/layouts/Footer'; 

import UserRoute from "./protectedRoutes/UserRoute";
import UserLoginRoute from './protectedRoutes/UserLoginRoute';
import AdminRoute from './protectedRoutes/AdminRoute';
import OwnerRoute from './protectedRoutes/OwnerRoute';
import ProfilePage from './pages/user/ProfilePage';
import SearchResultPage from './pages/user/SearchResultPage';
import PostsPage from './pages/auth/PostsPage';
import { BusBooking } from './pages/user/BusBooking';
import CheckoutSuccess from './components/user/messages/CheckoutSuccess';
import CheckoutCancelled from './components/user/messages/CheckoutCancelled';
import About from './pages/user/About';
import Contact from './pages/user/Contact';
import OperatorHomePage from './pages/operator/OperatorHomePage';
import OperatorRoute from './protectedRoutes/OperatorRoute';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Toaster position="top-center" reverseOrder={false} />
          {/* <Header /> */}
          <main style={{ minHeight: '80vh' }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
            
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/otp" element={<OtpPage />} />
              <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
              <Route path="/resetpassword" element={<ResetPasswordPage />} />

              <Route path="/login" element={
                <UserLoginRoute>
                  <LoginPage />
                </UserLoginRoute>
              } />

              <Route path="/home" element={
                <UserRoute >
                  <HomePage />
                </ UserRoute >
              } />

              <Route path="/ownerhome" element={
                <OwnerRoute>
                  <OwnHomePage />
                </OwnerRoute>
              } />
              <Route path="/adminlogin" element={<AdminLogPage />} />

              <Route path="/admindash" element={
                <AdminRoute>
                  <AdminDash />
                </AdminRoute>
              } />

              <Route path="/operatordash" element={
                <OperatorRoute>
                 <OperatorHomePage />
                </OperatorRoute> 
                } />
              
              <Route path="/about" element={<About />} />

              <Route path="/contact" element={<Contact />} />

              <Route path="/userprofile" element={<ProfilePage />} />
              
              <Route path="/searchresult" element={<SearchResultPage />} />

              <Route path="/postpage" element={<PostsPage />} />

              <Route path="/seatbook" element={<BusBooking />} />

              <Route path='/checkout-success' element={<CheckoutSuccess />} />

              <Route path='/checkout-cancelled' element={<CheckoutCancelled />} />

              <Route path="*" element={<LoginPage />} />
            </Routes>
          </main>
          {/* <Footer /> */}
        </Router>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
