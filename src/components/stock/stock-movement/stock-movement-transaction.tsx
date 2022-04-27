import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import React, { ReactElement } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  mockData: string;
}
function StockMovementTransaction({ open, onClose, mockData }: Props): ReactElement {
  return (
    <Dialog
      open={open}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      fullWidth={true}
      maxWidth='xs'>
      <DialogContent sx={{ padding: '1em' }}>
        <DialogContentText sx={{ textAlign: 'center', whiteSpace: 'pre-line', color: '#000000' }}>
          StockMovementTransaction: {mockData}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', margin: '10px 0px 20px 0px' }}>
        <Button
          id='btnClose'
          variant='contained'
          color='error'
          sx={{ borderRadius: '5px', width: '126px' }}
          onClick={onClose}>
          ปิด
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default StockMovementTransaction;
