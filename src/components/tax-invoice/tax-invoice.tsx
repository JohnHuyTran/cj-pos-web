import { Grid } from '@mui/material';
import { Box } from '@mui/material';
import { useStyles } from '../../styles/makeTheme';
import { Button } from '@mui/material';
import Search from '@mui/icons-material/Search';

export default function TaxInvoice() {
  const classes = useStyles();

  return (
    <>
      <Box>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 7 }}>
          <Grid item container xs={12} sx={{ mt: 3 }} justifyContent="flex-end" direction="row" alignItems="flex-end">
            <Button
              id="btnCreateSupplierModal"
              variant="contained"
              // onClick={handleOpenModal}
              sx={{ minWidth: '15%' }}
              className={classes.MbtnClear}
              startIcon={<Search />}
              color="secondary"
            >
              view
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
