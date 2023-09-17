import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import showToast from "../components/showToast";
import apiHostName from "../../secret";

const EmailVerification = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const verifyEmail = async () => {
    try {
      const res = await axios.post(`${apiHostName}/user/verify-account`, {
        token,
      });
      if (res.data.success === true) {
        notify(res.status, res.data.message);
        setTimeout(() => {
          navigate("/");
        }, 5000);
      }
    } catch (err) {
      notify(err.response.status, err.response.data.message);
      console.log(err);
    }
  };

  useEffect(() => {
    verifyEmail();
  }, [token]);
  const notify = (status, message) => showToast(status, message);

  return (
    <>
      <ToastContainer />
      <div>
        <h1>Email Verification: </h1>
      </div>
    </>
  );
};

export default EmailVerification;
