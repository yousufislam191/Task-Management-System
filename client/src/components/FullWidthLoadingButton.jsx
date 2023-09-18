import React from "react";
import LoadingButton from "@mui/lab/LoadingButton";

const FullWidthLoadingButton = () => {
  return (
    <LoadingButton
      loading
      fullWidth
      variant="contained"
      sx={{ mt: 3, mb: 2 }}
      disabled
      style={{ textTransform: "capitalize" }}
    >
      Fetch Data
    </LoadingButton>
  );
};

export default FullWidthLoadingButton;
