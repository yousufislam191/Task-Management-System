import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Divider,
  Fade,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useUserContext } from "../context/UserContext";
import FullWidthSubmitButton from "./FullWidthSubmitButton";
import FullWidthLoadingButton from "./FullWidthLoadingButton";
import { ToastContainer } from "react-toastify";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import showToast from "./showToast";
import apiHostName from "../../secret";
import { useNavigate } from "react-router-dom";

const Profile = ({ onUpdateProfile }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isEditable, setIsEditable] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editedDetails, setEditedDetails] = useState();
  const [openPasswordField, setOpenPasswordField] = useState(false);
  const { user } = useUserContext();
  const userId = user.id;

  const notify = (status, message) => showToast(status, message);

  const userSchema = Yup.object({
    oldPassword: Yup.string()
      .required("Old password is required")
      .min(8, "Old password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    newPassword: Yup.string()
      .required("Old password is required")
      .min(8, "Old password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    confirmPassword: Yup.string()
      .required("Old password is required")
      .oneOf(
        [Yup.ref("newPassword"), null],
        "Confirm password does not match with New password"
      ),
  });

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async (values, helpers) => {
      setLoading(false);
      try {
        const res = await axios.put(
          `${apiHostName}/user/update-password/${userId}`,
          {
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword,
          }
        );
        if (res.data.success === true) {
          setLoading(true);
          notify(res.status, res.data.message);
          setOpenPasswordField(false);
        }
      } catch (err) {
        setLoading(true);
        notify(err.response.status, err.response.data.message);
      }
    },
    validationSchema: userSchema,
  });

  const deleteAccount = async () => {
    setLoading(false);
    try {
      const userId = user.id;
      const res = await axios.delete(`${apiHostName}/user/${userId}`);
      if (res.data.success) {
        // for session and cookie clear
        await axios.post(`${apiHostName}/auth/logout`).catch((err) => {
          notify(err.response.status, err.response.data.message);
        });

        setLoading(true);
        notify(res.status, res.data.message);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (err) {
      setLoading(true);
      notify(err.response.status, err.response.data.message);
    }
  };

  const handleEdit = () => {
    setIsEditable(true);
    setEditedDetails({ ...user });
  };

  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  const handleSave = async () => {
    setLoading(false);

    try {
      const res = await axios.put(`${apiHostName}/user/${userId}`, {
        name: editedDetails.name,
      });
      if (res.data.success) {
        setLoading(true);
        setIsEditable(false);
        notify(res.status, res.data.message);
        onUpdateProfile();
      }
    } catch (err) {
      setLoading(true);
      notify(err.response.status, err.response.data.message);
    }
  };

  const handleOpenPasswordField = () => {
    setOpenPasswordField(!openPasswordField);
  };

  return (
    <>
      <ToastContainer />
      <div style={{ width: "100%" }}>
        <Typography
          component="h5"
          variant="h5"
          align="left"
          fontWeight="bold"
          sx={{ mb: 1 }}
        >
          Edit Profile
        </Typography>
        <Divider />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            mt: 3,
            "@media (min-width: 600px)": {
              flexDirection: "row",
            },
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 3,
              "@media (min-width: 600px)": {
                width: "50%",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TextField
                fullWidth
                label="Name"
                value={isEditable ? editedDetails.name || "" : user.name || ""}
                variant="outlined"
                size="small"
                disabled={!isEditable}
                onChange={(e) =>
                  setEditedDetails({ ...user, name: e.target.value })
                }
              />
              {!isEditable && (
                <Button
                  variant="text"
                  disableElevation
                  onClick={handleEdit}
                  sx={{
                    textTransform: "capitalize",
                    alignItems: "left",
                    backgroundColor: "transparent",
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  Edit
                </Button>
              )}
              {isEditable &&
                (loading ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="text"
                      disableElevation
                      onClick={handleSave}
                      sx={{
                        textTransform: "capitalize",
                        alignItems: "left",
                        backgroundColor: "transparent",
                        "&:hover": {
                          backgroundColor: "transparent",
                        },
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="text"
                      disableElevation
                      onClick={() => setIsEditable(false)}
                      sx={{
                        textTransform: "capitalize",
                        alignItems: "left",
                        backgroundColor: "transparent",
                        "&:hover": {
                          backgroundColor: "transparent",
                        },
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                ) : (
                  <CircularProgress size={20} />
                ))}
            </Box>

            <TextField
              fullWidth
              label="Email"
              value={user.email}
              variant="outlined"
              size="small"
              disabled
            />

            {openPasswordField && (
              <form onSubmit={formik.handleSubmit}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Old Password"
                    name="oldPassword"
                    id="oldPassword"
                    type="text"
                    autoComplete="password"
                    variant="outlined"
                    error={formik.errors.oldPassword}
                    onChange={formik.handleChange}
                    helperText={formik.errors.oldPassword}
                    autoFocus
                  />
                  <TextField
                    fullWidth
                    label="New Password"
                    name="newPassword"
                    id="newPassword"
                    type="text"
                    autoComplete="password"
                    variant="outlined"
                    error={formik.errors.newPassword}
                    onChange={formik.handleChange}
                    helperText={formik.errors.newPassword}
                    autoFocus
                  />
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    id="confirmPassword"
                    type="text"
                    autoComplete="password"
                    variant="outlined"
                    error={formik.errors.confirmPassword}
                    onChange={formik.handleChange}
                    helperText={formik.errors.confirmPassword}
                    autoFocus
                  />
                  {loading ? (
                    <FullWidthSubmitButton text={"Save Change Password"} />
                  ) : (
                    <FullWidthLoadingButton />
                  )}
                </Box>
              </form>
            )}
          </Box>

          <Box
            sx={{
              width: "100%",
              "@media (min-width: 600px)": {
                width: "50%",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "start",
                gap: "2rem",
                mb: 3,
                "@media (min-width: 600px)": {
                  flexDirection: "column",
                  gap: "1rem",
                  alignItems: "end",
                },
                "@media (min-width: 1024px)": {
                  flexDirection: "row",
                  gap: "2rem",
                  justifyContent: "end",
                },
              }}
            >
              <Button
                variant="contained"
                onClick={handleOpenPasswordField}
                sx={{
                  textTransform: "capitalize",
                }}
              >
                {openPasswordField ? "Close Password" : "Change Password"}
              </Button>
              {!user.isAdmin && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleModalOpen}
                  sx={{
                    textTransform: "capitalize",
                  }}
                >
                  Delete Account
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </div>

      {openModal && (
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          closeAfterTransition
          open={openModal}
          onClose={handleModalClose}
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={openModal}>
            <Box
              sx={{
                position: "absolute",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                borderRadius: 2,
                "@media (max-width: 600px)": {
                  width: "90%",
                },
              }}
            >
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
                color="error"
              >
                Are you sure to delete your account?
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                  justifyContent: "end",
                  alignContent: "center",
                  mt: 3,
                }}
              >
                <Button variant="contained" onClick={handleModalClose}>
                  No
                </Button>
                {loading ? (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={deleteAccount}
                  >
                    Yes
                  </Button>
                ) : (
                  <CircularProgress size={20} />
                )}
              </Box>
            </Box>
          </Fade>
        </Modal>
      )}
    </>
  );
};

export default Profile;
