import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { StyledTableCell, StyledTableRow } from "../layout/tableTheme";
import titleCase from "../helper/titleCase";
import MenuButton from "./MenuButton";
import apiHostName from "../../secret";
import axios from "axios";
const UserTableSingleRow = (props) => {
  const { singleData, onTost, onUpdateUsers } = props;
  const [loading, setLoading] = useState(true);

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
    <StyledTableRow key={singleData.id}>
      <StyledTableCell
        component="th"
        scope="row"
        style={{ fontWeight: "bold" }}
      >
        {titleCase(singleData.name)}
      </StyledTableCell>
      <StyledTableCell align="left">{singleData.email}</StyledTableCell>
      {Array.from({ length: 4 }).map((_, index) => {
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
          <MenuButton
            name={"Yes"}
            color={"success"}
            itemName={["Remove Admin"]}
          />
        ) : (
          <MenuButton name={"No"} color={"inherit"} itemName={["Make Admin"]} />
        )}
      </StyledTableCell>
      <StyledTableCell align="center">
        {loading ? (
          <Button
            sx={{
              color: "#D32F2F",
              borderRadius: 5,
            }}
            onClick={() => {
              setLoading(false);
              deleteUser(singleData.id);
            }}
          >
            <DeleteForeverOutlinedIcon />
          </Button>
        ) : (
          <CircularProgress size={20} />
        )}
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default UserTableSingleRow;
