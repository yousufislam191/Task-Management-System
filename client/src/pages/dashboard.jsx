import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import showToast from "../components/showToast";
import apiHostName from "../../secret";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

const Dashboard = () => {
  const navigate = useNavigate();
  const [isToken, setIsToken] = useState(false);
  const notify = (status, message) => showToast(status, message);

  const handleClink = async () => {
    const res = await axios.post(`${apiHostName}/auth/logout`).catch((err) => {
      notify(err.response.status, err.response.data.message);
    });
    if (res.data.success === true) {
      notify(res.status, res.data.message);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };

  const checkAccessToken = async (req, res) => {
    try {
      const res = await axios.get(`${apiHostName}/auth/refresh-token`, {
        withCredentials: true,
      });
      if (res.data.success === true) {
        setIsToken(true);
      }
    } catch (err) {
      notify(err.response.status, err.response.data.message);
    }
  };

  useEffect(() => {
    checkAccessToken();
  });
  return isToken ? (
    <>
      <ToastContainer />
      <h1>Dahsboard</h1>
      <Button
        type="submit"
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        onClick={handleClink}
      >
        Log out
      </Button>
    </>
  ) : (
    <h1>Loading...</h1>
  );
};

export default Dashboard;
