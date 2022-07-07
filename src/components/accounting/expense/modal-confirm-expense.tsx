import { Fragment, ReactElement, useState } from 'react';
import TextBoxComment from '../../commons/ui/textbox-comment'
// import LoadingModal from '../../commons/ui/loading-modal';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
  CircularProgress } from '@mui/material';
import { LoadingButton } from '@mui/lab';

interface ModalConfirmExpenseProps {
  open: boolean;
  onClose: () => void;
  approve: boolean;
  showReason?: boolean;
  validateReason?: boolean;
}

interface DetailsProps {
	topic: string;
	detail: string;
}

interface loadingModalState {
  open: boolean;
}

export default function ModalConfirmExpense({
    open,
    approve,
    onClose,
    showReason,
    validateReason
  }: ModalConfirmExpenseProps): ReactElement {
  // Set state data
  const [reason, setReason] = useState('');
  const [isError, setIsError] = useState(false);
  const [openLoadingModal, setOpenLoadingModal] = useState<loadingModalState>({
    open: false,
  });

  // Check confirm modal
  const handleConfirm = () => {
    // Call API
    const sentConfirm = () => {
      handleOpenLoading('open', true);
      setTimeout(() => {
        handleOpenLoading('open', false);
        onCloseModal()
      }, 1000)
    }
    if (validateReason) { // Require reason
      reason === '' ? setIsError(true) : sentConfirm()
    } else { // Not require reason
      sentConfirm()
    }
  };

  // Loading
  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };

  // Clear state when close modal.
  const onCloseModal = () => {
    setReason('')
    setIsError(false)
    onClose();
  };

  return (
    <Fragment>
      <Dialog
        id="PopUpConfirmExpense"
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        PaperProps={{ sx: { minWidth: 450, minHeight: 241 } }}
      >
        <DialogContent sx={{ mt: 3, mr: 5, ml: 5 }}>
          <DialogContentText 
            id="Topic"
            align="center"
            sx={{ color: '#263238', mb: 3 }}>
            <Typography component="span" variant="h6">
              {approve ? 'ยืนยันขออนุมัติค่าใช้จ่าย' : 'ยืนยันไม่อนุมัติค่าใช้จ่าย'}
            </Typography>
          </DialogContentText>
          <Box id="Description">
            <Details topic="เลขที่เอกสาร" detail="EX22060101" />
            <Details topic="ประเภทค่าใช้จ่าย" detail="ค่าใช้จ่ายร้านกาแฟ" />
            <Details topic="งวด" detail="01/06/2565 - 15/06/2565" />
            <Details topic="ยอดเบิกทั้งหมด" detail="17,675.00 บาท" />
          </Box>
          { showReason &&
            <Box sx={{ mt: 3 }}>
              <TextBoxComment
                fieldName='หมายเหตุ :'
                defaultValue={reason}
                isDisable={openLoadingModal.open}
                maxLength={100}
                isError={validateReason ? isError : false}
                onChangeComment={(e) => {
                  setReason(e);
                  setIsError(false);
                }}
                rowDisplay={2}
              />
              { isError &&
                <Typography component="label"
                  variant="caption"
                  sx={{ color: '#F54949'}}
                >
                  กรุณาระบุหมายเหตุ
                </Typography>
              }
            </Box>
          }
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', mb: 5, mr: 5, ml: 5 }}>
          <Button
            id="btnCancle"
            variant="contained"
            color="cancelColor"
            disabled={openLoadingModal.open}
            sx={{ borderRadius: 2, width: 140, mr: 4 }}
            onClick={onCloseModal}
          >
            ยกเลิก
          </Button>
          <LoadingButton
            id="btnConfirm"
            variant="contained"
            color="primary"
            loading={openLoadingModal.open}
            loadingIndicator={
              <Typography component="span" sx={{ fontSize: '11px'}}>
                กรุณารอสักครู่{' '}
                <CircularProgress color="inherit" size={15} />
              </Typography>
            }
            sx={{ borderRadius: 2, width: 140 }}
            onClick={handleConfirm}
          >
            ยืนยัน
          </LoadingButton>
        </DialogActions>
      </Dialog>
      {/* <LoadingModal open={openLoadingModal.open} /> */}
    </Fragment>
  )
}

const Details = ({topic, detail}: DetailsProps) => {
  return (
    <Box id="DetailBox" sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Box id="DetailTitle" sx={{ width: '55%', textAlign: 'right'}}>{topic}</Box>
      <Box id="DetailLine">
        <Typography
          component="label"
          sx={{ color: '#AEAEAE', ml: '18px', mr: '5px', }}
        >
          |
        </Typography>
      </Box>
      <Box id="DetailDescription" sx={{ width: '100%'}}>
        <Typography component="label"
          sx={{ color: '#36C690', fontWeight: '700' }}>
          {detail || '-'}
        </Typography>
      </Box>
    </Box>
  )
}