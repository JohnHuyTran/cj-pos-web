import React, { ReactElement, FC } from "react";

import { Grid, Typography, styled, Icon } from "@mui/material";

import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";

interface Props {
  title: string;
  icon?: string;
}

const IconStyled = styled(Icon)({
  color: "#000000",
});

const TitleHeader: FC<Props> = ({ title, icon }): ReactElement => {
  return (
    <Grid container direction="row" alignItems="center">
      <Grid item>{icon && <IconStyled>{icon}</IconStyled>}</Grid>
      <Grid item>
        <Typography variant="h6">&nbsp;{title} </Typography>
      </Grid>
    </Grid>
  );
};

export default TitleHeader;
