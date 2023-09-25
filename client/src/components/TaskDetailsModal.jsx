import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import Loading from "./Loading";
import apiHostName from "../../secret";
import showToast from "./showToast";
import { ToastContainer } from "react-toastify";
import FullWidthLoadingButton from "./FullWidthLoadingButton";

const TaskDetailsModal = ({ taskId, onClose, onUpdateTask }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(true);
  const [taskDetails, setTaskDetails] = useState({});
  const [isEditable, setIsEditable] = useState(false);
  const [editedDetails, setEditedDetails] = useState({});

  const notify = (status, message) => showToast(status, message);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleSave = () => {
    setIsEditable(false);
    setTaskDetails({ ...editedDetails });
    setUpdateLoading(false);
    updateTaskDetails();
  };

  const handleEdit = () => {
    setIsEditable(true);
    setEditedDetails({ ...taskDetails });
  };

  const updateTaskDetails = async () => {
    try {
      const res = await axios.put(`${apiHostName}/task/${taskId}`, {
        title: editedDetails.title,
        tag: editedDetails.tag,
        description: editedDetails.description,
        deadline: editedDetails.deadline,
      });
      if (res.data.success) {
        setUpdateLoading(true);
        setOpen(false);
        notify(res.status, res.data.message);
        onUpdateTask();
      }
    } catch (err) {
      setUpdateLoading(true);
      setOpen(false);
      notify(err.response.status, err.response.data.message);
    }
  };

  const fetchTaskDetails = async () => {
    try {
      const res = await axios.get(`${apiHostName}/task/${taskId}`);
      if (res.data.success === true) {
        setLoading(true);
        setTaskDetails(res.data.payload.task);
      }
    } catch (err) {
      setLoading(true);
      setOpen(false);
      notify(err.response.status, err.response.data.message);
    }
  };

  useEffect(() => {
    if (taskId) {
      setOpen(true);
      setLoading(false);
      fetchTaskDetails();
    } else {
      setOpen(false);
    }
  }, [taskId]);

  return (
    <>
      <ToastContainer />
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            width: "70%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#E6E6FA",
              borderRadius: 1,
              py: 1,
              px: 2,
              mb: 4,
            }}
          >
            <Typography variant="h6">Task Details</Typography>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                backgroundColor: "#DCDCDC",
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {loading ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  mb: 3,
                }}
              >
                <TextField
                  fullWidth
                  label="Title"
                  value={
                    isEditable
                      ? editedDetails.title || ""
                      : taskDetails.title || ""
                  }
                  variant="outlined"
                  disabled={!isEditable}
                  onChange={(e) =>
                    setEditedDetails({ ...taskDetails, title: e.target.value })
                  }
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 2,
                    "@media (max-width: 800px)": {
                      flexDirection: "column",
                      alignItems: "start",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 2,
                    }}
                  >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Deadline"
                        disablePast
                        disabled={!isEditable}
                        value={
                          isEditable
                            ? editedDetails.deadline
                              ? dayjs(editedDetails.deadline)
                              : null
                            : taskDetails.deadline
                            ? dayjs(taskDetails.deadline)
                            : null
                        }
                        onChange={(newDate) =>
                          setEditedDetails({
                            ...editedDetails,
                            deadline: newDate.toISOString(),
                          })
                        }
                      />
                    </LocalizationProvider>
                  </Box>
                  <TextField
                    fullWidth
                    label="Tag"
                    value={
                      isEditable
                        ? editedDetails.tag || ""
                        : taskDetails.tag || ""
                    }
                    variant="outlined"
                    disabled={!isEditable}
                    onChange={(e) =>
                      setEditedDetails({ ...taskDetails, tag: e.target.value })
                    }
                  />
                </Box>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  value={
                    isEditable
                      ? editedDetails.description || ""
                      : taskDetails.description || ""
                  }
                  variant="outlined"
                  disabled={!isEditable}
                  onChange={(e) =>
                    setEditedDetails({
                      ...taskDetails,
                      description: e.target.value,
                    })
                  }
                />
              </Box>
              {isEditable &&
                (updateLoading ? (
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSave}
                    sx={{ textTransform: "capitalize", alignItems: "left" }}
                  >
                    Save
                  </Button>
                ) : (
                  <FullWidthLoadingButton />
                ))}
              {!isEditable && (
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleEdit}
                  sx={{ textTransform: "capitalize", alignItems: "left" }}
                >
                  Edit Details
                </Button>
              )}
            </>
          ) : (
            <Loading />
          )}
        </Box>
      </Modal>
    </>
  );
};

export default TaskDetailsModal;
