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
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import Loading from "./Loading";
import apiHostName from "../../secret";
import showToast from "./showToast";
import { ToastContainer } from "react-toastify";
import FullWidthLoadingButton from "./FullWidthLoadingButton";
import dateFormate from "../helper/dateFormate";

const TaskDetailsModal = ({
  user,
  taskId,
  onClose,
  onUpdateTaskForDetails,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(true);
  const [taskDetails, setTaskDetails] = useState({});
  const [isEditable, setIsEditable] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedTag, setEditedTag] = useState("");
  const [editedDeadline, setEditedDeadline] = useState(null);
  const [editedDescription, setEditedDescription] = useState("");
  const [editedTime, setEditedTime] = useState(null);
  const [editedHour, setEditedHour] = useState(null);
  const [editedMinute, setEditedMinute] = useState(null);

  const notify = (status, message) => showToast(status, message);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleSave = () => {
    setIsEditable(false);
    resetEditedValues();
    setUpdateLoading(false);
    updateTaskDetails();
  };

  const handleEdit = () => {
    setIsEditable(true);
    resetEditedValues();
  };

  const resetEditedValues = () => {
    setEditedTitle(taskDetails.title || "");
    setEditedTag(taskDetails.tag || "");
    setEditedDeadline(
      taskDetails.deadline ? dayjs(taskDetails.deadline) : null
    );
    setEditedDescription(taskDetails.description || "");
    setEditedTime(taskDetails.time ? dayjs(taskDetails.time) : null);
  };

  const updateTaskDetails = async () => {
    try {
      const res = await axios.put(`${apiHostName}/task/${taskId}`, {
        title: editedTitle,
        tag: editedTag,
        description: editedDescription,
        deadline: editedDeadline
          ? editedDeadline.format("YYYY-MM-DD")
          : taskDetails.deadline,
        hour: editedTime ? editedHour : taskDetails.hour,
        minute: editedTime ? editedMinute : taskDetails.minute,
      });
      if (res.data.success) {
        setUpdateLoading(true);
        setOpen(false);
        notify(res.status, res.data.message);
        onUpdateTaskForDetails();
      }
    } catch (err) {
      setUpdateLoading(true);
      setOpen(false);
      notify(err.response.status, err.response.data.message);
    }
  };
  const isToday = (date) => {
    const today = dayjs().startOf("day");
    return date && dayjs(date).isSame(today, "day");
  };

  const fetchTaskDetails = async () => {
    try {
      const res = await axios.get(`${apiHostName}/task/single-task/${taskId}`);
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
            maxHeight: "90vh",
            overflowY: "scroll",
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
                  label="Task Name"
                  variant="outlined"
                  size="small"
                  disabled={!isEditable}
                  value={isEditable ? editedTitle : taskDetails.title || ""}
                  onChange={(e) => setEditedTitle(e.target.value)}
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
                        label="Deadline Date"
                        slotProps={{ textField: { size: "small" } }}
                        disablePast
                        disabled={!isEditable}
                        onChange={(newDate) => setEditedDeadline(newDate)}
                        value={
                          isEditable
                            ? dayjs(editedDeadline)
                            : dayjs(taskDetails.deadline) || null
                        }
                      />
                    </LocalizationProvider>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 2,
                    }}
                  >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        label="Deadline Time"
                        ampm={false}
                        slotProps={{ textField: { size: "small" } }}
                        disabled={!isEditable}
                        minTime={
                          isToday(editedDeadline)
                            ? dayjs().startOf("minute")
                            : undefined
                        }
                        value={
                          editedTime
                            ? dayjs(editedTime)
                            : dayjs()
                                .set("hour", taskDetails.hour || 0)
                                .set("minute", taskDetails.minute || 0)
                        }
                        onChange={(newTime) => {
                          if (newTime) {
                            const selectedTime = new Date(newTime);
                            setEditedTime(selectedTime);
                            setEditedHour(selectedTime.getHours());
                            setEditedMinute(selectedTime.getMinutes());
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </Box>
                  <TextField
                    fullWidth
                    label="Category"
                    variant="outlined"
                    size="small"
                    disabled={!isEditable}
                    value={isEditable ? editedTag : taskDetails.tag || ""}
                    onChange={(e) => setEditedTag(e.target.value)}
                  />
                </Box>

                {!user.isAdmin && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 2,
                    }}
                  >
                    <TextField
                      label="Assigned Date"
                      value={dateFormate(taskDetails.createdAt)}
                      variant="outlined"
                      size="small"
                      disabled
                    />
                    <TextField
                      label="Status"
                      size="small"
                      value={
                        taskDetails.status === 0
                          ? "Assigned"
                          : taskDetails.status === 1
                          ? "In Progress"
                          : taskDetails.status === 2
                          ? "Completed"
                          : taskDetails.status === 3
                          ? "Failed"
                          : null
                      }
                      variant="outlined"
                      disabled
                    />
                  </Box>
                )}

                <TextField
                  fullWidth
                  label="Description"
                  variant="outlined"
                  size="small"
                  disabled={!isEditable}
                  multiline
                  value={
                    isEditable
                      ? editedDescription
                      : taskDetails.description || ""
                  }
                  onChange={(e) => setEditedDescription(e.target.value)}
                />
              </Box>
              {user.isAdmin &&
                isEditable &&
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
              {user.isAdmin &&
                !isEditable &&
                taskDetails.status !== 2 &&
                taskDetails.status !== 3 && (
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
