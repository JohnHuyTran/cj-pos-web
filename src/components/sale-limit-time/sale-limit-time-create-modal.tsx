import React, { ReactElement, useEffect } from 'react';
import moment from 'moment';
import { useAppSelector } from '../../store/store';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { Box, Button, DialogTitle, Grid, IconButton, TextField } from '@mui/material';
import { ControlPoint, HighlightOff } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';

import { useStyles } from '../../styles/makeTheme';
import DatePickerComponent from '../commons/ui/date-picker-detail';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { useAppDispatch } from '../../store/store';
import SnackbarStatus from '../commons/ui/snackbar-status';
import LoadingModal from '../commons/ui/loading-modal';
import AlertError from '../commons/ui/alert-error';
import ConfirmModelExit from '../commons/ui/confirm-exit-model';
import StepperBar from './steppers';
import SearchBranch from '../commons/ui/search-branch';
import ImportAppIcon from '@mui/icons-material/ExitToApp';
import STProductTypeItems from './ST-product-type-item';
import STProductItems from './ST-product-item';
import TimePickerComponent from '../commons/ui/time-picker-detail';
import { updateListSelect } from '../../store/slices/sale-limit-time-detail';

interface State {
  branchCode: string;
}

interface Props {
  type: string;
  isOpen: boolean;
  onClickClose: () => void;
}

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose?: () => void;
}
const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 3 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme: any) => theme.palette.grey[400],
          }}
        >
          <HighlightOff fontSize="large" />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

function STCreateModal({ type, isOpen, onClickClose }: Props): ReactElement {
  const [open, setOpen] = React.useState(isOpen);
  const dispatch = useAppDispatch();
  const classes = useStyles();

  const [status, setStatus] = React.useState<number>(0);
  const [stNo, setSTNo] = React.useState('');
  const listAppliedProducts = useAppSelector((state) => state.STDetail.listAppliedProducts);
  const listSelect = useAppSelector((state) => state.STDetail.listSelect);
  const [createDate, setCreateDate] = React.useState<Date | null>(new Date());
  const [timeFrom, setTimeFrom] = React.useState<Date | null>(null);
  const [timeTo, setTimeTo] = React.useState<Date | null>(null);

  const [countText, setCountText] = React.useState<number>(0);
  const [openLoadingModal, setOpenLoadingModal] = React.useState(false);
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [contentMsg, setContentMsg] = React.useState('');
  const [snackbarIsStatus, setSnackbarIsStatus] = React.useState(false);
  const handleCloseSnackBar = () => {
    setShowSnackBar(false);
  };

  const [flagSave, setFlagSave] = React.useState(false);
  const [showModalProduct, setShowModalProduct] = React.useState(false);
  const [confirmModelExit, setConfirmModelExit] = React.useState(false);

  useEffect(() => {
    setShowModalProduct(Object.keys(listSelect).length !== 0);
  }, [listSelect]);

  const handleClose = async () => {
    setOpen(false);
    onClickClose();
  };

  const topFunction = () => {
    document.getElementById('top-item')?.scrollIntoView(true);
  };

  function handleNotExitModelConfirm() {
    setConfirmModelExit(false);
  }

  const handleExitModelConfirm = async () => {
    handleClose();
  };

  const [startDate, setStartDate] = React.useState<any>();
  const [endDate, setEndDate] = React.useState<any>();
  const handleStartDatePicker = (value: any) => {
    setStartDate(value);
  };

  const handleEndDatePicker = (value: Date) => {
    setEndDate(value);
  };

  const handleStartTimePicker = (value: Date) => {
    setTimeFrom(value);
  };

  const handleEndTimePicker = (value: Date) => {
    setTimeTo(value);
  };

  if (endDate != null && startDate != null) {
    if (endDate < startDate) {
      setEndDate(null);
    }
  }

  const [openModelAddItems, setOpenModelAddItems] = React.useState(false);
  const handleOpenAddItems = () => {
    dispatch(updateListSelect(listAppliedProducts));
  };

  const [commentOC, setCommentOC] = React.useState('');

  const handleChangeComment = (value: any) => {
    setCommentOC(value);
    setCountText(value.split('').length);
  };

  const [openAlert, setOpenAlert] = React.useState(false);
  const [textError, setTextError] = React.useState('');
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleSave = async () => {};

  const handleMapPayloadSave = async () => {};

  const handleSubmit = async () => {};

  const handleApprove = async () => {};

  const [flagReject, setFlagReject] = React.useState(false);
  const handleReject = async () => {};

  const handleCloseModelConfirm = () => {
    setFlagReject(false);
  };
  const handleConfirm = async () => {};

  return (
    <div>
      <Dialog open={open} maxWidth="xl" fullWidth={true}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          <Typography sx={{ fontSize: '1em', mb: 2 }}>{'สร้างเอกสารกำหนดเวลา (งด) ขายสินค้าใหม่'}</Typography>
          <StepperBar activeStep={status} setActiveStep={setStatus} />
        </BootstrapDialogTitle>

        <DialogContent>
          <Grid container spacing={2} mb={2} mt={2} id="top-item">
            <Grid item xs={2}>
              <Box mb={2}>เลขที่เอกสาร ST :</Box>
              <Box>วันที่สร้างรายการ :</Box>
            </Grid>
            <Grid item xs={3}>
              <Box mb={2}>{!!stNo ? stNo : '-'}</Box>
              <Box>{moment(createDate).add(543, 'y').format('DD/MM/YYYY')}</Box>
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              รายละเอียด :
            </Grid>
            <Grid item xs={3}>
              <TextField
                // error
                placeholder=" ความยาวไม่เกิน 50 ตัวอักษร"
                multiline
                fullWidth
                rows={2}
                className={classes.MtextField}
                inputProps={{
                  maxLength: '50',
                }}
                variant="outlined"
                // onChange={(e) => {
                //   handleChangeNote(e.target.value);
                // }}
                // disabled={dataDetail.status > 1}
              />
              {/* <Box textAlign="right" color="#F54949">
                กรุณาระบุรายละเอียด
              </Box> */}
            </Grid>
          </Grid>
          <Grid container spacing={2} mb={2.5}>
            <Grid item xs={2}>
              วันที่เริ่มงดขาย :
            </Grid>
            <Grid item xs={3}>
              <DatePickerComponent onClickDate={handleStartDatePicker} value={startDate} />
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              วันที่สิ้นสุดงดขาย :
            </Grid>
            <Grid item xs={3}>
              <DatePickerComponent
                onClickDate={handleEndDatePicker}
                value={endDate}
                type={'TO'}
                minDateTo={startDate}
              />
            </Grid>
            <Grid item xs={1}></Grid>
          </Grid>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={2}>
              วันที่สิ้นสุดงดขาย :
            </Grid>
            <Grid item xs={3}>
              <TimePickerComponent error={false} onClickTime={handleStartTimePicker} value={timeFrom} />
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              เวลาที่สิ้นสุดงดขาย :
            </Grid>
            <Grid item xs={3}>
              <TimePickerComponent error={false} onClickTime={handleEndTimePicker} value={timeTo} />
            </Grid>
            <Grid item xs={1}></Grid>
          </Grid>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={2}>
              สาขา :
            </Grid>
            <Grid item xs={3}>
              <SearchBranch />
              {/* <Box textAlign="right" color="#F54949">
                กรุณาระบุรายละเอียด
              </Box> */}
            </Grid>
            <Grid item xs={7}></Grid>
          </Grid>

          <Grid container spacing={2} mt={4} mb={2}>
            <Grid item xs={5}>
              <Button
                id="btnAddItem"
                variant="contained"
                color="info"
                className={classes.MbtnPrint}
                onClick={handleOpenAddItems}
                startIcon={<ControlPoint />}
                sx={{ width: 126 }}
              >
                เพิ่มสินค้า
              </Button>
              <Button
                id="btnImport"
                variant="contained"
                color="primary"
                className={classes.MbtnPrint}
                startIcon={<ImportAppIcon sx={{ transform: 'rotate(90deg)' }} />}
                sx={{ width: 126, ml: '19px' }}
              >
                Import
              </Button>
            </Grid>
            <Grid item xs={7} sx={{ textAlign: 'end' }}>
              <Button variant="contained" color="warning" startIcon={<SaveIcon />} className={classes.MbtnSearch}>
                บันทึก
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{ margin: '0 17px' }}
                startIcon={<CheckCircleOutlineIcon />}
                className={classes.MbtnSearch}
              >
                เริ่มใช้งาน
              </Button>
              <Button variant="contained" color="error" startIcon={<HighlightOffIcon />} className={classes.MbtnSearch}>
                ยกเลิก
              </Button>
            </Grid>
          </Grid>

          <Box mb={4}>
            <STProductTypeItems />
          </Box>
          <Box mb={4}>{showModalProduct && <STProductItems />}</Box>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={3}>
              <Typography fontSize="14px" lineHeight="21px" height="24px">
                หมายเหตุ :
              </Typography>
              <TextField
                placeholder=" ความยาวไม่เกิน 100 ตัวอักษร"
                multiline
                fullWidth
                rows={5}
                className={classes.MTextareaBD}
                inputProps={{
                  maxLength: '100',
                }}
                variant="outlined"
                value={commentOC}
                onChange={(e) => {
                  handleChangeComment(e.target.value);
                }}
                // disabled={dataDetail.status > 1}
              />
              <Box color="#AEAEAE" textAlign="right">
                {countText}/100
              </Box>
            </Grid>
            <Grid item xs={7}></Grid>
            <Grid item xs={2} mt={15} textAlign="center">
              <IconButton onClick={topFunction}>
                <ArrowForwardIosIcon
                  sx={{
                    fontSize: '41px',
                    padding: '6px',
                    backgroundColor: '#C8E8FF',
                    transform: 'rotate(270deg)',
                    color: '#fff',
                    borderRadius: '50%',
                  }}
                />
              </IconButton>

              <Box fontSize="13px">กลับขึ้นด้านบน</Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <SnackbarStatus
        open={showSnackBar}
        onClose={handleCloseSnackBar}
        isSuccess={snackbarIsStatus}
        contentMsg={contentMsg}
      />

      {/* <ModalConfirmTransaction
        open={openModelConfirm}
        onClose={handleCloseModelConfirm}
        handleConfirm={handleConfirm}
        header={textHeaderConfirm}
        title="เลขที่เอกสาร RT"
        value={rtNo}
      /> */}

      <LoadingModal open={openLoadingModal} />
      <AlertError open={openAlert} onClose={handleCloseAlert} textError={textError} />

      <ConfirmModelExit
        open={confirmModelExit}
        onClose={handleNotExitModelConfirm}
        onConfirm={handleExitModelConfirm}
      />
    </div>
  );
}

export default STCreateModal;
