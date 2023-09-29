import React, { useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";

const MenuButton = (props) => {
  const { name, color, itemName, handleStatus } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event, item) => {
    event.stopPropagation();
    setAnchorEl(null);
    if (item !== "backdropClick") {
      handleStatus(item);
    }
  };
  return (
    <>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        color={color}
        style={{ textTransform: "capitalize" }}
      >
        {name}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {itemName.map((item, index) => (
          <MenuItem onClick={(event) => handleClose(event, item)} key={index}>
            {item}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default MenuButton;
