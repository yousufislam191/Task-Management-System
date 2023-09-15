import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import style from "../style/notFoundPage.module.css";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className={style.area}>
      <h1 className={style.h1Text}>OPPS!</h1>
      <h1>
        <strong>404 </strong>- PAGE NOT FOUND
      </h1>
      <h3 className={style.paragraph}>
        The page you are looking for might have been removed had its name
        changed or is temporarily unavailable.
      </h3>
      <Button
        variant="contained"
        color="primary"
        className="mt-3"
        onClick={() => {
          navigate("/");
        }}
      >
        Go to home page
      </Button>
    </div>
  );
};

export default NotFoundPage;
