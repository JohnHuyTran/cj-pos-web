import React, { ReactElement, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import LoadingModal from '../../../commons/ui/loading-modal';
import { useStyles } from '../../../../styles/makeTheme';
import ConfirmContent from './confirm-content';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (period: any) => void;
  items?: any;
  summarizTitle: string;
  summarizList: any;
}
interface loadingModalState {
  open: boolean;
}

export default function ModelConfirmSearch({
  open,
  onClose,
  onConfirm,
  items,
  summarizTitle,
  summarizList,
}: Props): ReactElement {
  const classes = useStyles();
  const [openLoadingModal, setOpenLoadingModal] = React.useState<loadingModalState>({
    open: false,
  });
  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };

  const [startDate, setStartDate] = React.useState('2022-06-16T00:00:00+07:00');
  const [endDate, setEndDate] = React.useState('2022-06-30T23:59:59.999999999+07:00');
  const [periodData, setPeriodData] = React.useState('');

  const handleConfirm = async () => {
    handleOpenLoading('open', true);
    await onConfirm(periodData);
    handleOpenLoading('open', false);
    onClose();
  };

  const handleDate = async (period: any) => {
    setPeriodData(period);
  };

  useEffect(() => {
    console.log('======> summarizTitle:', summarizTitle);
    console.log('======> summarizList:', JSON.stringify(summarizList));
  }, [open]);

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth='lg'
        PaperProps={{ sx: { minWidth: 900 } }}>
        <DialogContent sx={{ mt: 3, mr: 3, ml: 3 }}>
          <ConfirmContent startDate={startDate} endDate={endDate} handleDate={handleDate} title={summarizTitle} />
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
