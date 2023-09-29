import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import titleCase from "../helper/titleCase";
import MenuButton from "./MenuButton";

const UserCardSingleContent = (props) => {
  const { singleData } = props;
  const statusLabels = ["Tasks Assigned", "Tasks in Progress", "Tasks Done"];

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

            {Array.from({ length: 3 }).map((_, index) => {
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
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default UserCardSingleContent;
