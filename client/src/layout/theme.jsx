import { createTheme } from "@mui/material/styles";
const theme = createTheme({
  typography: {
    h3: {
      fontSize: "1.2rem",
      fontWeight: "700",
      "@media (min-width:600px)": {
        fontSize: "1.5rem",
      },
    },
  },
  // overrides: {
  //   MuiButton: {
  //     root: {
  //       textTransform: "capitalize",
  //     },
  //   },
  // },
});

// Define responsive typography outside the theme
theme.typography.h3[theme.breakpoints.up("md")] = {
  fontSize: "2.4rem",
};
export default theme;
