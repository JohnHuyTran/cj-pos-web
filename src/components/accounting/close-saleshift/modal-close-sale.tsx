import { Box, Button, Dialog, DialogActions, DialogContent, Grid, Typography } from '@mui/material';
import React from 'react';
import { useStyles } from '../../../styles/makeTheme';
import { BootstrapDialogTitle } from '../../commons/ui/dialog-title';

interface Props {
  open: boolean;
  onClose: () => void;
  noOfShiftKey: string;
  docNo: string;
}
function ModalCloseSale({ open, onClose, noOfShiftKey, docNo }: Props) {
  const classes = useStyles();
  const onSubmit = () => {
    onClose();
  };
  return (
    <>
      <Dialog open={open} maxWidth='sm' fullWidth={true} key='modal-add-expense'>
        <BootstrapDialogTitle id='dialog-title' onClose={onClose}>
          <Typography sx={{ fontSize: 20, fontWeight: 400 }}>ปิดรอบยอดการขาย</Typography>
        </BootstrapDialogTitle>
        <DialogContent sx={{ justifyContent: 'center' }}>
          <Box>
            <Grid container>
              <Grid item xs={5}>
                <Typography variant='body2'>จำนวนรหัสปิดรอบ:</Typography>
              </Grid>
              <Grid item xs={7}>
                <Typography variant='body2'>{noOfShiftKey} </Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography variant='body2'>เลขที่เอกสารปิดรอบ:</Typography>
              </Grid>
              <Grid item xs={7}>
                <Typography variant='body2'>{docNo} </Typography>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', mb: 3, mr: 5, ml: 5, mt: 5 }}>
          <Button
            id='btnSearch'
            variant='contained'
            color='primary'
            onClick={onSubmit}
            sx={{ width: 110, ml: 2 }}
            className={classes.MbtnSearch}>
            ตกลง
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ModalCloseSale;
