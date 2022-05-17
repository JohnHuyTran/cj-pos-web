import React from 'react';
import { Box } from '@mui/material';
import { Grid } from '@mui/material';
import { Typography } from '@mui/material';

function PurchaseBranchRequest() {
  return (
    <>
      <Box>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 7 }}>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              xxxxx
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default PurchaseBranchRequest;
