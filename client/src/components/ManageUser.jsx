import React, { useEffect, useState } from "react";
import apiHostName from "../../secret";
import axios from "axios";
import ErrorMessage from "./ErrorMessage";
import UsersTable from "./UsersTable";
import { Typography } from "@mui/material";
import Loading from "./Loading";

const ManageUser = () => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState();
  const [status, setStatus] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState();

  const getAllUsers = async () => {
    try {
      const res = await axios.get(`${apiHostName}/user`);
      if (res.data.success === true) {
        setLoading(true);
        setData(res.data.payload);
        // console.log(res);
      }
    } catch (err) {
      setLoading(true);
      setStatus(err.response.status);
      setSuccess(err.response.data.success);
      setErrorMessage(err.response.data.message);
    }
  };

  useEffect(() => {
    setLoading(false);
    getAllUsers();
  }, []);

  return loading ? (
    <>
      {success === false ? (
        <ErrorMessage status={status} message={errorMessage} />
      ) : (
        <>
          <Typography component="h1" variant="h3" align="left" sx={{ mb: 4 }}>
            Manage Users
          </Typography>
          <UsersTable data={data} />
        </>
      )}
    </>
  ) : (
    <Loading />
  );
};

export default ManageUser;
