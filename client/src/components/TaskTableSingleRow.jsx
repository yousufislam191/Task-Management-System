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
import { is } from "date-fns/locale";

const TaskTableSingleRow = (props) => {
  const {
    onClick,
    user,
    onUpdateTaskForDetails,
    getAllTaskForSingleUser,
    onTost,
  } = props;
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
  } = props.task;
  const [loading, setLoading] = useState(true);

  const deleteTask = async (taskId, event) => {
    event.stopPropagation();
    try {
      const res = await axios.delete(`${apiHostName}/task/${taskId}`);
      if (res.data.success) {
        setLoading(true);
        if (user.isAdmin) {
          onUpdateTaskForDetails();
        } else {
          const status = "";
          getAllTaskForSingleUser(user.id, status);
        }
        onTost({ status: res.status, message: res.data.message });
      }
    } catch (err) {
      console.log(err);
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
    if (itemName === "Completed") {
      updateStatus = 2;
    }

    try {
      const res = await axios.put(`${apiHostName}/task/status/${id}`, {
        status: updateStatus,
      });
      if (res.data.success) {
        setLoading(true);
        if (user.isAdmin) {
          onUpdateTaskForDetails();
        } else {
          const status = "";
          getAllTaskForSingleUser(user.id, status);
        }
        onTost({ status: res.status, message: res.data.message });
      }
    } catch (err) {
      console.log(err);
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
        {user.isAdmin && (
          <StyledTableCell align="center">{createdTo.name}</StyledTableCell>
        )}
        <StyledTableCell align="center">
          {dateFormate(deadline)}
        </StyledTableCell>
        <StyledTableCell align="center">
          {hour}:{minute}
        </StyledTableCell>
        <StyledTableCell align="center">
          {status === 0 ? (
            user.isAdmin ? (
              <p style={{ color: "#1976D2" }}>Pending</p>
            ) : loading ? (
              <MenuButton
                name={"Assigned"}
                color={"primary"}
                itemName={["In Progress", "Completed"]}
                handleStatus={(itemName) => {
                  setLoading(false);
                  handleStatusClick(itemName);
                }}
              />
            ) : (
              <CircularProgress size={20} />
            )
          ) : status === 1 ? (
            user.isAdmin ? (
              <p style={{ color: "orange" }}>In Progress</p>
            ) : loading ? (
              <MenuButton
                name={"In Progress"}
                color={"warning"}
                itemName={["Completed"]}
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
        {user.isAdmin && (
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
