import { Dialog, DialogContent, Grid } from '@mui/material';
import { BootstrapDialogTitle } from 'components/commons/ui/dialog-title';
import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function ModalDetailCash({ isOpen, onClose }: Props) {
  return (
    <React.Fragment>
      <Dialog open={isOpen} maxWidth='xl' fullWidth={true}>
        <BootstrapDialogTitle id='customized-dialog-title' onClose={onClose}></BootstrapDialogTitle>
        <DialogContent sx={{ minHeight: '70vh' }}>
          <Grid container spacing={1} padding={2} minWidth={'1000px'}>
            <Grid
              item
              xs={7}
              pr={1}
              mt={1}
              sx={{
                // backgroundColor: '#f3fbf8',
                border: '1px solid #EAEBEB',
                borderRadius: '7px',
                padding: '20px 40px 20px 10px',
              }}>
              รายการรับตามประเภทชำระ
            </Grid>

            <Grid
              item
              xs={5}
              pr={1}
              mt={1}
              sx={{
                // backgroundColor: '#f3fbf8',
                border: '1px solid #EAEBEB',
                borderRadius: '7px',
                padding: '20px 40px 20px 10px',
              }}>
              รายการรับตามประเภท
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export default ModalDetailCash;
