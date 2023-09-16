import { createTheme } from "@mui/material/styles";

const theme = createTheme();
theme.typography.h3 = {
  fontSize: "1.2rem",
  fontWeight: "700",
  "@media (min-width:600px)": {
    fontSize: "1.5rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "2.4rem",
  },
};
export default theme;
