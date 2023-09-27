import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useFormik } from "formik";
import * as Yup from "yup";

import apiHostName from "../../secret";
import showToast from "./showToast";
import { ToastContainer } from "react-toastify";
import FullWidthLoadingButton from "./FullWidthLoadingButton";
import { useAllUsersContext } from "../context/AllUsersContext";
import FullWidthSubmitButton from "./FullWidthSubmitButton";

const TaskCreateModal = ({ onClose, onUpdateTask }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { allUsers } = useAllUsersContext();

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const userSchema = Yup.object({
    title: Yup.string()
      .required("Title is required")
      .min(3, "Title must be at least 3 characters")
      .max(50, "Title will not be more than 50 characters"),
    tag: Yup.string()
      .required("Tag is required")
      .min(3, "Tag must be at least 3 characters")
      .max(30, "Tag will not be more than 30 characters"),
    description: Yup.string().required("Description is required"),
    deadline: Yup.date()
      .required("Deadline is required")
      .min(new Date(), "Deadline must be a future date")
      .test("isValidDate", "Invalid date format", (value) => {
        return !isNaN(value);
      }),
    createdToTask: Yup.string()
      .matches(
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/
      )
      .required("Please select a user to specify this task"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      tag: "",
      description: "",
      deadline: "",
      createdToTask: "",
    },
    onSubmit: async (values, helpers) => {
      setLoading(false);
      console.log(values);
      const res = await axios
        .post(`${apiHostName}/task/create-task`, {
          title: values.title,
          tag: values.tag,
          description: values.description,
          deadline: values.deadline,
          createdToTask: values.createdToTask,
        })
        .catch((err) => {
          notify(err.response.status, err.response.data.message);
        });
      if (res.data.success) {
        setLoading(true);
        notify(res.status, res.data.message);
        onUpdateTask();
        setOpen(false);
      }
    },
    validationSchema: userSchema,
  });
  const notify = (status, message) => showToast(status, message);

  useEffect(() => {
    setOpen(true);
  }, [allUsers]);

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
              // mb: 2,
            }}
          >
            <Typography variant="h6">Make a task for user</Typography>
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

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              mb: 3,
            }}
          >
            <form onSubmit={formik.handleSubmit}>
              <TextField
                margin="normal"
                fullWidth
                id="title"
                label="Title"
                name="title"
                autoComplete="title"
                type="title"
                error={formik.errors.title}
                onChange={formik.handleChange}
                helperText={formik.errors.title}
                autoFocus
              />
              <TextField
                margin="normal"
                fullWidth
                id="tag"
                label="Tag"
                name="tag"
                autoComplete="tag"
                type="tag"
                error={formik.errors.tag}
                onChange={formik.handleChange}
                helperText={formik.errors.tag}
                autoFocus
              />
              <TextField
                margin="normal"
                fullWidth
                id="description"
                label="Description"
                name="description"
                autoComplete="description"
                type="description"
                multiline
                rows={4}
                error={formik.errors.description}
                onChange={formik.handleChange}
                helperText={formik.errors.description}
                autoFocus
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  mt: 2,
                  "@media (max-width: 800px)": {
                    flexDirection: "column",
                    alignItems: "start",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Deadline"
                      disablePast
                      value={
                        formik.values.deadline
                          ? new Date(formik.values.deadline)
                          : null
                      }
                      onChange={(date) =>
                        formik.setFieldValue(
                          "deadline",
                          date ? date.toISOString() : null
                        )
                      }
                      sx={{
                        borderColor:
                          formik.touched.deadline && formik.errors.deadline
                            ? "#D32F2F"
                            : undefined,
                      }}
                    />
                  </LocalizationProvider>
                  {formik.touched.deadline && formik.errors.deadline ? (
                    <FormHelperText sx={{ color: "#D32F2F" }}>
                      {formik.errors.deadline}
                    </FormHelperText>
                  ) : null}
                </Box>

                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-helper-label">
                    Assign To
                  </InputLabel>
                  <Select
                    id="createdToTask"
                    name="createdToTask"
                    value={formik.values.createdToTask}
                    label="Assign To"
                    error={
                      formik.touched.createdToTask &&
                      Boolean(formik.errors.createdToTask)
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {allUsers.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.createdToTask &&
                  formik.errors.createdToTask ? (
                    <FormHelperText sx={{ color: "#D32F2F" }}>
                      {formik.errors.createdToTask}
                    </FormHelperText>
                  ) : null}
                </FormControl>
              </Box>
              {loading ? (
                <FullWidthSubmitButton text={"Create Task"} />
              ) : (
                <FullWidthLoadingButton />
              )}
            </form>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default TaskCreateModal;
