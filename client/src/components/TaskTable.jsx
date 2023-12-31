import React from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { StyledTableCell } from "../layout/tableTheme";
import TaskTableSingleRow from "./TaskTableSingleRow";
import TaskCardSingleContent from "./TaskCardSingleContent";

const TaskTable = ({
  data,
  user,
  handleRowClick,
  handleCreateTask,
  handleTost,
  onUpdateTaskForDetails,
}) => {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

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
                <StyledTableCell align="center">Deadline</StyledTableCell>
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
