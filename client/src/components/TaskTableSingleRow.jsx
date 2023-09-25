import React, { useState } from "react";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { StyledTableCell, StyledTableRow } from "../layout/tableTheme";
import dateFormate from "../helper/dateFormate";
import titleCase from "../helper/titleCase";
import axios from "axios";
import apiHostName from "../../secret";
import { Button, CircularProgress } from "@mui/material";
import truncateText from "../helper/truncateText";

const TaskTableSingleRow = ({
  task,
  onClick,
  onUpdateTaskForDetails,
  onDeleteTaskTost,
}) => {
  const { id, title, deadline, status, createdBy, createdTo, tag } = task;
  const [loading, setLoading] = useState(true);

  const deleteTask = async (taskId, event) => {
    event.stopPropagation();
    try {
      const res = await axios.delete(`${apiHostName}/task/${taskId}`);
      if (res.data.success) {
        setLoading(true);
        onDeleteTaskTost({ status: res.status, message: res.data.message });
        onUpdateTaskForDetails();
      }
    } catch (err) {
      setLoading(true);
      onDeleteTaskTost({
        status: err.response.status,
        message: err.response.data.message,
      });
    }
  };

  return (
    <>
      <StyledTableRow onClick={onClick} style={{ cursor: "pointer" }}>
        <StyledTableCell
          component="th"
          scope="row"
          style={{ fontWeight: "bold" }}
        >
          {truncateText(titleCase(title), 20)}
        </StyledTableCell>
        <StyledTableCell align="center">
          {dateFormate(deadline)}
        </StyledTableCell>
        <StyledTableCell align="center">
          {status === 0 ? (
            <p style={{ color: "blue" }}>Assigned</p>
          ) : status === 1 ? (
            <p style={{ color: "orange" }}>In Progress</p>
          ) : status === 2 ? (
            <p style={{ color: "green" }}>Done</p>
          ) : null}
        </StyledTableCell>
        <StyledTableCell align="center">{createdBy.name}</StyledTableCell>
        <StyledTableCell align="center">{createdTo.name}</StyledTableCell>
        <StyledTableCell align="center">{tag}</StyledTableCell>
        <StyledTableCell align="center">
          {loading ? (
            <Button
              sx={{
                color: "#D32F2F",
                borderRadius: 5,
              }}
              onClick={(e) => {
                deleteTask(id, e);
                setLoading(true);
              }}
            >
              <DeleteForeverOutlinedIcon />
            </Button>
          ) : (
            <CircularProgress size={20} />
          )}
        </StyledTableCell>
      </StyledTableRow>
    </>
  );
};

export default TaskTableSingleRow;
