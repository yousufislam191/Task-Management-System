import * as React from "react";
import PropTypes from "prop-types";
import { Typography, Skeleton, Grid } from "@mui/material";

const variants = ["h1", "h2", "h3", "body1", "caption"];

function TypographyDemo(props) {
  const { loading = false } = props;

  return (
    <div>
      {variants.map((variant) => (
        <Typography component="div" key={variant} variant={variant}>
          {loading ? <Skeleton /> : null}
        </Typography>
      ))}
    </div>
  );
}

TypographyDemo.propTypes = {
  loading: PropTypes.bool,
};

const Loading = () => {
  return (
    <Grid container spacing={8}>
      <Grid item xs={12}>
        <TypographyDemo loading />
      </Grid>
    </Grid>
  );
};

export default Loading;
