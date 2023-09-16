import React from "react";
import { CSpinner } from "@coreui/react";

const Loading = () => {
  return (
    <div className="d-flex flex-column min-vh-100 min-vw-100">
      <div className="d-flex flex-grow-1 justify-content-center align-items-center">
        <CSpinner
          color="primary"
          variant="grow"
          className="me-3"
          style={{ width: "5rem", height: "5rem" }}
        />
        <CSpinner
          color="dark"
          variant="grow"
          className="me-3"
          style={{ width: "5rem", height: "5rem" }}
        />
        <CSpinner
          color="secondary"
          variant="grow"
          className="fs-1"
          style={{ width: "5rem", height: "5rem" }}
        />
      </div>
    </div>
  );
};

export default Loading;
