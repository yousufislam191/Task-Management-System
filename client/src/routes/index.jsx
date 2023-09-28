import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import SignIn from "../pages/signin";
import NotFoundPage from "../pages/nofFound";
import SignUp from "../pages/signup";
import ForgotPassword from "../pages/forgotPassword";
import EmailVerification from "../pages/emailVerification";
import Dashboard from "../pages/dashboard";
import { UserProvider } from "../context/UserContext";
import { AppProvider } from "../context/AppContext";
import { AllUsersProvider } from "../context/AllUsersContext";
import ResetPassword from "../pages/resetPassword";

const RouterPath = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<SignIn />} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route exact path="/forgot-password" element={<ForgotPassword />} />
          <Route
            exact
            path="/verify-email/:token"
            element={<EmailVerification />}
          />
          <Route
            exact
            path="/reset-password/:token"
            element={<ResetPassword />}
          />
          <Route
            exact
            path="/dashboard"
            element={
              <AllUsersProvider>
                <UserProvider>
                  <AppProvider>
                    <Dashboard />
                  </AppProvider>
                </UserProvider>
              </AllUsersProvider>
            }
          />
          <Route exact path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default RouterPath;
