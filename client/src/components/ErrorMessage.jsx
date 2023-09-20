import React from "react";

import style from "../style/notFoundPage.module.css";

const ErrorMessage = ({ status, message }) => {
  return (
    <div className={style.errorArea}>
      <h1 className={style.h1Text}>OPPS!</h1>
      <h1>
        <strong>{status} </strong>- {message}
      </h1>
      <h3 className={style.paragraph}>
        The page you are looking for might have been removed had its name
        changed or is temporarily unavailable.
      </h3>
      <h3 className={style.paragraph}>Please try again.</h3>
    </div>
  );
};

export default ErrorMessage;
