import React, { ReactElement } from 'react';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

interface Props {
  open: boolean;
  onClose: () => void;
  isSuccess: boolean;
  contentMsg: string;
}

export default function SnackbarStatus({ open, onClose, isSuccess, contentMsg }: Props): ReactElement {
  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
  });
  return (
    <Snackbar
      data-testid='txtSnackbar'
      open={open}
      onClose={onClose}
      autoHideDuration={6000}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}>
      <Alert
        severity={isSuccess ? 'success' : 'error'}
        sx={{
          width: '300px',
          borderRadius: '6px',
          fontSize: '14px',
        }}
        onClose={onClose}>
        {contentMsg}
      </Alert>
    </Snackbar>
  );
}
