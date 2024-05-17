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
import UsersTable from "../components/UsersTable";
import Tasks from "../components/Tasks";
import Profile from "../components/Profile";
import Chart from "../components/Chart";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { useAllUsersContext } from "../context/AllUsersContext";

axios.defaults.withCredentials = true;

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState();
  const [status, setStatus] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [notAvailableMessage, setNotAvailableMessage] = useState("");
  const [open, setOpen] = useState(true);
  const { user, setUser } = useUserContext();
  const { activeComponent } = useAppContext();
  const { setAllUsers } = useAllUsersContext();

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

  const getAllUsers = async () => {
    try {
      const res = await axios.get(`${apiHostName}/user`);
      if (res.data.success === true) {
        setLoading(true);
        setAllUsers(res.data.payload);
      }
    } catch (err) {
      setLoading(true);
      if (err.response.status === 404) {
        setNotAvailableMessage(err.response.data.message);
      } else {
        setStatus(err.response.status);
        setSuccess(err.response.data.success);
        setErrorMessage(err.response.data.message);
      }
    }
  };

  const checkAccessToken = async () => {
    try {
      const res = await axios.get(`${apiHostName}/auth/refresh-token`, {
        withCredentials: true,
      });
      if (res.data.success === true) {
        setLoading(true);
        setUser(res.data.payload);
      }
    } catch (err) {
      setLoading(true);
      setStatus(err.response.status);
      setSuccess(err.response.data.success);
      setErrorMessage(err.response.data.message);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  };

  useEffect(() => {
    setLoading(false);
    checkAccessToken();
    const intervalId = setInterval(checkAccessToken, 290000); // Call every 4:50 minutes(290,000 milliseconds)
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (user?.isAdmin) {
      setLoading(false);
      getAllUsers();
    }
  }, [user?.isAdmin]);

  return loading ? (
    success === false ? (
      <ErrorMessage status={status} message={errorMessage} />
    ) : (
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
                {activeComponent === "Manage Users" && (
                  <UsersTable
                    notAvailableMessage={notAvailableMessage}
                    onUpdateUsers={getAllUsers}
                    loading={loading}
                  />
                )}
                {activeComponent === "Profile" && (
                  <Profile onUpdateProfile={checkAccessToken} />
                )}
              </Container>
              <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}></Container>
            </Box>
          </Box>
        </ThemeProvider>
      </>
    )
  ) : (
    <Box
      sx={{
        padding: "3rem",
      }}
    >
      <Loading />
    </Box>
  );
};

export default Dashboard;
