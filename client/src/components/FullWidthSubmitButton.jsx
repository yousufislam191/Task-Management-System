import React from "react";
import Button from "@mui/material/Button";

const FullWidthSubmitButton = ({ text }) => {
  return (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      sx={{ mt: 3, mb: 2 }}
      style={{ textTransform: "capitalize" }}
    >
      {text}
    </Button>
  );
};

export default FullWidthSubmitButton;
