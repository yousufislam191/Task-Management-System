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
  Divider,
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
      <Typography
        component="h5"
        variant="h5"
        align="left"
        fontWeight="bold"
        sx={{ mb: 1 }}
      >
        Manage Users
      </Typography>
      <Divider />
      <TableContainer sx={{ mt: 3 }} component={Paper}>
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
                  <Typography
                    component="h4"
                    variant="h4"
                    align="center"
                    sx={{ mt: 4 }}
                  >
                    No Users Available
                  </Typography>
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
      <Typography
        component="h5"
        variant="h5"
        align="left"
        fontWeight="bold"
        sx={{ mb: 1 }}
      >
        Manage Users
      </Typography>
      <Divider />
      {loading ? (
        !notAvailableMessage ? (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {allUsers?.length === 0 ? (
              <Typography
                component="h6"
                variant="h6"
                align="center"
                sx={{ mt: 4 }}
              >
                No Users Available
              </Typography>
            ) : (
              allUsers?.map((singleData) => (
                <UserCardSingleContent
                  key={singleData.id}
                  singleData={singleData}
                  onTost={handleTost}
                  onUpdateUsers={onUpdateUsers}
                />
              ))
            )}
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
