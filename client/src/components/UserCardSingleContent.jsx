import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import titleCase from "../helper/titleCase";
import MenuButton from "./MenuButton";
import axios from "axios";
import apiHostName from "../../secret";

const UserCardSingleContent = (props) => {
  const { singleData, onTost, onUpdateUsers } = props;
  const [loading, setLoading] = useState(true);
  const statusLabels = [
    "Pending Tasks",
    "In Progress Tasks",
    "Completed Tasks",
    "Failed Task",
  ];

  const deleteUser = async (id) => {
    try {
      const res = await axios.delete(`${apiHostName}/user/${id}`);
      if (res.data.success) {
        setLoading(true);
        onTost({ status: res.status, message: res.data.message });
        onUpdateUsers();
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
        <Card>
          <CardContent>
            <Typography
              variant="h3"
              style={{ fontWeight: "bold", marginBottom: "0.5rem" }}
            >
              {titleCase(singleData.name)}
            </Typography>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Email: {singleData.email}
            </Typography>

            {Array.from({ length: 4 }).map((_, index) => {
              const statusItem = singleData.status?.find(
                (status) => status.status === index
              );
              const count = statusItem ? statusItem.count : 0;
              return (
                <Typography
                  key={index}
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  {statusLabels[index]}: {count}
                </Typography>
              );
            })}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                alignContent: "center",
              }}
            >
              {singleData.isAdmin ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center",
                    alignContent: "center",
                  }}
                >
                  <Typography>Admin: </Typography>
                  <MenuButton
                    name={"Yes"}
                    color={"success"}
                    itemName={["Remove Admin"]}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center",
                    alignContent: "center",
                  }}
                >
                  <Typography>Admin: </Typography>
                  <MenuButton
                    name={"No"}
                    color={"inherit"}
                    itemName={["Make Admin"]}
                  />
                </Box>
              )}
              {loading ? (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  style={{ textTransform: "capitalize" }}
                  onClick={() => {
                    setLoading(false);
                    deleteUser(singleData.id);
                  }}
                >
                  Delete User
                </Button>
              ) : (
                <CircularProgress size={20} />
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default UserCardSingleContent;
