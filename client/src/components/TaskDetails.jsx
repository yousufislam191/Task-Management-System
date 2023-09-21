import React, { useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import axios from "axios";
import apiHostName from "../../secret";
import titleCase from "../helper/titleCase";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const TaskDetails = (props) => {
  const { isOpen, closeModal, rowId } = props;

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState();
  const [status, setStatus] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [task, setTask] = useState();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const getSingleTask = async (rowId) => {
    try {
      const res = await axios.get(`${apiHostName}/task/${rowId}`);
      if (res.data.success === true) {
        setLoading(true);
        setTask(res.data.payload.task);
        console.log(res);
      }
    } catch (err) {
      setLoading(true);
      setStatus(err.response.status);
      setSuccess(err.response.data.success);
      setErrorMessage(err.response.data.message);
    }
  };
  //   getSingleTask(rowId);

  useEffect((rowId) => {
    setLoading(false);
    getSingleTask(rowId);
  }, []);

  return (
    <>
      {/* <Dialog fullScreen={fullScreen} /> */}
      <BootstrapDialog
        onClose={closeModal}
        aria-labelledby="customized-dialog-title"
        open={isOpen}
        fullScreen={fullScreen}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {task?.title}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={closeModal}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
            dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
            ac consectetur ac, vestibulum at eros.
          </Typography>
          <Typography gutterBottom>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
            Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor
            auctor.
          </Typography>
          <Typography gutterBottom>
            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo
            cursus magna, vel scelerisque nisl consectetur et. Donec sed odio
            dui. Donec ullamcorper nulla non metus auctor fringilla.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={closeModal}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
};

export default TaskDetails;
