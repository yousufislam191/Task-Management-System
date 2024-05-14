import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { StyledTableCell } from "../layout/tableTheme";
import TaskTableSingleRow from "./TaskTableSingleRow";
import TaskCardSingleContent from "./TaskCardSingleContent";

const TaskTable = ({
  data,
  user,
  handleRowClick,
  handleCreateTask,
  handleSearch,
  handleTost,
  onUpdateTaskForDetails,
  searchTasks,
}) => {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  const userSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .min(3, "Title must be at least 3 characters")
      .max(50, "Title will not be more than 50 characters"),
    status: Yup.string().required("Status is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      status: "",
    },
    onSubmit: async (values, helpers) => {
      await searchTasks(values);
    },
    validationSchema: userSchema,
  });

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "lightgray",
          borderRadius: 1,
          py: 2,
          px: 3,
        }}
      >
        <Typography component="h1" variant="h3" align="left">
          {user.isAdmin ? "Manage Task" : "Manage Your All Task"}
        </Typography>
        {user.isAdmin && (
          <Button
            variant="contained"
            style={{ textTransform: "capitalize" }}
            onClick={handleCreateTask}
          >
            Create Task
          </Button>
        )}
      </Box>
      {user.isAdmin && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: 1,
            mb: 2,
          }}
        >
          <form onSubmit={formik.handleSubmit}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  minWidth: 500,
                }}
              >
                <TextField
                  margin="normal"
                  fullWidth
                  id="name"
                  label="User Name"
                  name="name"
                  autoComplete="name"
                  type="name"
                  error={formik.errors.name}
                  onChange={formik.handleChange}
                  helperText={formik.errors.name}
                  autoFocus
                />
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-helper-label">
                    Select Status
                  </InputLabel>
                  <Select
                    id="status"
                    name="status"
                    value={formik.values.status}
                    label="Status"
                    error={
                      formik.touched.status && Boolean(formik.errors.status)
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value={0}>Pending</MenuItem>
                    <MenuItem value={1}>In Progress</MenuItem>
                    <MenuItem value={2}>Done</MenuItem>
                    <MenuItem value={3}>Failed</MenuItem>
                    {/* <MenuItem value={[0, 1, 2, 3]}>All</MenuItem> */}
                  </Select>
                  {formik.touched.status && formik.errors.status ? (
                    <FormHelperText sx={{ color: "#D32F2F" }}>
                      {formik.errors.status}
                    </FormHelperText>
                  ) : null}
                </FormControl>
              </Box>
              <Button
                type="submit"
                variant="contained"
                style={{ textTransform: "capitalize" }}
                onClick={handleSearch}
              >
                Search
              </Button>
            </Box>
          </form>
        </Box>
      )}
      {isLargeScreen ? (
        <TableContainer component={Paper}>
          <Table
            sx={{
              minWidth: 700,
            }}
            aria-label="customized table"
          >
            {/* ...Table headers */}
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Title</StyledTableCell>
                <StyledTableCell align="center">Tag</StyledTableCell>
                <StyledTableCell align="center">Created By</StyledTableCell>
                {user.isAdmin && (
                  <StyledTableCell align="center">Created To</StyledTableCell>
                )}
                <StyledTableCell align="center">Deadline Date</StyledTableCell>
                <StyledTableCell align="center">Deadline Time</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                {user.isAdmin && (
                  <StyledTableCell align="center">Delete Task</StyledTableCell>
                )}
              </TableRow>
            </TableHead>
            {/* ...Table Body */}
            {data?.length === 0 ? (
              <Typography
                component="h1"
                variant="h3"
                align="left"
                sx={{ mt: 2 }}
              >
                No Task Available
              </Typography>
            ) : (
              <TableBody>
                {data?.map((task) => (
                  <TaskTableSingleRow
                    key={task.id}
                    task={task}
                    isAdmin={user.isAdmin}
                    onClick={() => handleRowClick(task.id)}
                    onTost={handleTost}
                    onUpdateTaskForDetails={onUpdateTaskForDetails}
                  />
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      ) : data?.length === 0 ? (
        <h1
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "4rem",
          }}
        >
          No Task Available
        </h1>
      ) : (
        <Grid container spacing={2}>
          {data?.map((task) => (
            <TaskCardSingleContent
              key={task.id}
              task={task}
              isAdmin={user.isAdmin}
              onClick={() => handleRowClick(task.id)}
              onTost={handleTost}
              onUpdateTaskForDetails={onUpdateTaskForDetails}
            />
          ))}
        </Grid>
      )}
    </>
  );
};

export default TaskTable;
