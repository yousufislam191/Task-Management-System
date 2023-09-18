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

axios.defaults.withCredentials = true;

const Dashboard = () => {
  const navigate = useNavigate();
  const [isToken, setIsToken] = useState(false);
  const [user, setUser] = useState();
  const [open, setOpen] = useState(true);
  const [activeComponent, setActiveComponent] = useState("Dashboard");

  const notify = (status, message) => showToast(status, message);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleItemClick = (componentName) => {
    setActiveComponent(componentName);
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
    try {
      const res = await axios.get(`${apiHostName}/auth/refresh-token`, {
        withCredentials: true,
      });
      if (res.data.success === true) {
        setIsToken(true);
        setUser(res.data.payload);
      }
    } catch (err) {
      notify(err.response.status, err.response.data.message);
    }
  };

  useEffect(() => {
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
          <SideNavBar
            user={user}
            open={open}
            onToggleDrawer={toggleDrawer}
            onItemClick={handleItemClick}
          />
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
              {activeComponent === "Dashboard" && (
                <h1>Hello, this is the Dashboard component!</h1>
              )}
              {activeComponent === "Tasks" && (
                <h1>This is the Tasks component!</h1>
              )}
              {activeComponent === "Manage Users" && (
                <h1>This is the Manage Users component!</h1>
              )}
              {activeComponent === "Profile" && (
                <h1>This is the Profile component!</h1>
              )}
            </Container>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}></Container>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  ) : (
    <h1>Loading...</h1>
  );
};

export default Dashboard;
