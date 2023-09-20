import React from "react";
import { StyledTableCell, StyledTableRow } from "../layout/tableTheme";

const UserTableSingleRow = (props) => {
  const { singleData } = props;
  return (
    <StyledTableRow key={singleData.id}>
      <StyledTableCell
        component="th"
        scope="row"
        style={{ fontWeight: "bold" }}
      >
        {singleData.name}
      </StyledTableCell>
      <StyledTableCell align="left">{singleData.email}</StyledTableCell>
      {Array.from({ length: 3 }).map((_, index) => {
        const statusItem = singleData.status?.find(
          (status) => status.status === index
        );
        const count = statusItem ? statusItem.count : 0;
        return (
          <StyledTableCell align="center" key={index}>
            {count}
          </StyledTableCell>
        );
      })}
      <StyledTableCell align="right">
        {singleData.isAdmin ? <p style={{ color: "green" }}>Yes</p> : "No"}
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default UserTableSingleRow;
