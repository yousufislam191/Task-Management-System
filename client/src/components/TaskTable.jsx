import React from "react";
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

const TaskTable = ({
  data,
  user,
  handleRowClick,
  handleCreateTask,
  handleTost,
}) => {
  return (
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
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          {/* ...Table headers */}
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
          {/* ...Table Body */}
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
                  onTost={handleTost}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default TaskTable;
