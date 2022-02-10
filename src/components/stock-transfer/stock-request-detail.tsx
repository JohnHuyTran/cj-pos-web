import React, { ReactElement, useEffect } from 'react';
import moment from 'moment';
import { useAppSelector } from '../../store/store';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { Box, Button, DialogTitle, Grid, IconButton } from '@mui/material';
import { CheckCircleOutline, ControlPoint, HighlightOff } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import Steppers from './steppers';
import { useStyles } from '../../styles/makeTheme';
import DatePickerComponent from '../commons/ui/date-picker-detail';
import BranchListDropDown from '../commons/ui/branch-list-dropdown';
import StockRequestItem from './stock-request-item';
import StockRequestCreateItem from './stock-request-create-item';
import { useAppDispatch } from '../../store/store';
import ModalAddItems from '../commons/ui/modal-add-items';
import TransferReasonsListDropDown from './transfer-reasons-list-dropdown';
import { updateAddItemsState } from '../../store/slices/add-items-slice';
import {
  Approve1StockTransferRequest,
  Approve2StockTransferRequest,
  SaveStockTransferRequest,
  SubmitStockTransferRequest,
} from '../../models/stock-transfer-model';
import { ApiError } from '../../models/api-error-model';
import {
  approve1StockRequest,
  approve2StockRequest,
  reject1StockRequest,
  reject2StockRequest,
  saveStockRequest,
  submitStockRequest,
} from '../../services/stock-transfer';
import SnackbarStatus from '../commons/ui/snackbar-status';
import LoadingModal from '../commons/ui/loading-modal';
import AlertError from '../commons/ui/alert-error';
import TextBoxComment from '../commons/ui/textbox-comment';
import { getBranchName, getReasonLabel } from '../../utils/utils';
import ModalConfirmTransaction from './modal-confirm-transaction';
import { featchSearchStockTransferRtAsync } from '../../store/slices/stock-transfer-rt-slice';
import ConfirmModelExit from '../commons/ui/confirm-exit-model';
import { featchStockRequestDetailAsync } from '../../store/slices/stock-request-detail-slice';

interface State {
  branchCode: string;
}

interface branchListOptionType {
  name: string;
  code: string;
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

function stockRequestDetail({ type, isOpen, onClickClose }: Props): ReactElement {
  const [open, setOpen] = React.useState(isOpen);
  const dispatch = useAppDispatch();
  const classes = useStyles();

  const branchList = useAppSelector((state) => state.searchBranchSlice).branchList.data;
  const reasonsList = useAppSelector((state) => state.transferReasonsList.reasonsList.data);
  const stockRequestDetail = useAppSelector((state) => state.stockRequestDetail.stockRequestDetail.data);
  const payloadAddItem = useAppSelector((state) => state.addItems.state);
  let rowLength = 0;

  if (type === 'Create') {
    if (Object.keys(payloadAddItem).length > 0) rowLength = Object.keys(payloadAddItem).length;
  } else {
    if (Object.keys(payloadAddItem).length > 0) {
      rowLength = Object.keys(payloadAddItem).length;
    } else if (stockRequestDetail) {
      const items = stockRequestDetail.items ? stockRequestDetail.items : [];
      if (items.length > 0) rowLength = items.length;
    }
  }

  useEffect(() => {
    setOpen(isOpen);

    if (type === 'View' && stockRequestDetail) {
      setStatus(stockRequestDetail.status);
      if (stockRequestDetail.status === 'WAIT_FOR_APPROVAL_1') {
        setIsDisableSCM(false);
      } else if (stockRequestDetail.status === 'WAIT_FOR_APPROVAL_2') {
        setIsDisableOC(false);
      } else {
        setIsDisableSCM(false);
        setIsDisableOC(false);
      }

      setRTNo(stockRequestDetail.rtNo);
      setCreateDate(stockRequestDetail.createdDate);

      let starD: any = stockRequestDetail.startDate;
      let endD: any = stockRequestDetail.endDate;
      setStartDate(new Date(starD));
      setEndDate(new Date(endD));

      const branchFrom = getBranchName(branchList, stockRequestDetail.branchFrom);
      const branchFromMap: branchListOptionType = {
        code: stockRequestDetail.branchFrom,
        name: branchFrom ? branchFrom : '',
      };
      setValuebranchFrom(branchFromMap);
      setFromBranch(stockRequestDetail.branchFrom);

      const branchTo = getBranchName(branchList, stockRequestDetail.branchTo);
      const branchToMap: branchListOptionType = {
        code: stockRequestDetail.branchTo,
        name: branchTo ? branchTo : '',
      };
      setValuebranchTo(branchToMap);
      setToBranch(stockRequestDetail.branchTo);

      setReasons(stockRequestDetail.transferReason);
      const reason = getReasonLabel(reasonsList, stockRequestDetail.transferReason);
      setReasonText(reason ? reason : '-');

      const auditLog = stockRequestDetail.auditLogs ? stockRequestDetail.auditLogs : [];
      if (stockRequestDetail.status === 'WAIT_FOR_APPROVAL_2') {
        const OC = `${auditLog[auditLog.length - 1].comment ? auditLog[auditLog.length - 1].comment : ''}`;
        if (OC !== '') setCommentOC(JSON.parse(`${OC}`).detail);
      } else if (stockRequestDetail.status === 'APPROVED') {
        const SCM = `${auditLog[auditLog.length - 1].comment ? auditLog[auditLog.length - 1].comment : ''}`;
        if (SCM !== '') setCommentSCM(JSON.parse(`${SCM}`).detail);
        const OC = `${auditLog[auditLog.length - 2].comment ? auditLog[auditLog.length - 2].comment : ''}`;
        if (OC !== '') setCommentOC(JSON.parse(`${OC}`).detail);
      }
    }
  }, [open]);

  const [status, setStatus] = React.useState('');
  const [rtNo, setRTNo] = React.useState('');
  const [createDate, setCreateDate] = React.useState<Date | null>(new Date());
  const [values, setValues] = React.useState<State>({
    branchCode: '',
  });
  const [openLoadingModal, setOpenLoadingModal] = React.useState(false);
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [contentMsg, setContentMsg] = React.useState('');
  const [snackbarIsStatus, setSnackbarIsStatus] = React.useState(false);
  const handleCloseSnackBar = () => {
    setShowSnackBar(false);
  };

  const [flagSave, setFlagSave] = React.useState(false);
  const [flagCreateSave, setFlagCreateSave] = React.useState(false);
  const [confirmModelExit, setConfirmModelExit] = React.useState(false);
  const handleChkSaveClose = async () => {
    if (flagSave) {
      setConfirmModelExit(true);
    } else if (!flagSave && (status === 'DRAFT' || status === 'AWAITING_FOR_REQUESTER')) {
      if (type === 'View' && rowLength !== Object.keys(payloadAddItem).length) {
        setConfirmModelExit(true);
      } else if (type === 'Create' && rowLength > 0 && !flagCreateSave) {
        setConfirmModelExit(true);
      } else {
        handleClose();
      }
    } else {
      handleClose();
    }
  };

  const handleClose = async () => {
    await dispatch(updateAddItemsState({}));
    setOpen(false);
    onClickClose();
  };

  function handleNotExitModelConfirm() {
    setConfirmModelExit(false);
  }

  const handleExitModelConfirm = async () => {
    handleClose();
  };

  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());
  const handleStartDatePicker = (value: any) => {
    setStartDate(value);
  };

  const handleEndDatePicker = (value: Date) => {
    setEndDate(value);
  };

  if (endDate != null && startDate != null) {
    if (endDate < startDate) {
      setEndDate(null);
    }
  }

  const [valuebranchTo, setValuebranchTo] = React.useState<branchListOptionType | null>(null);
  const [valuebranchFrom, setValuebranchFrom] = React.useState<branchListOptionType | null>(null);
  const [fromBranch, setFromBranch] = React.useState('');
  const [toBranch, setToBranch] = React.useState('');
  const [clearBranchDropDown, setClearBranchDropDown] = React.useState<boolean>(false);
  const handleChangeFromBranch = (branchCode: string) => {
    setFlagSave(true);
    if (branchCode !== null) {
      let codes = JSON.stringify(branchCode);
      setValues({ ...values, branchCode: JSON.parse(codes) });
      setFromBranch(branchCode);
    } else {
      setValues({ ...values, branchCode: '' });
      setFromBranch('');
    }
  };
  const handleChangeToBranch = (branchCode: string) => {
    setFlagSave(true);
    if (branchCode !== null) {
      let codes = JSON.stringify(branchCode);
      setValues({ ...values, branchCode: JSON.parse(codes) });
      setToBranch(branchCode);
    } else {
      setValues({ ...values, branchCode: '' });
      setToBranch('');
    }
  };

  const [reasons, setReasons] = React.useState('');
  const [reasonText, setReasonText] = React.useState('');
  const handleChangeReasons = (ReasonsCode: string) => {
    setFlagSave(true);
    setReasons(ReasonsCode);
  };

  const [openModelAddItems, setOpenModelAddItems] = React.useState(false);
  const handleOpenAddItems = () => {
    setOpenModelAddItems(true);
  };
  const handleModelAddItems = async () => {
    setFlagSave(true);
    setOpenModelAddItems(false);
  };

  const handleChangeItems = async (items: any) => {
    // setFlagSave(true);
    await dispatch(updateAddItemsState(items));
  };

  const handleStatusChangeItems = async (items: any) => {
    setFlagSave(true);
  };

  const [commentOC, setCommentOC] = React.useState('');
  const [commentSCM, setCommentSCM] = React.useState('');
  const [isDisableOC, setIsDisableOC] = React.useState(true);
  const [isDisableSCM, setIsDisableSCM] = React.useState(true);

  const handleChangeCommentOC = (value: any) => {
    setFlagSave(true);
    setCommentOC(value);
  };
  const handleChangeCommentSCM = (value: any) => {
    setFlagSave(true);
    setCommentSCM(value);
  };

  const [openAlert, setOpenAlert] = React.useState(false);
  const [textError, setTextError] = React.useState('');
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleSave = async () => {
    setOpenLoadingModal(true);

    let validateActualQty = payloadAddItem.filter((r: any) => r.qty === 0);
    if (!startDate || !endDate) {
      setOpenAlert(true);
      setTextError('กรุณาเลือกวันที่โอนสินค้า');
    } else if (fromBranch === '' || toBranch === '') {
      setOpenAlert(true);
      setTextError('กรุณาเลือกสาขาโอนสินค้า');
    } else if (reasons === 'All' || reasons === undefined || reasons === '') {
      setOpenAlert(true);
      setTextError('กรุณาเลือกสาเหตุการโอน');
    } else if (validateActualQty.length > 0) {
      setOpenAlert(true);
      setTextError('กรุณาระบุจำนวนสินค้าที่รับ ต้องมีค่ามากกว่า 0');
    } else {
      const payloadSave: any = await handleMapPayloadSave();
      await saveStockRequest(payloadSave)
        .then(async (value) => {
          await dispatch(featchStockRequestDetailAsync(value.docNo));

          if (type === 'Create') {
            type = 'View';
            setFlagCreateSave(true);
          }

          setFlagSave(false);
          setRTNo(value.docNo);
          setStatus('DRAFT');
          setShowSnackBar(true);
          setSnackbarIsStatus(true);
          setContentMsg('คุณได้บันทึกข้อมูลเรียบร้อยแล้ว');
        })
        .catch((error: ApiError) => {
          setShowSnackBar(true);
          if (error.code === 40010) {
            setContentMsg(
              'สาขาปลายทางไม่สามารถรับโอนสินค้าได้ เนื่องจากไม่มีการผูกข้อมูลกลุ่มสินค้า(assortment)ไว้ที่สาขา'
            );
          } else {
            setContentMsg(error.message);
          }
        });
    }
    setOpenLoadingModal(false);
  };

  const handleMapPayloadSave = async () => {
    const itemsList: any = [];
    const itemsState: any = [];
    if (Object.keys(payloadAddItem).length > 0) {
      await payloadAddItem.forEach((data: any) => {
        const item: any = {
          barcode: data.barcode,
          orderQty: data.orderQty ? data.orderQty : data.qty ? data.qty : 0,
        };
        itemsList.push(item);
        itemsState.push(data);
      });

      // await dispatch(updateAddItemsState(itemsState));
    }

    let rt = '';
    if (rtNo) rt = rtNo;
    // let reason = reasons;
    // if (reason === 'All') reason = '';
    const payload: SaveStockTransferRequest = {
      rtNo: rt,
      startDate: moment(startDate).startOf('day').toISOString(),
      endDate: moment(endDate).startOf('day').toISOString(),
      branchFrom: fromBranch,
      branchTo: toBranch,
      transferReason: reasons,
      items: itemsList,
    };

    return await payload;
  };

  const handleSubmit = async () => {
    setOpenLoadingModal(true);

    let validateActualQty = payloadAddItem.filter((r: any) => r.qty === 0);
    if (!startDate || !endDate) {
      setOpenAlert(true);
      setTextError('กรุณาเลือกวันที่โอนสินค้า');
    } else if (fromBranch === '' || toBranch === '') {
      setOpenAlert(true);
      setTextError('กรุณาเลือกสาขาโอนสินค้า');
    } else if (reasons === 'All' || reasons === undefined || reasons === '') {
      setOpenAlert(true);
      setTextError('กรุณาเลือกสาเหตุการโอน');
    } else if (validateActualQty.length > 0) {
      setOpenAlert(true);
      setTextError('กรุณาระบุจำนวนสินค้าที่รับ ต้องมีค่ามากกว่า 0');
    } else {
      if (rtNo === '') {
        const payloadSave: any = await handleMapPayloadSave();
        await saveStockRequest(payloadSave)
          .then((value) => {
            setFlagSave(false);
            setRTNo(value.docNo);
            setStatus('DRAFT');

            setTextHeaderConfirm('ยืนยันส่งงาน รายการโอนสินค้า');
            setOpenModelConfirm(true);
          })
          .catch((error: ApiError) => {
            setShowSnackBar(true);
            setContentMsg(error.message);
          });
      } else {
        setTextHeaderConfirm('ยืนยันส่งงาน รายการโอนสินค้า');
        setOpenModelConfirm(true);
      }
    }

    setOpenLoadingModal(false);
  };

  const handleApprove = async () => {
    setOpenLoadingModal(true);
    if (status === 'WAIT_FOR_APPROVAL_1') {
      setTextHeaderConfirm('ยืนยันส่งรายการโอนสินค้าให้ SCM');
      setOpenModelConfirm(true);
    } else if (status === 'WAIT_FOR_APPROVAL_2') {
      if (toBranch === '') {
        setOpenAlert(true);
        setTextError('กรุณาเลือกสาขาโอนสินค้าปลายทาง');
      } else {
        setOpenModelConfirm(true);
        setTextHeaderConfirm('ยืนยันรายการโอนสินค้า');
      }
    }

    setOpenLoadingModal(false);
  };

  const [flagReject, setFlagReject] = React.useState(false);
  const handleReject = async () => {
    setOpenLoadingModal(true);
    if (status === 'WAIT_FOR_APPROVAL_1') {
      if (commentOC === '') {
        setOpenAlert(true);
        setTextError('กรุณากรอกหมายเหตุจาก OC');
      } else {
        setFlagReject(true);
        setTextHeaderConfirm('ยืนยันไม่อนุมัติรายการโอนสินค้า');
        setOpenModelConfirm(true);
      }
    } else if (status === 'WAIT_FOR_APPROVAL_2') {
      if (commentSCM === '') {
        setOpenAlert(true);
        setTextError('กรุณากรอกหมายเหตุจาก SCM');
      } else if (toBranch === '') {
        setOpenAlert(true);
        setTextError('กรุณาเลือกสาขาโอนสินค้าปลายทาง');
      } else {
        setFlagReject(true);
        setTextHeaderConfirm('ยืนยันไม่อนุมัติรายการโอนสินค้า');
        setOpenModelConfirm(true);
      }
    }

    setOpenLoadingModal(false);
  };

  const payloadSearch = useAppSelector((state) => state.searchStockTransferRt.searchStockTransferRt);
  const [openModelConfirm, setOpenModelConfirm] = React.useState(false);
  const [textHeaderConfirm, setTextHeaderConfirm] = React.useState('');
  const handleCloseModelConfirm = () => {
    setFlagReject(false);
    setOpenModelConfirm(false);
  };
  const handleConfirm = async () => {
    setOpenModelConfirm(false);
    setOpenLoadingModal(true);

    if (status === 'DRAFT' || status === 'AWAITING_FOR_REQUESTER') {
      const itemsList: any = [];
      if (Object.keys(payloadAddItem).length > 0) {
        await payloadAddItem.forEach((data: any) => {
          const item: any = {
            barcode: data.barcode,
            orderQty: data.orderQty ? data.orderQty : data.qty ? data.qty : 0,
          };
          itemsList.push(item);
        });

        // let reason = reasons;
        // if (reason === 'All') reason = '';
        const payloadSubmit: SubmitStockTransferRequest = {
          startDate: moment(startDate).startOf('day').toISOString(),
          endDate: moment(endDate).startOf('day').toISOString(),
          branchFrom: fromBranch,
          branchTo: toBranch,
          transferReason: reasons,
          items: itemsList,
        };

        await submitStockRequest(rtNo, payloadSubmit)
          .then((value) => {
            setFlagSave(false);
            setShowSnackBar(true);
            setSnackbarIsStatus(true);
            setContentMsg('คุณได้ส่งงานเรียบร้อยแล้ว');

            dispatch(featchSearchStockTransferRtAsync(payloadSearch));

            setTimeout(() => {
              handleClose();
            }, 500);
          })
          .catch((error: ApiError) => {
            setShowSnackBar(true);
            if (error.code === 40010) {
              setContentMsg(
                'สาขาปลายทางไม่สามารถรับโอนสินค้าได้ เนื่องจากไม่มีการผูกข้อมูลกลุ่มสินค้า(assortment)ไว้ที่สาขา'
              );
            } else {
              setContentMsg(error.message);
            }
          });
      }
    } else if (status === 'WAIT_FOR_APPROVAL_1') {
      const payload1: Approve1StockTransferRequest = {
        comment: {
          by: 'OC',
          detail: commentOC,
        },
      };

      if (flagReject) {
        setFlagReject(false);
        await reject1StockRequest(rtNo, payload1)
          .then((value) => {
            setFlagSave(false);
            setShowSnackBar(true);
            setSnackbarIsStatus(true);
            setContentMsg('คุณได้ปฎิเสธข้อมูลเรียบร้อยแล้ว');
            dispatch(featchSearchStockTransferRtAsync(payloadSearch));

            setTimeout(() => {
              handleClose();
            }, 500);
          })
          .catch((error) => {
            setShowSnackBar(true);
            setContentMsg(error.message);
          });
      } else {
        await approve1StockRequest(rtNo, payload1)
          .then((value) => {
            setFlagSave(false);
            setShowSnackBar(true);
            setSnackbarIsStatus(true);
            setContentMsg('คุณได้อนุมัติข้อมูลเรียบร้อยแล้ว');
            dispatch(featchSearchStockTransferRtAsync(payloadSearch));

            setTimeout(() => {
              handleClose();
            }, 500);
          })
          .catch((error) => {
            setShowSnackBar(true);
            setContentMsg(error.message);
          });
      }
    } else if (status === 'WAIT_FOR_APPROVAL_2') {
      const payload2: Approve2StockTransferRequest = {
        branchTo: toBranch,
        comment: {
          by: 'SCM',
          detail: commentSCM,
        },
      };

      if (flagReject) {
        setFlagReject(false);
        await reject2StockRequest(rtNo, payload2)
          .then((value) => {
            setFlagSave(false);
            setShowSnackBar(true);
            setSnackbarIsStatus(true);
            setContentMsg('คุณได้ปฎิเสธข้อมูลเรียบร้อยแล้ว');
            dispatch(featchSearchStockTransferRtAsync(payloadSearch));

            setTimeout(() => {
              handleClose();
            }, 500);
          })
          .catch((error) => {
            setShowSnackBar(true);
            setContentMsg(error.message);
          });
      } else {
        await approve2StockRequest(rtNo, payload2)
          .then((value) => {
            setFlagSave(false);
            setShowSnackBar(true);
            setSnackbarIsStatus(true);
            setContentMsg('คุณได้อนุมัติข้อมูลเรียบร้อยแล้ว');
            dispatch(featchSearchStockTransferRtAsync(payloadSearch));

            setTimeout(() => {
              handleClose();
            }, 500);
          })
          .catch((error: ApiError) => {
            setShowSnackBar(true);
            if (error.code === 40010) {
              setContentMsg(
                'สาขาปลายทางไม่สามารถรับโอนสินค้าได้ เนื่องจากไม่มีการผูกข้อมูลกลุ่มสินค้า(assortment)ไว้ที่สาขา'
              );
            } else {
              setContentMsg(error.message);
            }
          });
      }
    }

    setOpenLoadingModal(false);
  };

  return (
    <div>
      <Dialog open={open} maxWidth="xl" fullWidth={true}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleChkSaveClose}>
          <Typography sx={{ fontSize: '1em' }}>
            {type === 'Create' && 'สร้างรายการโอนสินค้า'}
            {type !== 'Create' && (status === 'DRAFT' || status === 'AWAITING_FOR_REQUESTER') && 'รายการโอนสินค้า'}
            {type !== 'Create' && status !== 'DRAFT' && status !== 'AWAITING_FOR_REQUESTER' && 'ตรวจสอบรายการโอนสินค้า'}
          </Typography>
          {status !== '' && <Steppers status={status} type="RT"></Steppers>}
          {status === '' && <Steppers status="DRAFT" type="RT"></Steppers>}
        </BootstrapDialogTitle>

        <DialogContent>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={2}>
              เลขที่เอกสาร RT :
            </Grid>
            <Grid item xs={4}>
              {rtNo !== '' && rtNo}
              {rtNo === '' && '-'}
            </Grid>
            <Grid item xs={2}>
              วันที่สร้างรายการ :
            </Grid>
            <Grid item xs={4}>
              {moment(createDate).add(543, 'y').format('DD/MM/YYYY')}
            </Grid>
          </Grid>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={2}>
              วันที่โอนสินค้า* :
            </Grid>
            <Grid item xs={3}>
              {(status === '' || status === 'DRAFT' || status === 'AWAITING_FOR_REQUESTER') && (
                <DatePickerComponent onClickDate={handleStartDatePicker} value={startDate} />
              )}
              {status !== '' &&
                status !== 'DRAFT' &&
                status !== 'AWAITING_FOR_REQUESTER' &&
                moment(startDate).add(543, 'y').format('DD/MM/YYYY')}
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              วันที่สิ้นสุด* :
            </Grid>
            <Grid item xs={3}>
              {(status === '' || status === 'DRAFT' || status === 'AWAITING_FOR_REQUESTER') && (
                <DatePickerComponent
                  onClickDate={handleEndDatePicker}
                  value={endDate}
                  type={'TO'}
                  minDateTo={startDate}
                />
              )}
              {status !== '' &&
                status !== 'DRAFT' &&
                status !== 'AWAITING_FOR_REQUESTER' &&
                moment(endDate).add(543, 'y').format('DD/MM/YYYY')}
            </Grid>
            <Grid item xs={1}></Grid>
          </Grid>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={2}>
              สาขาต้นทาง* :
            </Grid>
            <Grid item xs={3}>
              {(status === '' || status === 'DRAFT' || status === 'AWAITING_FOR_REQUESTER') && (
                <BranchListDropDown
                  valueBranch={valuebranchFrom}
                  sourceBranchCode={toBranch}
                  onChangeBranch={handleChangeFromBranch}
                  isClear={clearBranchDropDown}
                />
              )}
              {status !== '' && status !== 'DRAFT' && status !== 'AWAITING_FOR_REQUESTER' && valuebranchFrom?.name}
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              สาขาปลายทาง* :
            </Grid>
            <Grid item xs={3}>
              {(status === '' ||
                status === 'DRAFT' ||
                status === 'AWAITING_FOR_REQUESTER' ||
                status === 'WAIT_FOR_APPROVAL_2') && (
                <BranchListDropDown
                  valueBranch={valuebranchTo}
                  sourceBranchCode={fromBranch}
                  onChangeBranch={handleChangeToBranch}
                  isClear={clearBranchDropDown}
                />
              )}

              {status !== '' &&
                status !== 'DRAFT' &&
                status !== 'AWAITING_FOR_REQUESTER' &&
                status !== 'WAIT_FOR_APPROVAL_2' &&
                valuebranchTo?.name}
            </Grid>
            <Grid item xs={1}></Grid>
          </Grid>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={2}>
              สาเหตุการโอน* :
            </Grid>
            <Grid item xs={3}>
              {(status === '' || status === 'DRAFT' || status === 'AWAITING_FOR_REQUESTER') && (
                <TransferReasonsListDropDown
                  reasonsValue={reasons}
                  onChangeReasons={handleChangeReasons}
                  isClear={false}
                />
              )}
              {status !== '' && status !== 'DRAFT' && status !== 'AWAITING_FOR_REQUESTER' && reasonText}
            </Grid>
            <Grid item xs={7}></Grid>
          </Grid>
          {(status === '' || status === 'DRAFT' || status === 'AWAITING_FOR_REQUESTER') && (
            <Grid container spacing={2} mt={4} mb={2}>
              <Grid item xs={5}>
                <Button
                  id="btnAddItem"
                  variant="contained"
                  color="info"
                  className={classes.MbtnPrint}
                  onClick={handleOpenAddItems}
                  startIcon={<ControlPoint />}
                  sx={{ width: 200 }}
                >
                  เพิ่มสินค้า
                </Button>
              </Grid>
              <Grid item xs={7} sx={{ textAlign: 'end' }}>
                <Button
                  id="btnSave"
                  variant="contained"
                  color="warning"
                  className={classes.MbtnSave}
                  onClick={handleSave}
                  startIcon={<SaveIcon />}
                  sx={{ width: 140 }}
                  disabled={rowLength == 0}
                >
                  บันทึก
                </Button>
                <Button
                  id="btnCreateTransfer"
                  variant="contained"
                  color="primary"
                  className={classes.MbtnSave}
                  onClick={handleSubmit}
                  startIcon={<CheckCircleOutline />}
                  sx={{ width: 140 }}
                  disabled={rowLength == 0}
                >
                  ส่งงาน
                </Button>
              </Grid>
            </Grid>
          )}

          {status !== '' && status !== 'DRAFT' && status !== 'AWAITING_FOR_REQUESTER' && status !== 'APPROVED' && (
            <Grid container spacing={2} mt={4} mb={2}>
              <Grid item xs={5}></Grid>
              <Grid item xs={7} sx={{ textAlign: 'end' }}>
                <Button
                  id="btnSave"
                  variant="contained"
                  color="error"
                  className={classes.MbtnSave}
                  onClick={handleReject}
                  startIcon={<SaveIcon />}
                  sx={{ width: 140 }}
                >
                  ปฎิเสธ
                </Button>
                <Button
                  id="btnCreateTransfer"
                  variant="contained"
                  color="primary"
                  className={classes.MbtnSave}
                  onClick={handleApprove}
                  startIcon={<CheckCircleOutline />}
                  sx={{ width: 140 }}
                >
                  อนุมัติ
                </Button>
              </Grid>
            </Grid>
          )}
          <Box mb={4}>
            {(status === '' || status === 'DRAFT' || status === 'AWAITING_FOR_REQUESTER') && (
              <StockRequestCreateItem
                type={type}
                onChangeItems={handleChangeItems}
                changeItems={handleStatusChangeItems}
                update={flagSave}
              />
            )}

            {status !== '' && status !== 'DRAFT' && status !== 'AWAITING_FOR_REQUESTER' && (
              <StockRequestItem onChangeItems={handleChangeItems} />
            )}
          </Box>
          {status !== '' && status !== 'DRAFT' && status !== 'AWAITING_FOR_REQUESTER' && (
            <Grid container spacing={2} mb={2}>
              <Grid item xs={3}>
                <TextBoxComment
                  fieldName="หมายเหตุจาก OC :"
                  defaultValue={commentOC}
                  maxLength={100}
                  onChangeComment={handleChangeCommentOC}
                  isDisable={!isDisableOC}
                />
              </Grid>
              <Grid item xs={6}></Grid>
              <Grid item xs={3}>
                <TextBoxComment
                  fieldName="หมายเหตุจาก SCM :"
                  defaultValue={commentSCM}
                  maxLength={100}
                  onChangeComment={handleChangeCommentSCM}
                  isDisable={!isDisableSCM}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      <ModalAddItems
        open={openModelAddItems}
        onClose={handleModelAddItems}
        requestBody={{
          skuCodes: [],
        }}
      ></ModalAddItems>

      <SnackbarStatus
        open={showSnackBar}
        onClose={handleCloseSnackBar}
        isSuccess={snackbarIsStatus}
        contentMsg={contentMsg}
      />

      <ModalConfirmTransaction
        open={openModelConfirm}
        onClose={handleCloseModelConfirm}
        handleConfirm={handleConfirm}
        header={textHeaderConfirm}
        title="เลขที่เอกสาร RT"
        value={rtNo}
      />

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

export default stockRequestDetail;
