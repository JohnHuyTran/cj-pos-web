import React, { ReactElement } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import LoadingModal from '../../../commons/ui/loading-modal';
import { useStyles } from '../../../../styles/makeTheme';
import ConfirmContent from './confirm-content';
import { ExpensePeriod } from '../../../../models/branch-accounting-model';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (value: any) => void;
  startDate: string;
  endDate: string;
  payload?: any;
  periodProps?: ExpensePeriod;
  docNo?: string;
}
interface loadingModalState {
  open: boolean;
}

export default function ModelConfirm({ open, onClose, onConfirm, startDate, endDate }: Props): ReactElement {
  const classes = useStyles();
  const [openLoadingModal, setOpenLoadingModal] = React.useState<loadingModalState>({
    open: false,
  });
  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };

  const [periodData, setPeriodData] = React.useState('');

  const handleConfirm = async () => {
    handleOpenLoading('open', true);
    onConfirm({ comment: 'comment' });
    handleOpenLoading('open', false);
    onClose();
  };

  const handleDate = async (period: any) => {
    setPeriodData(period);
  };

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth='lg'
        PaperProps={{ sx: { minWidth: 900 } }}>
        <DialogContent sx={{ mt: 3, mr: 3, ml: 3 }}>
          <ConfirmContent startDate={startDate} endDate={endDate} handleDate={handleDate} title='1 สาขา' />
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', m: 5, mr: 5, ml: 5 }}>
          <Button
            id='btnCancle'
            variant='contained'
            color='cancelColor'
            sx={{ borderRadius: 2, width: 120, mr: 4 }}
            onClick={onClose}>
            ยกเลิก
          </Button>
          <Button
            id='btnConfirm'
            variant='contained'
            color='primary'
            sx={{ borderRadius: 2, width: 120 }}
            onClick={handleConfirm}>
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>

      <LoadingModal open={openLoadingModal.open} />
    </div>
  );
}
