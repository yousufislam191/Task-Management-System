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
import DatePicker from "react-datepicker";
import { parseISO, format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

import Loading from "./Loading";
import apiHostName from "../../secret";

const TaskDetailsModal = ({ taskId, onClose }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [taskDetails, setTaskDetails] = useState({});
  const [isEditable, setIsEditable] = useState(false);
  const [editedDetails, setEditedDetails] = useState({});

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleEdit = () => {
    setIsEditable(true);
    setEditedDetails({ ...taskDetails });
  };

  const handleSave = () => {
    setIsEditable(false);
    setTaskDetails({ ...editedDetails });
    // console.log("Edited Details:", editedDetails);
  };

  const fetchTaskDetails = async () => {
    try {
      const res = await axios.get(`${apiHostName}/task/${taskId}`);
      if (res.data.success === true) {
        setLoading(true);
        setTaskDetails(res.data.payload.task);
        // console.log(res);
      }
    } catch (err) {
      setLoading(true);
      //   console.log(err);
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
                  <Typography>Date: </Typography>
                  <DatePicker
                    selected={
                      isEditable
                        ? editedDetails.deadline
                          ? parseISO(editedDetails.deadline)
                          : null
                        : taskDetails.deadline
                        ? parseISO(taskDetails.deadline)
                        : null
                    }
                    onChange={(newDate) =>
                      setEditedDetails({
                        ...editedDetails,
                        deadline: format(
                          newDate,
                          "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
                        ),
                      })
                    }
                    dateFormat="yyyy-MM-dd"
                    showTimeInput
                    timeInputLabel="Time"
                    disabled={!isEditable}
                  />
                </Box>
                <TextField
                  fullWidth
                  label="Tag"
                  value={
                    isEditable ? editedDetails.tag || "" : taskDetails.tag || ""
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
            {isEditable && (
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{ textTransform: "capitalize", alignItems: "left" }}
              >
                Save
              </Button>
            )}
            {!isEditable && (
              <Button
                variant="contained"
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
  );
};

export default TaskDetailsModal;
