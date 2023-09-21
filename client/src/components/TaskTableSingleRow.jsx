import React, { useState } from "react";
import { StyledTableCell, StyledTableRow } from "../layout/tableTheme";
import dateFormate from "../helper/dateFormate";
import titleCase from "../helper/titleCase";
import TaskDetails from "./TaskDetails";

const TaskTableSingleRow = (props) => {
  const { singleData } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowId, setRowId] = useState();

  const handleRowClick = (id) => {
    setRowId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <StyledTableRow
        key={singleData.id}
        onClick={() => handleRowClick(singleData.id)}
        style={{ cursor: "pointer" }}
      >
        <StyledTableCell
          component="th"
          scope="row"
          style={{ fontWeight: "bold" }}
        >
          {titleCase(singleData.title)}
        </StyledTableCell>
        <StyledTableCell align="center">
          {dateFormate(singleData.deadline)}
        </StyledTableCell>
        <StyledTableCell align="center">
          {singleData.status === 0 ? (
            <p style={{ color: "blue" }}>Assigned</p>
          ) : singleData.status === 1 ? (
            <p style={{ color: "orange" }}>In Progress</p>
          ) : singleData.status === 2 ? (
            <p style={{ color: "green" }}>Done</p>
          ) : null}
        </StyledTableCell>
        <StyledTableCell align="center">
          {singleData.createdBy.name}
        </StyledTableCell>
        <StyledTableCell align="left">{singleData.tag}</StyledTableCell>
      </StyledTableRow>
      <TaskDetails isOpen={isModalOpen} closeModal={closeModal} rowId={rowId} />
    </>
  );
};

export default TaskTableSingleRow;
