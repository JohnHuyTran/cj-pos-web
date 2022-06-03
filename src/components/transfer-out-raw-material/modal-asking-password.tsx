import React, { ReactElement, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Typography from '@mui/material/Typography';
import LoadingModal from '../commons/ui/loading-modal';
import { TextField } from "@mui/material";
import { stringNullOrEmpty } from "../../utils/utils";
import { useStyles } from "../../styles/makeTheme";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (password: string) => boolean;
  headerTitle: string;
}

interface loadingModalState {
  open: boolean;
}

export default function ModalAskingPassword(props: Props): ReactElement {
  const { open, onClose, onConfirm, headerTitle } = props;
  const classes = useStyles();
  const [openLoadingModal, setOpenLoadingModal] = React.useState<loadingModalState>({
    open: false,
  });
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };

  const handleConfirm = async () => {
    handleOpenLoading('open', true);
    if (onConfirm(password)) {
      onClose();
    } else {
      setError('กรุณาตรวจสอบ password และลองอีกครั้ง');
    }
    handleOpenLoading('open', false);

  };

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        PaperProps={{ sx: { minWidth: 492, minHeight: 262 } }}
      >
        <DialogContent sx={{ mt: 3, mr: 5, ml: 5 }}>
          <DialogContentText id="alert-dialog-description" sx={{ color: '#263238' }}>
            <Typography variant="h6" align="center" sx={{ marginBottom: 3 }}>
              {headerTitle}
            </Typography>
            <TextField
              type={'password'}
              error={!stringNullOrEmpty(error)}
              helperText={error}
              FormHelperTextProps={{
                style: {
                  textAlign: 'right',
                  marginRight: 0,
                },
              }}
              className={classes.MtextField}
              variant="outlined"
              size="small"
              fullWidth
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', mb: 5, mr: 5, ml: 5 }}>
          <Button
            id="btnCancle"
            variant="contained"
            color="cancelColor"
            sx={{ borderRadius: 2, width: 80, mr: 4 }}
            onClick={onClose}
          >
            ยกเลิก
          </Button>
          <Button
            id="btnConfirm"
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, width: 80 }}
            onClick={handleConfirm}
          >
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>

      <LoadingModal open={openLoadingModal.open}/>
    </div>
  );
}
