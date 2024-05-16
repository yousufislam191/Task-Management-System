import React, { useState } from "react";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { StyledTableCell, StyledTableRow } from "../layout/tableTheme";
import dateFormate from "../helper/dateFormate";
import titleCase from "../helper/titleCase";
import axios from "axios";
import apiHostName from "../../secret";
import { Button, CircularProgress } from "@mui/material";
import truncateText from "../helper/truncateText";
import MenuButton from "./MenuButton";

const TaskTableSingleRow = (props) => {
  const { onClick, isAdmin, onUpdateTaskForDetails, onTost } = props;
  const {
    id,
    title,
    deadline,
    status,
    createdBy,
    createdTo,
    tag,
    hour,
    minute,
    partOfDay,
  } = props.task;
  const [loading, setLoading] = useState(true);

  const deleteTask = async (taskId, event) => {
    event.stopPropagation();
    try {
      const res = await axios.delete(`${apiHostName}/task/${taskId}`);
      if (res.data.success) {
        setLoading(true);
        onTost({ status: res.status, message: res.data.message });
        onUpdateTaskForDetails();
      }
    } catch (err) {
      setLoading(true);
      onTost({
        status: err.response.status,
        message: err.response.data.message,
      });
    }
  };

  const handleStatusClick = async (itemName) => {
    let updateStatus = {};
    if (itemName === "In Progress") {
      updateStatus = 1;
    }
    if (itemName === "Done") {
      updateStatus = 2;
    }

    try {
      const res = await axios.put(`${apiHostName}/task/status/${id}`, {
        status: updateStatus,
      });
      if (res.data.success) {
        setLoading(true);
        onTost({ status: res.status, message: res.data.message });
        onUpdateTaskForDetails();
      }
    } catch (err) {
      setLoading(true);
      onTost({
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
          {truncateText(tag, 20)}
        </StyledTableCell>
        <StyledTableCell align="center">{createdBy?.name}</StyledTableCell>
        {isAdmin && (
          <StyledTableCell align="center">{createdTo.name}</StyledTableCell>
        )}
        <StyledTableCell align="center">
          {dateFormate(deadline)}
        </StyledTableCell>
        <StyledTableCell align="center">
          {hour}:{minute} {partOfDay}
        </StyledTableCell>
        <StyledTableCell align="center">
          {status === 0 ? (
            isAdmin ? (
              <p style={{ color: "#1976D2" }}>Assigned</p>
            ) : loading ? (
              <MenuButton
                name={"Assigned"}
                color={"primary"}
                itemName={["In Progress", "Done"]}
                handleStatus={(itemName) => {
                  setLoading(false);
                  handleStatusClick(itemName);
                }}
              />
            ) : (
              <CircularProgress size={20} />
            )
          ) : status === 1 ? (
            isAdmin ? (
              <p style={{ color: "orange" }}>In Progress</p>
            ) : loading ? (
              <MenuButton
                name={"In Progress"}
                color={"warning"}
                itemName={["Done"]}
                handleStatus={(itemName) => {
                  setLoading(false);
                  handleStatusClick(itemName);
                }}
              />
            ) : (
              <CircularProgress size={20} />
            )
          ) : status === 2 ? (
            <p style={{ color: "green" }}>Completed</p>
          ) : status === 3 ? (
            <p style={{ color: "red", fontWeight: "bold" }}>Failed</p>
          ) : null}
        </StyledTableCell>
        {isAdmin && (
          <StyledTableCell align="center">
            {loading ? (
              <Button
                sx={{
                  color: "#D32F2F",
                  borderRadius: 5,
                }}
                onClick={(e) => {
                  setLoading(false);
                  deleteTask(id, e);
                }}
              >
                <DeleteForeverOutlinedIcon />
              </Button>
            ) : (
              <CircularProgress size={20} />
            )}
          </StyledTableCell>
        )}
      </StyledTableRow>
    </>
  );
};

export default TaskTableSingleRow;
