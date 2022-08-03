import { Dialog, DialogContent, Grid, TextField, Typography } from '@mui/material';
import { BootstrapDialogTitle } from 'components/commons/ui/dialog-title';
import { CashPayment } from 'models/branch-accounting-model';
import React from 'react';
import { useTranslation } from 'react-i18next';
import NumberFormat from 'react-number-format';
import { useAppDispatch, useAppSelector } from 'store/store';
import { useStyles } from 'styles/makeTheme';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function ModalDetailCash({ isOpen, onClose }: Props) {
  const classes = useStyles();
  const _ = require('lodash');
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['expense', 'common']);
  const cashPayment: any = null;
  const arr: any[] = [];

  return (
    <React.Fragment>
      <Dialog open={isOpen} maxWidth='xl' fullWidth={true}>
        <BootstrapDialogTitle id='customized-dialog-title' onClose={onClose}></BootstrapDialogTitle>
        <DialogContent sx={{ minHeight: '70vh' }}>
          <Grid container spacing={1} padding={2} minWidth={'1000px'}>
            <Grid
              item
              xs={7}
              sx={{
                backgroundColor: '#f3fbf8',
                border: '1px solid #BFF1C4',
                borderRadius: '7px',
              }}>
              <Grid container spacing={2} mr={1} mt={'11px'}></Grid>
            </Grid>

            <Grid item xs={5} mt={1}>
              <Grid
                sx={{
                  backgroundColor: '#f3fbf8',
                  border: '1px solid #BFF1C4',
                  borderRadius: '7px',
                  padding: '20px 40px 20px 10px',
                }}
                container
                spacing={2}
                mb={3}>
                {arr.map((element: any, index: number) => {
                  const label = element[0];
                  return (
                    <>
                      <Grid item xs={5}>
                        <Typography>{label}</Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <NumberFormat
                          value={String(element[1])}
                          thousandSeparator={true}
                          decimalScale={2}
                          className={classes.MtextFieldNumber}
                          disabled={true}
                          customInput={TextField}
                          fixedDecimalScale
                        />
                      </Grid>
                    </>
                  );
                })}
              </Grid>
              <Grid
                sx={{
                  backgroundColor: '#f3fbf8',
                  border: '1px solid #BFF1C4',
                  borderRadius: '7px',
                  padding: '0px 40px 20px 10px',
                }}
                container
                spacing={2}></Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export default ModalDetailCash;
