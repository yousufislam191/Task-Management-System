import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import SignIn from "../pages/signin";
import NotFoundPage from "../pages/nofFound";

const RouterPath = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<SignIn />} />
          <Route exact path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default RouterPath;
