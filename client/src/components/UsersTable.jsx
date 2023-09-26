import * as React from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import UserTableSingleRow from "./UserTableSingleRow";
import { StyledTableCell } from "../layout/tableTheme";
import { useAllUsersContext } from "../context/AllUsersContext";

const UsersTable = () => {
  const { allUsers } = useAllUsersContext();
  return (
    <>
      <Typography component="h1" variant="h3" align="left" sx={{ mb: 4 }}>
        Manage Users
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell align="left">Email</StyledTableCell>
              <StyledTableCell align="center">Tasks Assigned</StyledTableCell>
              <StyledTableCell align="center">
                Tasks in Progress
              </StyledTableCell>
              <StyledTableCell align="center">Tasks Done</StyledTableCell>
              <StyledTableCell align="center">Admin</StyledTableCell>
            </TableRow>
          </TableHead>
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
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default UsersTable;
