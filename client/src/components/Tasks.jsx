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

const Tasks = () => {
  const { user } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState();
  const [status, setStatus] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState([]);

  const [selectedTaskId, setSelectedTaskId] = useState(null); // State to store the selected task ID
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getAllTasks = async () => {
    try {
      const res = await axios.get(`${apiHostName}/task`);
      if (res.data.success === true) {
        setLoading(true);
        setData(res.data.payload.tasks);
        // console.log(res);
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
    getAllTasks();
  }, []);

  const handleRowClick = (taskId) => {
    setSelectedTaskId(taskId);
    setIsModalOpen(true);
  };

  return loading ? (
    user.isAdmin ? (
      success === false ? (
        <ErrorMessage status={status} message={errorMessage} />
      ) : (
        <>
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
              >
                Create Task
              </Button>
            </Box>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Title</StyledTableCell>
                  <StyledTableCell align="center">Deadline</StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                  <StyledTableCell align="center">Created By</StyledTableCell>
                  <StyledTableCell align="center">Tag</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.map((task) => (
                  <TaskTableSingleRow
                    key={task.id}
                    task={task}
                    onClick={() => handleRowClick(task.id)}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
          {isModalOpen && selectedTaskId && (
            <TaskDetailsModal
              taskId={selectedTaskId}
              onClose={() => setIsModalOpen(false)} // Close the modal
            />
          )}
        </>
      )
    ) : (
      <>
        <h1>User Task</h1>
      </>
    )
  ) : (
    <Loading />
  );
};

export default Tasks;
