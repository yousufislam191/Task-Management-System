import * as React from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  useMediaQuery,
  Grid,
  Box,
} from "@mui/material";
import UserTableSingleRow from "./UserTableSingleRow";
import { StyledTableCell } from "../layout/tableTheme";
import { useAllUsersContext } from "../context/AllUsersContext";
import UserCardSingleContent from "./UserCardSingleContent";
import showToast from "./showToast";
import { ToastContainer } from "react-toastify";
import Loading from "./Loading";

const UsersTable = ({ notAvailableMessage, onUpdateUsers, loading }) => {
  const { allUsers } = useAllUsersContext();
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  const notify = (status, message) => showToast(status, message);

  const handleTost = (data) => {
    notify(data.status, data.message);
  };

  return isLargeScreen ? (
    <>
      <ToastContainer />
      <Typography component="h1" variant="h3" align="left" sx={{ mb: 4 }}>
        Manage Users
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell align="left">Email</StyledTableCell>
              <StyledTableCell align="center">Pending Tasks</StyledTableCell>
              <StyledTableCell align="center">
                In Progress Tasks
              </StyledTableCell>
              <StyledTableCell align="center">Completed Tasks</StyledTableCell>
              <StyledTableCell align="center">Failed Tasks</StyledTableCell>
              <StyledTableCell align="center">Admin</StyledTableCell>
              <StyledTableCell align="center">Delete User</StyledTableCell>
            </TableRow>
          </TableHead>
          {loading ? (
            !notAvailableMessage ? (
              <TableBody>
                {allUsers?.length === 0 ? (
                  <h1
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "4rem",
                    }}
                  >
                    No Users Available
                  </h1>
                ) : (
                  allUsers?.map((singleData) => (
                    <UserTableSingleRow
                      key={singleData.id}
                      singleData={singleData}
                      onTost={handleTost}
                      onUpdateUsers={onUpdateUsers}
                    />
                  ))
                )}
              </TableBody>
            ) : (
              <Typography
                component="h1"
                variant="h3"
                align="left"
                sx={{ mt: 2 }}
              >
                {notAvailableMessage}
              </Typography>
            )
          ) : (
            <Loading />
          )}
        </Table>
      </TableContainer>
    </>
  ) : (
    <>
      <ToastContainer />
      <Box
        sx={{
          backgroundColor: "lightgray",
          borderRadius: 1,
          py: 2,
          px: 3,
          mb: 2,
        }}
      >
        <Typography component="h1" variant="h3" align="left">
          Manage Users
        </Typography>
      </Box>
      {loading ? (
        !notAvailableMessage ? (
          <Grid container spacing={2}>
            {allUsers?.map((singleData) => (
              <UserCardSingleContent
                key={singleData.id}
                singleData={singleData}
                onTost={handleTost}
                onUpdateUsers={onUpdateUsers}
              />
            ))}
          </Grid>
        ) : (
          <Typography component="h1" variant="h3" align="left" sx={{ mt: 2 }}>
            {notAvailableMessage}
          </Typography>
        )
      ) : (
        <Loading />
      )}
    </>
  );
};

export default UsersTable;
