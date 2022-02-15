import React, { ReactElement } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Typography from '@mui/material/Typography';
import LoadingModal from '../commons/ui/loading-modal';
import {TextField} from "@mui/material";
import {useStyles} from "../../styles/makeTheme";

interface Props {
  open: boolean;
  onClose: () => void;
  barCode: string;
}
interface loadingModalState {
  open: boolean;
}

export default function ModalReject({ open, onClose, barCode }: Props): ReactElement {
  const classes = useStyles();
  const [openLoadingModal, setOpenLoadingModal] = React.useState<loadingModalState>({
    open: false,
  });

  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };

  const handleConfirm = async () => {
    onClose();
  };

  return (
      <div>
        <Dialog
            open={open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="lg"
            PaperProps={{ sx: { minWidth: 450, height: 365 } }}
        >
          <DialogContent sx={{ mt: 1, mr: 5, ml: 5 }}>
            <DialogContentText id="alert-dialog-description" sx={{ color: '#263238' }}>
              <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>
                ยืนยันยกเลิกขอส่วนลดสินค้า
              </Typography>
              {!!barCode && (
                  <Typography variant="body1" align="left" sx={{ marginBottom: 1 }}>
                    เลขที่เอกสาร BD{' '}
                    <label
                        style={{
                          color: '#AEAEAE',
                          marginLeft: '10px',
                          marginRight: '5px',
                        }}
                    >
                      |
                    </label>{' '}
                    <label style={{ color: '#36C690' }}>
                      <b>{barCode}</b>
                    </label>
                  </Typography>
              )}
              <Typography align="left" sx={{ marginBottom: 1 }}>
                กรุณากรอกเหตุผล* :
              </Typography>
              <TextField
                  placeholder=" ความยาวไม่เกิน 100 ตัวอักษร"
                  multiline
                  rows={5}
                  className={classes.MTextareaBD}
                  inputProps={{
                    maxLength: '100',
                  }}
                  sx={{ width: '339px' }}
                  variant="outlined"
                  value={''}
              />
            </DialogContentText>
          </DialogContent>

          <DialogActions sx={{ justifyContent: 'center', mb: 2, mr: 5, ml: 5 }}>
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
        <LoadingModal open={openLoadingModal.open} />
      </div>
  );
}
