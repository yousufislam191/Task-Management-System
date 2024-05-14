import React, { useState } from "react";
import dateFormate from "../helper/dateFormate";
import titleCase from "../helper/titleCase";
import axios from "axios";
import apiHostName from "../../secret";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import truncateText from "../helper/truncateText";
import MenuButton from "./MenuButton";

const TaskCardSingleContent = (props) => {
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
      <Grid item xs={12} sm={6} md={4}>
        <Card onClick={onClick} style={{ cursor: "pointer" }}>
          <CardContent>
            <Typography
              variant="h3"
              style={{ fontWeight: "bold", marginBottom: "0.5rem" }}
            >
              {truncateText(titleCase(title), 20)}
            </Typography>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Tag: {truncateText(tag, 30)}
            </Typography>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Deadline Date: {dateFormate(deadline)}
            </Typography>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Deadline Time: {hour}:{minute} {partOfDay}
            </Typography>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Created By: {createdBy?.name}
            </Typography>
            {isAdmin && (
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Created To: {createdTo.name}
              </Typography>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "start",
                alignContent: "center",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography sx={{ fontSize: 14 }} color="text.secondary">
                Status:
              </Typography>
              {status === 0 ? (
                isAdmin ? (
                  <Typography sx={{ color: "#1976D2", fontSize: 14 }}>
                    Assigned
                  </Typography>
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
                  <Typography sx={{ color: "orange", fontSize: 14 }}>
                    In Progress
                  </Typography>
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
                <Typography sx={{ color: "green", fontSize: 14 }}>
                  Done
                </Typography>
              ) : status === 3 ? (
                <Typography
                  sx={{ color: "red", fontSize: 14, fontWeight: "bold" }}
                >
                  Failed
                </Typography>
              ) : null}
            </Box>

            {isAdmin &&
              (loading ? (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  style={{ textTransform: "capitalize", marginTop: "1rem" }}
                  onClick={(e) => {
                    setLoading(false);
                    deleteTask(id, e);
                  }}
                >
                  Delete Task
                </Button>
              ) : (
                <CircularProgress size={20} />
              ))}
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default TaskCardSingleContent;
