import React from "react";
import { StyledTableCell, StyledTableRow } from "../layout/tableTheme";
import dateFormate from "../helper/dateFormate";
import titleCase from "../helper/titleCase";

const TaskTableSingleRow = ({ task, onClick }) => {
  const { title, deadline, status, createdBy, tag } = task;

  return (
    <>
      <StyledTableRow onClick={onClick} style={{ cursor: "pointer" }}>
        <StyledTableCell
          component="th"
          scope="row"
          style={{ fontWeight: "bold" }}
        >
          {titleCase(title)}
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
        <StyledTableCell align="left">{tag}</StyledTableCell>
      </StyledTableRow>
    </>
  );
};

export default TaskTableSingleRow;
