import React, { ReactElement } from 'react';
import Dialog from '@mui/material/Dialog';
import { Button, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import theme from '../../../styles/theme';
import { ErrorOutline } from '@mui/icons-material';

interface Props {
  open: boolean;
  onClose: () => void;
  textError: string;
}

export default function AlertError({ open, onClose, textError }: Props): ReactElement {
  return (
    <Dialog
      open={open}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      fullWidth={true}
      maxWidth='xs'>
      <DialogContent sx={{ padding: '1em' }}>
        <DialogContentText sx={{ textAlign: 'center', whiteSpace: 'pre-line', color: '#000000' }}>
          <ErrorOutline sx={{ color: '#F54949', fontSize: '4em' }} />
          <br />
          {textError}{' '}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', margin: '10px 0px 20px 0px' }}>
        <Button id='btnClose' variant='contained' color='error'
                sx={{ borderRadius: '5px', width: '126px' }}
                onClick={onClose}>
          ปิด
        </Button>
      </DialogActions>
    </Dialog>
  );
}
