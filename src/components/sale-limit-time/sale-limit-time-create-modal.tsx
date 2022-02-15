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
import ModalAddTypeProduct from '../commons/ui/modal-add-type-product';
import { updateAddTypeAndProductState } from '../../store/slices/add-type-product-slice';

interface State {
  stNo: string;
  detailMsg: string;
  startDate: any;
  endDate: any;
  startTime: string | null;
  endTime: string | null;
  comment: string;
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
  const payloadAddTypeProduct = useAppSelector((state) => state.addTypeAndProduct.state);
  const [values, setValues] = React.useState<State>({
    stNo: '',
    detailMsg: '',
    startDate: new Date(),
    endDate: new Date(),
    startTime: null,
    endTime: null,
    comment: '',
  });
  const [status, setStatus] = React.useState<number>(0);
  const [createDate, setCreateDate] = React.useState<Date | null>(new Date());
  const [countText, setCountText] = React.useState<number>(0);
  const [openLoadingModal, setOpenLoadingModal] = React.useState(false);
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [contentMsg, setContentMsg] = React.useState('');
  const [snackbarIsStatus, setSnackbarIsStatus] = React.useState(false);
  const handleCloseSnackBar = () => {
    setShowSnackBar(false);
  };
  const [showModalProduct, setShowModalProduct] = React.useState(true);
  const [confirmModelExit, setConfirmModelExit] = React.useState(false);
  const [selectProductType, setSelectProductType] = React.useState(false);

  useEffect(() => {
    setShowModalProduct(!!Object.keys(payloadAddTypeProduct).length);
  }, [payloadAddTypeProduct]);

  const clearData = async () => {
    dispatch(updateAddTypeAndProductState({}));
  };
  const handleClose = async () => {
    setOpen(false);
    onClickClose();
    clearData();
  };

  const topFunction = () => {
    document.getElementById('top-item')?.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    });
  };

  const handleCheckClose = () => {
    if (!!Object.keys(payloadAddTypeProduct).length) {
      setConfirmModelExit(true);
    } else {
      handleClose();
    }
  };

  const handleNotExitModelConfirm = () => {
    setConfirmModelExit(false);
  };

  const handleExitModelConfirm = async () => {
    handleClose();
  };

  const handleChangeDetailMsg = (value: any) => {
    setValues({
      ...values,
      detailMsg: value,
    });
  };

  const handleStartDatePicker = (value: Date) => {
    setValues({
      ...values,
      startDate: value,
    });
  };

  const handleEndDatePicker = (value: Date) => {
    setValues({
      ...values,
      endDate: value,
    });
  };

  const handleStartTimePicker = (value: string) => {
    setValues({
      ...values,
      startTime: value,
    });
  };

  const handleEndTimePicker = (value: string) => {
    setValues({
      ...values,
      endTime: value,
    });
  };

  if (values.startDate != null && values.endDate != null) {
    if (values.endDate < values.startDate) {
      setValues({
        ...values,
        endDate: null,
      });
    }
  }

  const [openModelAddItems, setOpenModelAddItems] = React.useState(false);
  const handleOpenAddItems = () => {
    setOpenModelAddItems(true);
  };
  const handleCloseModalAddItems = () => {
    setOpenModelAddItems(false);
  };

  const handleChangeComment = (value: any) => {
    setValues({
      ...values,
      comment: value,
    });
    setCountText(value.split('').length);
  };

  const [openAlert, setOpenAlert] = React.useState(false);
  const [textError, setTextError] = React.useState('');
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleCreateSTDetail = () => {
    console.log(values);
  };

  const unSelectAllType = (showAll: boolean) => {
    setSelectProductType(showAll);
  };

  return (
    <div>
      <Dialog open={open} maxWidth="xl" fullWidth={true}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleCheckClose}>
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
              <Box mb={2}>{!!values.stNo ? values.stNo : '-'}</Box>
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
                onChange={(e) => {
                  handleChangeDetailMsg(e.target.value);
                }}
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
              <DatePickerComponent onClickDate={handleStartDatePicker} value={values.startDate} />
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              วันที่สิ้นสุดงดขาย :
            </Grid>
            <Grid item xs={3}>
              <DatePickerComponent
                onClickDate={handleEndDatePicker}
                value={values.endDate}
                type={'TO'}
                minDateTo={values.startDate}
              />
            </Grid>
            <Grid item xs={1}></Grid>
          </Grid>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={2}>
              วันที่สิ้นสุดงดขาย :
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="time-start"
                type="time"
                fullWidth
                className={classes.MtimeTextField}
                value={values.startTime}
                onChange={(e) => handleStartTimePicker(e.target.value)}
                inputProps={{
                  step: 300,
                }}
              />
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              เวลาที่สิ้นสุดงดขาย :
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="time-end"
                type="time"
                fullWidth
                className={classes.MtimeTextField}
                value={values.endTime}
                onChange={(e) => handleEndTimePicker(e.target.value)}
                inputProps={{
                  step: 300,
                }}
              />
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
              <Button
                variant="contained"
                color="warning"
                onClick={handleCreateSTDetail}
                startIcon={<SaveIcon />}
                className={classes.MbtnSearch}
                disabled={!!!Object.keys(payloadAddTypeProduct).length}
              >
                บันทึก
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{ margin: '0 17px' }}
                startIcon={<CheckCircleOutlineIcon />}
                className={classes.MbtnSearch}
                disabled={!!!Object.keys(payloadAddTypeProduct).length}
              >
                เริ่มใช้งาน
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<HighlightOffIcon />}
                disabled={!!!Object.keys(payloadAddTypeProduct).length}
                className={classes.MbtnSearch}
              >
                ยกเลิก
              </Button>
            </Grid>
          </Grid>

          <Box mb={4}>
            <STProductTypeItems selectProductType={selectProductType} />
          </Box>
          <Box mb={4}>{showModalProduct && <STProductItems unSelectAllType={unSelectAllType} />}</Box>
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
                value={values.comment}
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

      <ModalAddTypeProduct open={openModelAddItems} onClose={handleCloseModalAddItems} />

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
