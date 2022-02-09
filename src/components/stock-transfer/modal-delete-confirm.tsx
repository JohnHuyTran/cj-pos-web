import React, { ReactElement } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Typography from '@mui/material/Typography';
import LoadingModal from '../commons/ui/loading-modal';

interface Props {
  open: boolean;
  onClose: (confirm: boolean) => void;
}

export default function ModelConfirm({ open, onClose }: Props): ReactElement {
  const handleDeleteItem = async () => {
    return onClose(true);
  };

  const handleClose = () => {
    return onClose(false);
  };

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="md"
      sx={{ minWidth: 800 }}
    >
      <DialogContent sx={{ pl: 6, pr: 8 }}>
        <DialogContentText id="alert-dialog-description" sx={{ color: '#263238' }}>
          <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>
            ยืนยันการลบ
          </Typography>
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', mb: 2, pl: 6, pr: 8 }}>
        <Button
          id="btnCancle"
          variant="contained"
          color="cancelColor"
          sx={{ borderRadius: 2, width: 90, mr: 2 }}
          onClick={handleClose}
        >
          ยกเลิก
        </Button>
        <Button
          id="btnConfirm"
          variant="contained"
          color="error"
          sx={{ borderRadius: 2, width: 90 }}
          onClick={handleDeleteItem}
        >
          ลบ
        </Button>
      </DialogActions>
    </Dialog>
  );
}
