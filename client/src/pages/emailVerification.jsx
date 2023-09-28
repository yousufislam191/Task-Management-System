import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@mui/material/styles";
import { Paper, Box, Grid, Typography } from "@mui/material";

import theme from "../layout/theme";
import showToast from "../components/showToast";
import apiHostName from "../../secret";

const EmailVerification = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const verifyEmail = async () => {
    try {
      const res = await axios.post(`${apiHostName}/user/verify-account`, {
        token,
      });
      if (res.data.success === true) {
        setLoading(true);
        setMessage(res.data.message);
        setTimeout(() => {
          navigate("/");
        }, 4000);
      }
    } catch (err) {
      setMessage(err.response.data.message);
      notify(err.response.status, err.response.data.message);
    }
  };

  useEffect(() => {
    setLoading(false);
    verifyEmail();
  }, [token]);
  const notify = (status, message) => showToast(status, message);

  return (
    <>
      <ToastContainer />
      <ThemeProvider theme={theme}>
        <Grid container component="main" sx={{ height: "100vh" }}>
          <Box
            sx={{
              my: 12,
              mx: 4,
              px: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              height: 100,
            }}
          >
            <Grid
              item
              xs={12}
              sm={8}
              md={6}
              component={Paper}
              elevation={6}
              square
              borderRadius={5}
            >
              <Box sx={{ mx: 4, my: 4 }}>
                {loading ? (
                  <Typography
                    component="h3"
                    variant="h3"
                    align="center"
                    color={"green"}
                  >
                    {message}
                  </Typography>
                ) : (
                  <>
                    <Typography
                      component="h3"
                      variant="h3"
                      Typographyalign="center"
                    >
                      Verifying Your Account
                    </Typography>
                    <Typography component="h3" variant="h3" align="center">
                      Please wait...
                    </Typography>
                  </>
                )}
              </Box>
            </Grid>
          </Box>
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default EmailVerification;
