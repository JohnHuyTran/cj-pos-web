import React, { ReactElement, FC } from "react";

import { Grid, Typography, styled, Icon } from "@mui/material";

import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";

interface Props {
  title: string;
}

const TitleHeader: FC<Props> = ({ title }): ReactElement => {
  return (
    <Grid container direction="row" alignItems="center">
      <Grid item>
        <Typography variant="h6">{title} </Typography>
      </Grid>
    </Grid>
  );
};

export default TitleHeader;
