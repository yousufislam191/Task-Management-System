import React from "react";
import { StyledTableCell, StyledTableRow } from "../layout/tableTheme";
import titleCase from "../helper/titleCase";
import { Button, Menu, MenuItem } from "@mui/material";
import MenuButton from "./MenuButton";

const UserTableSingleRow = (props) => {
  const { singleData } = props;

  //   const [anchorEl, setAnchorEl] = React.useState(null);
  //   const open = Boolean(anchorEl);
  //   const handleClick = (event) => {
  //     setAnchorEl(event.currentTarget);
  //   };
  //   const handleClose = () => {
  //     setAnchorEl(null);
  //   };

  return (
    <StyledTableRow key={singleData.id}>
      <StyledTableCell
        component="th"
        scope="row"
        style={{ fontWeight: "bold" }}
      >
        {titleCase(singleData.name)}
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
      <StyledTableCell align="center">
        {singleData.isAdmin ? (
          <>
            <MenuButton
              name={"Yes"}
              color={"success"}
              itemName={"Remove Admin"}
            />
          </>
        ) : (
          <MenuButton name={"No"} color={"inherit"} itemName={"Make Admin"} />
        )}
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default UserTableSingleRow;
