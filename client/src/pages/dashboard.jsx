import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  Toolbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import axios from "axios";

import showToast from "../components/showToast";
import apiHostName from "../../secret";
import theme from "../layout/theme";
import DashboardAppBar from "../components/DashboardAppBar";
import SideNavBar from "../components/SideNavBar";
import { useUserContext } from "../context/UserContext";
import { useAppContext } from "../context/AppContext";
import ManageUser from "../components/ManageUser";
import Tasks from "../components/Tasks";
import Profile from "../components/Profile";
import Chart from "../components/Chart";
import Loading from "../components/Loading";

axios.defaults.withCredentials = true;

const Dashboard = () => {
  const navigate = useNavigate();
  const [isToken, setIsToken] = useState(false);
  const [open, setOpen] = useState(true);
  const { setUser } = useUserContext();
  const { activeComponent } = useAppContext();

  const notify = (status, message) => showToast(status, message);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleLogoutButtonClick = async () => {
    const res = await axios.post(`${apiHostName}/auth/logout`).catch((err) => {
      notify(err.response.status, err.response.data.message);
    });
    if (res.data.success === true) {
      notify(res.status, res.data.message);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  };

  const checkAccessToken = async () => {
    console.log("tokener function er vitre dhukse");
    try {
      console.log("try er vitre dhukse");
      const res = await axios.post(`${apiHostName}/auth/refresh-token`, {
        withCredentials: true,
      });
      if (res.data.success === true) {
        console.log("response dat if condition er vitre dhukse");
        setIsToken(true);
        setUser(res.data.payload);
      }
    } catch (err) {
      console.log(
        "tokener function er vitre dhuke nai nai, direct cathc er error"
      );
      setIsToken(true);
      notify(err.response.status, err.response.data.message);
    }
  };

  useEffect(() => {
    setIsToken(false);
    checkAccessToken();
  }, []);

  return isToken ? (
    <>
      <ToastContainer />

      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <DashboardAppBar
            open={open}
            onToggleDrawer={toggleDrawer}
            onLogoutButtonClick={handleLogoutButtonClick}
          />
          <SideNavBar open={open} onToggleDrawer={toggleDrawer} />
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              {activeComponent === "Dashboard" && <Chart />}
              {activeComponent === "Tasks" && <Tasks />}
              {activeComponent === "Manage Users" && <ManageUser />}
              {activeComponent === "Profile" && <Profile />}
            </Container>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}></Container>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  ) : (
    <Loading />
  );
};

export default Dashboard;
