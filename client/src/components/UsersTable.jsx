import * as React from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import UserTableSingleRow from "./UserTableSingleRow";
import { StyledTableCell } from "../layout/tableTheme";

const UsersTable = ({ data }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell align="left">Email</StyledTableCell>
            <StyledTableCell align="center">Tasks Assigned</StyledTableCell>
            <StyledTableCell align="center">Tasks in Progress</StyledTableCell>
            <StyledTableCell align="center">Tasks Done</StyledTableCell>
            <StyledTableCell align="center">Admin</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((singleData) => (
            <UserTableSingleRow key={singleData.id} singleData={singleData} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UsersTable;
