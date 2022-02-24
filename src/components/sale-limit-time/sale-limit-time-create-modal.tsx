import React, { ReactElement, useEffect } from 'react';
import moment from 'moment';
import { useAppSelector } from '../../store/store';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { Box, Button, DialogTitle, Grid, IconButton, TextField } from '@mui/material';
import { ControlPoint, HighlightOff, Tune } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';

import { useStyles } from '../../styles/makeTheme';
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
import { updatePayloadBranches } from '../../store/slices/search-branches-province-slice';
import TextBoxComment from '../commons/ui/textbox-comment';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { onChangeDate } from '../../utils/utils';
import DatePickerComponent from '../commons/ui/date-picker-detail';
import { cancelDraftST, getStartSaleLimitTime, saveDraftST } from '../../services/sale-limit-time';
import { DateFormat } from '../../utils/enum/common-enum';
import { updatesaleLimitTimeState } from '../../store/slices/sale-limit-time-slice';
import ModelConfirm from './modal-confirm';

interface State {
  detailMsg: string;
  startDate: any | Date | number | string;
  endDate: any | Date | number | string;
  startTime: string | null;
  endTime: string | null;
  comment: string;
  stStartTime: any;
  stEndTime: any;
}

interface Props {
  type: string;
  isOpen: boolean;
  setOpenPopup: (openPopup: boolean) => void;
  setPopupMsg?: any;
  onClickClose: () => void;
}

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose?: () => void;
}

const defaultMaterialTheme = createTheme({
  palette: {
    primary: {
      main: '#36C690',
    },
  },
  typography: {
    fontFamily: 'Kanit',
  },
});

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

function STCreateModal({ isOpen, onClickClose, setOpenPopup, setPopupMsg }: Props): ReactElement {
  const [open, setOpen] = React.useState(isOpen);
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const payloadAddTypeProduct = useAppSelector((state) => state.addTypeAndProduct.state);
  const payloadBranches = useAppSelector((state) => state.searchBranchProvince.payloadBranches);
  const payLoadSt = useAppSelector((state) => state.saleLimitTime.state);
  const [values, setValues] = React.useState<State>({
    detailMsg: '',
    startDate: new Date(),
    endDate: new Date(),
    startTime: '',
    endTime: '',
    comment: '',
    stStartTime: '',
    stEndTime: '',
  });
  const [checkValue, setCheckValue] = React.useState({
    detailMsgError: false,
    startDateError: false,
    endDateError: false,
    startTimeError: '',
    endTimeError: '',
    payloadBranchesError: false,
  });

  const [status, setStatus] = React.useState<number>(0);
  const [createDate, setCreateDate] = React.useState<Date | null>(new Date());
  const [openLoadingModal, setOpenLoadingModal] = React.useState(false);
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [contentMsg, setContentMsg] = React.useState('');
  const [openModalCancel, setOpenModalCancel] = React.useState<boolean>(false);
  const handleCloseSnackBar = () => {
    setShowSnackBar(false);
  };
  const [showModalProduct, setShowModalProduct] = React.useState(true);
  const [confirmModelExit, setConfirmModelExit] = React.useState(false);
  const [unSelectAllType, setUnSelectAllType] = React.useState(false);

  useEffect(() => {
    setShowModalProduct(!!Object.keys(payloadAddTypeProduct).length);
  }, [payloadAddTypeProduct]);

  useEffect(() => {
    setCheckValue({ ...checkValue, payloadBranchesError: false });
  }, [payloadBranches.saved]);

  useEffect(() => {
    if (values.startDate != null && values.endDate != null) {
      if (values.endDate < values.startDate) {
        setValues({
          ...values,
          endDate: null,
        });
      }
      if (values.startTime != '' && values.endTime != '') {
        let stStartTime = compareDateTime(values.startDate, values.startTime);
        let stEndTime = compareDateTime(values.endDate, values.endTime);
        if (stStartTime < moment(new Date(), DateFormat.DATE_TIME_DISPLAY_FORMAT)) {
          setCheckValue({ ...checkValue, startTimeError: 'เวลาเริ่มต้นต้องสูงกว่าเวลาปัจจุบัน' });
        } else if (stStartTime >= stEndTime) {
          setCheckValue({ ...checkValue, endTimeError: 'เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น' });
        } else {
          setValues({ ...values, stStartTime: stStartTime, stEndTime: stEndTime });
          setCheckValue({ ...checkValue, startTimeError: '', endTimeError: '' });
        }
      }
    }
  }, [values.startDate, values.endDate, values.startTime, values.endTime]);

  useEffect(() => {
    setStatus(payLoadSt.status);
  }, [payLoadSt.status]);

  const clearData = async () => {
    dispatch(updatesaleLimitTimeState({}));
    dispatch(updateAddTypeAndProductState([]));
    dispatch(updatePayloadBranches({ ...payloadBranches, saved: false }));
  };
  const handleClose = async () => {
    setOpen(false);
    onClickClose();
    clearData();
  };

  const compareDateTime = (date: Date, time: string | null) => {
    let dateAppend = moment(date).format(DateFormat.DATE_FORMAT) + ' ' + time;
    return moment(dateAppend, DateFormat.DATE_TIME_DISPLAY_FORMAT);
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
    setValues({ ...values, detailMsg: value });
    setCheckValue({ ...checkValue, detailMsgError: false });
  };

  const handleStartTimePicker = (value: string) => {
    setValues({ ...values, startTime: value });
    setCheckValue({ ...checkValue, startTimeError: '' });
  };

  const handleEndTimePicker = (value: string) => {
    setValues({ ...values, endTime: value });
    setCheckValue({ ...checkValue, endTimeError: '' });
  };

  const handleStartDatePicker = (value: any) => {
    setValues({ ...values, startDate: value._d });
  };

  const handleEndDatePicker = (value: any) => {
    setValues({ ...values, endDate: value._d });
  };

  const [openModelAddItems, setOpenModelAddItems] = React.useState(false);
  const handleOpenAddItems = () => {
    setOpenModelAddItems(true);
  };
  const handleCloseModalAddItems = () => {
    setOpenModelAddItems(false);
  };

  const handleChangeComment = (value: any) => {
    setValues({ ...values, comment: value });
  };

  const [openAlert, setOpenAlert] = React.useState(false);
  const [textError, setTextError] = React.useState('');
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const valiDateData = () => {
    let valiDate: boolean = true;
    let item = { ...checkValue };
    if (values.startDate === null) {
      item.startDateError = true;
      valiDate = false;
    }
    if (values.endDate === null) {
      item.endDateError = true;
      valiDate = false;
    }
    if (values.startTime === '') {
      item.startTimeError = 'กรุณาระบุรายละเอียด';
      valiDate = false;
    }
    if (values.endTime === '') {
      item.endTimeError = 'กรุณาระบุรายละเอียด';
      valiDate = false;
    }
    if (values.detailMsg === '') {
      item.detailMsgError = true;
      valiDate = false;
    }
    if (!payloadBranches.saved) {
      item.payloadBranchesError = true;
      valiDate = false;
    }
    if (checkValue.startTimeError != '') valiDate = false;
    if (checkValue.endTimeError != '') valiDate = false;
    setCheckValue(item);
    return valiDate;
  };

  const handleCreateSTDetail = async (getStart: boolean) => {
    if (valiDateData()) {
      try {
        const appliedProduct = {
          appliedProducts: payloadAddTypeProduct
            .filter((el: any) => el.selectedType === 2)
            .map((item: any) => {
              return {
                name: item.barcodeName,
                skuCode: item.skuCode,
                categoryTypeCode: item.ProductTypeCode,
              };
            }),
          appliedCategories: payloadAddTypeProduct
            .filter((el: any) => el.selectedType === 1)
            .map((item: any) => {
              return {
                name: item.productTypeName,
                code: item.productTypeCode,
              };
            }),
        };
        const body = {
          stStartTime: values.stStartTime.toISOString(true),
          stEndTime: values.stEndTime.toISOString(true),
          remark: values.comment,
          description: values.detailMsg,
          stDetail: {
            isAllBranches: payloadBranches.isAllBranches,
            appliedBranches: payloadBranches.appliedBranches,
            appliedProduct: appliedProduct,
          },
        };

        const bodyPayload = !!payLoadSt.id
          ? { ...body, id: payLoadSt.id, documentNumber: payLoadSt.documentNumber }
          : body;
        const rs = await saveDraftST(bodyPayload);
        if (rs.code === 201) {
          if (!getStart) {
            setShowSnackBar(true);
            setContentMsg('คุณได้บันทึกข้อมูลเรียบร้อยแล้ว');
            // if (onSearchBD) onSearchBD();
          }
          dispatch(
            updatesaleLimitTimeState({
              ...payLoadSt,
              id: rs.data.id,
              documentNumber: rs.data.documentNumber,
              status: 1,
            })
          );
          if (getStart) {
            handleGetStart(rs.data.id);
          }
        } else {
          setOpenAlert(true);
          setTextError('กรอกข้อมูลไม่ถูกต้องหรือไม่ได้ทำการกรอกข้อมูลที่จำเป็น กรุณาตรวจสอบอีกครั้ง');
        }
      } catch (error) {
        setOpenAlert(true);
        setTextError('กรอกข้อมูลไม่ถูกต้องหรือไม่ได้ทำการกรอกข้อมูลที่จำเป็น กรุณาตรวจสอบอีกครั้ง');
      }
    }
  };

  const handleGetStart = async (id: string) => {
    try {
      const rs = await getStartSaleLimitTime(id);

      if (rs.code === 200) {
        dispatch(
          updatesaleLimitTimeState({
            ...payLoadSt,
            // status: Number(BDStatus.WAIT_FOR_APPROVAL),
          })
        );
        setOpenPopup(true);
        setPopupMsg('คุณได้บันทึกข้อมูลเรียบร้อยแล้ว');
        handleClose();
        // if (onSearchBD) onSearchBD();
      } else {
        setOpenAlert(true);
        setTextError('กรอกข้อมูลไม่ถูกต้องหรือไม่ได้ทำการกรอกข้อมูลที่จำเป็น กรุณาตรวจสอบอีกครั้ง');
      }
    } catch (error) {
      setOpenAlert(true);
      setTextError('กรอกข้อมูลไม่ถูกต้องหรือไม่ได้ทำการกรอกข้อมูลที่จำเป็น กรุณาตรวจสอบอีกครั้ง');
    }
  };

  const handleDeleteDraft = async () => {
    if (status) {
      try {
        const rs = await cancelDraftST(payLoadSt.id);
        if (rs.status === 200) {
          setOpenPopup(true);
          setPopupMsg('คุณได้เริ่มใช้งานการกำหนดเวลา (งด) ขายสินค้าเรียบร้อยแล้ว');
          handleClose();
          // if (onSearchBD) onSearchBD();
        } else {
          setOpenAlert(true);
          setTextError('กรอกข้อมูลไม่ถูกต้องหรือไม่ได้ทำการกรอกข้อมูลที่จำเป็น กรุณาตรวจสอบอีกครั้ง');
        }
      } catch (error) {
        setOpenAlert(true);
        setTextError('กรอกข้อมูลไม่ถูกต้องหรือไม่ได้ทำการกรอกข้อมูลที่จำเป็น กรุณาตรวจสอบอีกครั้ง');
      }
    } else {
      setOpenPopup(true);
      setPopupMsg('คุณได้เริ่มใช้งานการกำหนดเวลา (งด) ขายสินค้าเรียบร้อยแล้ว');
      handleClose();
    }
  };

  const handleCloseModalCancel = () => {
    setOpenModalCancel(false);
  };

  const handleOpenCancel = () => {
    setOpenModalCancel(true);
  };
  const handleUnSelectAllType = (showAll: boolean) => {
    setUnSelectAllType(showAll);
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
              <Box mb={2}>{!!payLoadSt.documentNumber ? payLoadSt.documentNumber : '-'}</Box>
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
                error={checkValue.detailMsgError}
                className={classes.MtextField}
                value={values.detailMsg}
                inputProps={{
                  maxLength: '50',
                }}
                variant="outlined"
                onChange={(e) => {
                  handleChangeDetailMsg(e.target.value);
                }}
                // disabled={dataDetail.status > 1}
              />
              {checkValue.detailMsgError && (
                <Box textAlign="right" color="#F54949">
                  กรุณาระบุรายละเอียด
                </Box>
              )}
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
                type="TO"
                minDateTo={values.startDate}
              />
            </Grid>
            <Grid item xs={1}></Grid>
          </Grid>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={2}>
              เวลาที่เริ่มงดขาย :
            </Grid>
            <Grid item xs={3}>
              <ThemeProvider theme={defaultMaterialTheme}>
                <TextField
                  id="time-start"
                  type="time"
                  fullWidth
                  error={!!checkValue.startTimeError}
                  className={classes.MtimeTextField}
                  value={values.startTime}
                  onChange={(e) => handleStartTimePicker(e.target.value)}
                  inputProps={{
                    step: 300,
                  }}
                />
              </ThemeProvider>

              {checkValue.startTimeError && (
                <Box textAlign="right" color="#F54949">
                  {checkValue.startTimeError}
                </Box>
              )}
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
                error={!!checkValue.endTimeError}
                className={classes.MtimeTextField}
                value={values.endTime}
                onChange={(e) => handleEndTimePicker(e.target.value)}
                inputProps={{
                  step: 300,
                }}
              />
              {checkValue.endTimeError && (
                <Box textAlign="right" color="#F54949">
                  {checkValue.endTimeError}
                </Box>
              )}
            </Grid>
            <Grid item xs={1}></Grid>
          </Grid>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={2}>
              สาขา :
            </Grid>
            <Grid item xs={3}>
              <SearchBranch error={checkValue.payloadBranchesError} />
              {checkValue.payloadBranchesError && (
                <Box textAlign="right" color="#F54949">
                  กรุณาระบุรายละเอียด
                </Box>
              )}
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
                onClick={() => handleCreateSTDetail(false)}
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
                onClick={() => handleCreateSTDetail(true)}
                className={classes.MbtnSearch}
                disabled={!!!Object.keys(payloadAddTypeProduct).length}
              >
                เริ่มใช้งาน
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleOpenCancel}
                startIcon={<HighlightOffIcon />}
                // disabled={!!!Object.keys(payloadAddTypeProduct).length}
                className={classes.MbtnSearch}
              >
                ยกเลิก
              </Button>
            </Grid>
          </Grid>

          <Box mb={4}>
            <STProductTypeItems unSelectAllType={unSelectAllType} />
          </Box>
          <Box mb={4}>{showModalProduct && <STProductItems unSelectAllType={handleUnSelectAllType} />}</Box>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={3}>
              <TextBoxComment
                fieldName="หมายเหตุ :"
                defaultValue={values.comment}
                maxLength={100}
                onChangeComment={handleChangeComment}
                isDisable={status > 1}
              />
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

      <ModelConfirm
        open={openModalCancel}
        status={status}
        onClose={handleCloseModalCancel}
        onConfirm={handleDeleteDraft}
        HQCode={payLoadSt.documentNumber}
        headerTitle={'ยืนยันเริ่มใช้งานกำหนดเวลา (งด) ขายสินค้า'}
      />

      <SnackbarStatus open={showSnackBar} onClose={handleCloseSnackBar} isSuccess={true} contentMsg={contentMsg} />

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
