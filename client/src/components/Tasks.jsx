import React, { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import Loading from "./Loading";
import apiHostName from "../../secret";
import axios from "axios";
import ErrorMessage from "./ErrorMessage";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { StyledTableCell } from "../layout/tableTheme";
import TaskTableSingleRow from "./TaskTableSingleRow";
import TaskDetailsModal from "./TaskDetailsModal";
import TaskCreateModal from "./TaskCreateModal";
import showToast from "./showToast";
import { ToastContainer } from "react-toastify";

const Tasks = () => {
  const { user } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState();
  const [status, setStatus] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null); // State to store the selected task ID
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const notify = (status, message) => showToast(status, message);

  const handleRowClick = (taskId) => {
    setSelectedTaskId(taskId);
    setIsModalOpen(true);
  };

  const handleCreateTask = () => {
    setIsCreateModalOpen(true);
  };

  const handleDeleteTaskTost = (data) => {
    notify(data.status, data.message);
  };

  const getAllTasks = async () => {
    try {
      const res = await axios.get(`${apiHostName}/task`);
      if (res.data.success === true) {
        setLoading(true);
        setData(res.data.payload.tasks);
      }
    } catch (err) {
      setLoading(false);
      setStatus(err.response.status);
      setSuccess(err.response.data.success);
      setErrorMessage(err.response.data.message);
    }
  };

  const getAllTaskForSingleUser = async () => {
    try {
      const res = await axios.get(
        `${apiHostName}/task/user-all-task/${user.id}`
      );
      if (res.data.success === true) {
        setLoading(true);
        setData(res.data.payload.task);
      }
    } catch (err) {
      setLoading(false);
      setStatus(err.response.status);
      setSuccess(err.response.data.success);
      setErrorMessage(err.response.data.message);
    }
  };

  useEffect(() => {
    setLoading(false);
    user.isAdmin ? getAllTasks() : getAllTaskForSingleUser();
  }, []);

  return loading ? (
    user.isAdmin ? (
      success === false ? (
        <ErrorMessage status={status} message={errorMessage} />
      ) : (
        <>
          <ToastContainer />
          <div style={{ width: "100%" }}>
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
                mb: 2,
              }}
            >
              <Typography component="h1" variant="h3" align="left">
                Manage Task
              </Typography>
              <Button
                variant="contained"
                style={{ textTransform: "capitalize" }}
                onClick={() => handleCreateTask()}
              >
                Create Task
              </Button>
            </Box>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Title</StyledTableCell>
                  <StyledTableCell align="center">Tag</StyledTableCell>
                  <StyledTableCell align="center">Created By</StyledTableCell>
                  {user.isAdmin && (
                    <StyledTableCell align="center">Created To</StyledTableCell>
                  )}
                  <StyledTableCell align="center">Deadline</StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                  {user.isAdmin && (
                    <StyledTableCell align="center">
                      Delete Task
                    </StyledTableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.length === 0 ? (
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
                  data?.map((task) => (
                    <TaskTableSingleRow
                      key={task.id}
                      task={task}
                      isAdmin={user.isAdmin}
                      onClick={() => handleRowClick(task.id)}
                      onDeleteTaskTost={handleDeleteTaskTost}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {isModalOpen && selectedTaskId && (
            <TaskDetailsModal
              taskId={selectedTaskId}
              onClose={() => setIsModalOpen(false)} // Close the modal
              onUpdateTaskForDetails={getAllTasks}
            />
          )}
          {isCreateModalOpen && (
            <TaskCreateModal
              onClose={() => setIsCreateModalOpen(false)} // Close the modal
              onUpdateTask={getAllTasks}
            />
          )}
        </>
      )
    ) : (
      <>
        <ToastContainer />
        <div style={{ width: "100%" }}>
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
              mb: 2,
            }}
          >
            <Typography component="h1" variant="h3" align="left">
              Manage Your All Task
            </Typography>
          </Box>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Title</StyledTableCell>
                <StyledTableCell align="center">Tag</StyledTableCell>
                <StyledTableCell align="center">Created By</StyledTableCell>
                {user.isAdmin && (
                  <StyledTableCell align="center">Created To</StyledTableCell>
                )}
                <StyledTableCell align="center">Deadline</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                {user.isAdmin && (
                  <StyledTableCell align="center">Delete Task</StyledTableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.length === 0 ? (
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
                data?.map((task) => (
                  <TaskTableSingleRow
                    key={task.id}
                    task={task}
                    isAdmin={user.isAdmin}
                    onClick={() => handleRowClick(task.id)}
                    onDeleteTaskTost={handleDeleteTaskTost}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {isModalOpen && selectedTaskId && (
          <TaskDetailsModal
            taskId={selectedTaskId}
            onClose={() => setIsModalOpen(false)} // Close the modal
            onUpdateTaskForDetails={getAllTasks}
          />
        )}
      </>
    )
  ) : (
    <Loading />
  );
};

export default Tasks;
