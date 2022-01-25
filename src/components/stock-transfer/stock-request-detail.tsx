import React, { ReactElement, useEffect } from 'react';
import moment from 'moment';
import { useAppSelector } from '../../store/store';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { Box, Button, DialogTitle, Grid, IconButton, TextField } from '@mui/material';
import { CheckCircleOutline, ControlPoint, HighlightOff, UploadFile } from '@mui/icons-material';
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
import { SaveStockTransferRequest } from '../../models/stock-transfer-model';
import { ApiError } from '../../models/api-error-model';
import { saveStockTransfer } from '../../services/stock-transfer';
import SnackbarStatus from '../commons/ui/snackbar-status';
import LoadingModal from '../commons/ui/loading-modal';
import AlertError from '../commons/ui/alert-error';
import TextBoxComment from '../commons/ui/textbox-comment';

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

function createStockTransfer({ type, isOpen, onClickClose }: Props): ReactElement {
  const [open, setOpen] = React.useState(isOpen);
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const stockRequestDetail = useAppSelector((state) => state.stockRequestDetail.stockRequestDetail.data);
  const payloadAddItem = useAppSelector((state) => state.addItems.state);
  let rowLength = 0;
  if (stockRequestDetail) {
    const items = stockRequestDetail.items ? stockRequestDetail.items : [];
    if (items.length > 0) rowLength = items.length;
  } else if (Object.keys(payloadAddItem).length > 0) {
    rowLength = Object.keys(payloadAddItem).length;
  }

  useEffect(() => {
    setOpen(isOpen);

    if (status === 'WAIT_FOR_APPROVAL_1') setIsDisableOC(true);
    else if (status === 'WAIT_FOR_APPROVAL_2') setIsDisableSCM(true);

    // dispatch(featchAllItemsListAsync());

    console.log('type:', type);

    console.log('startDate:', startDate);
    console.log('endDate:', endDate);

    if (type === 'View' && stockRequestDetail) {
      console.log('rtNo:', JSON.stringify(stockRequestDetail.rtNo));
      console.log('branchCode:', JSON.stringify(stockRequestDetail.branchCode));
      console.log('startDate:', JSON.stringify(stockRequestDetail.startDate));
      console.log('endDate:', JSON.stringify(stockRequestDetail.endDate));
      console.log('branchFrom:', JSON.stringify(stockRequestDetail.branchFrom));
      console.log('branchTo:', JSON.stringify(stockRequestDetail.branchTo));
      console.log('transferReason:', JSON.stringify(stockRequestDetail.transferReason));
      console.log('status:', JSON.stringify(stockRequestDetail.status));
      console.log('createdDate:', JSON.stringify(stockRequestDetail.createdDate));

      setRTNo(stockRequestDetail.rtNo);
      setCreateDate(stockRequestDetail.createdDate);

      // setStartBranch(stockRequestDetail.branchFrom);
      // setEndBranch(stockRequestDetail.branchTo);
      handleChangeStartBranch(stockRequestDetail.branchFrom);

      // setStartDate(stockRequestDetail.startDate);
      // setEndDate(stockRequestDetail.endDate);
    }
  }, [open]);

  console.log('rowLength:', rowLength);

  const [status, setStatus] = React.useState('DRAFT');
  // const [status, setStatus] = React.useState('WAIT_FOR_APPROVAL_1');
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

  const handleClose = async () => {
    setOpen(false);
    onClickClose();
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

  const [startBranch, setStartBranch] = React.useState('');
  const [endBranch, setEndBranch] = React.useState('');
  const [clearBranchDropDown, setClearBranchDropDown] = React.useState<boolean>(false);

  console.log('handleChangeStartBranch startBranch: ', startBranch);
  console.log('handleChangeStartBranch endBranch: ', endBranch);

  const handleChangeStartBranch = (branchCode: string) => {
    console.log('handleChangeStartBranch: ', branchCode);

    if (branchCode !== null) {
      let codes = JSON.stringify(branchCode);
      setValues({ ...values, branchCode: JSON.parse(codes) });
      setStartBranch(branchCode);
    } else {
      setValues({ ...values, branchCode: '' });
      setStartBranch('');
    }
  };
  const handleChangeEndBranch = (branchCode: string) => {
    if (branchCode !== null) {
      let codes = JSON.stringify(branchCode);
      setValues({ ...values, branchCode: JSON.parse(codes) });
      setEndBranch(branchCode);
    } else {
      setValues({ ...values, branchCode: '' });
      setEndBranch('');
    }
  };

  const [reasons, setReasons] = React.useState('');
  const handleChangeReasons = (ReasonsCode: string) => {
    setReasons(ReasonsCode);
  };

  const [openModelAddItems, setOpenModelAddItems] = React.useState(false);
  const handleOpenAddItems = () => {
    setOpenModelAddItems(true);
  };
  const handleModelAddItems = async () => {
    setOpenModelAddItems(false);
  };

  const handleChangeItems = async (items: any) => {
    await dispatch(updateAddItemsState(items));
  };

  const [commentOC, setCommentOC] = React.useState('');
  const [commentSCM, setCommentSCM] = React.useState('');
  const [isDisableOC, setIsDisableOC] = React.useState(false);
  const [isDisableSCM, setIsDisableSCM] = React.useState(false);

  const handleChangeCommentOC = (value: any) => {
    setCommentOC(value);
  };
  const handleChangeCommentSCM = (value: any) => {
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
    } else if (startBranch === '' || endBranch === '') {
      setOpenAlert(true);
      setTextError('กรุณาเลือกสาขาโอนสินค้า');
    } else if (validateActualQty.length > 0) {
      setOpenAlert(true);
      setTextError('กรุณาระบุจำนวนสินค้าที่รับ ต้องมีค่ามากกว่า 0');
    } else {
      const itemsList: any = [];
      const itemsState: any = [];
      if (payloadAddItem.length > 0) {
        await payloadAddItem.forEach((data: any) => {
          const item: any = {
            barcode: data.barcode,
            orderQty: data.qty,
          };
          itemsList.push(item);
          itemsState.push(data);
        });
      }

      let rt = '';
      if (rtNo) rt = rtNo;
      let reason = reasons;
      if (reason === 'All') reason = '';
      const payloadSave: SaveStockTransferRequest = {
        rtNo: rt,
        // sdNo: '',
        startDate: moment(startDate).startOf('day').toISOString(),
        endDate: moment(endDate).startOf('day').toISOString(),
        branchFrom: startBranch,
        branchTo: endBranch,
        transferReason: reason,
        items: itemsList,
      };

      await saveStockTransfer(payloadSave)
        .then((value) => {
          // setStatus(1);
          setRTNo(value.docNo);
          setShowSnackBar(true);
          setSnackbarIsStatus(true);
          setContentMsg('คุณได้บันทึกข้อมูลเรียบร้อยแล้ว');
        })
        .catch((error: ApiError) => {
          setShowSnackBar(true);
          setContentMsg(error.message);
        });
    }
    setOpenLoadingModal(false);
  };
  return (
    <div>
      <Dialog open={open} maxWidth="xl" fullWidth={true}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          <Typography sx={{ fontSize: '1em' }}>
            {(status === 'DRAFT' || status === 'AWAITING_FOR_REQUESTER') && 'รายการโอนสินค้า'}
            {status !== 'DRAFT' && status !== 'AWAITING_FOR_REQUESTER' && 'ตรวจสอบรายการโอนสินค้า'}
          </Typography>
          <Steppers status={status} type="RT"></Steppers>
          {/* <Steppers status="APPROVED" type="RT"></Steppers> */}
        </BootstrapDialogTitle>

        <DialogContent>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={2}>
              เลขที่เอกสาร BT :
            </Grid>
            <Grid item xs={4}>
              {rtNo !== '' && rtNo}
              {rtNo === '' && '-'}
            </Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={2}>
              วันที่สร้างรายการ :
            </Grid>
            <Grid item xs={4}>
              {moment(createDate).add(543, 'y').format('DD/MM/YYYY')}
            </Grid>
            <Grid item xs={6}></Grid>
          </Grid>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={2}>
              วันที่โอนสินค้า* :
            </Grid>
            <Grid item xs={3}>
              {(status === 'DRAFT' || status === 'AWAITING_FOR_REQUESTER') && (
                <DatePickerComponent onClickDate={handleStartDatePicker} value={startDate} />
              )}
              {status !== 'DRAFT' && status !== 'AWAITING_FOR_REQUESTER' && (
                <TextField
                  id="txtStartDate"
                  name="startDate"
                  size="small"
                  value={moment(startDate).add(543, 'y').format('DD/MM/YYYY')}
                  className={classes.MtextField}
                  fullWidth
                  disabled
                />
              )}
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              วันที่สิ้นสุด* :
            </Grid>
            <Grid item xs={3}>
              {(status === 'DRAFT' || status === 'AWAITING_FOR_REQUESTER') && (
                <DatePickerComponent
                  onClickDate={handleEndDatePicker}
                  value={endDate}
                  type={'TO'}
                  minDateTo={startDate}
                />
              )}
              {status !== 'DRAFT' && status !== 'AWAITING_FOR_REQUESTER' && (
                <TextField
                  id="txtEndDate"
                  name="endDate"
                  size="small"
                  value={moment(endDate).add(543, 'y').format('DD/MM/YYYY')}
                  className={classes.MtextField}
                  fullWidth
                  disabled
                />
              )}
            </Grid>
            <Grid item xs={1}></Grid>
          </Grid>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={2}>
              สาขาต้นทาง* :
            </Grid>
            <Grid item xs={3}>
              {(status === 'DRAFT' || status === 'AWAITING_FOR_REQUESTER') && (
                <BranchListDropDown
                  sourceBranchCode={endBranch}
                  onChangeBranch={handleChangeStartBranch}
                  isClear={clearBranchDropDown}
                />
              )}
              {status !== 'DRAFT' && status !== 'AWAITING_FOR_REQUESTER' && (
                <TextField
                  id="txtStartBranch"
                  name="startBranch"
                  size="small"
                  value="1123-ท่าช้าง"
                  className={classes.MtextField}
                  fullWidth
                  disabled
                />
              )}
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              สาขาปลายทาง* :
            </Grid>
            <Grid item xs={3}>
              <BranchListDropDown
                sourceBranchCode={startBranch}
                onChangeBranch={handleChangeEndBranch}
                isClear={clearBranchDropDown}
              />
            </Grid>
            <Grid item xs={1}></Grid>
          </Grid>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={2}>
              สาเหตุการโอน :
            </Grid>
            <Grid item xs={3}>
              {(status === 'DRAFT' || status === 'AWAITING_FOR_REQUESTER') && (
                <TransferReasonsListDropDown onChangeReasons={handleChangeReasons} isClear={false} />
              )}
              {status !== 'DRAFT' && status !== 'AWAITING_FOR_REQUESTER' && (
                <TextField
                  id="txtReasons"
                  name="reasons"
                  size="small"
                  value="โอนสินค้าตามรอบ"
                  className={classes.MtextField}
                  fullWidth
                  disabled
                />
              )}
            </Grid>
            <Grid item xs={7}></Grid>
          </Grid>
          {(status === 'DRAFT' || status === 'AWAITING_FOR_REQUESTER') && (
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
                  // onClick={handleSaveButton}
                  startIcon={<CheckCircleOutline />}
                  sx={{ width: 140 }}
                  // disabled={rowLength == 0}
                >
                  ส่งงาน
                </Button>
              </Grid>
            </Grid>
          )}
          {status !== 'DRAFT' && status !== 'AWAITING_FOR_REQUESTER' && (
            <Grid container spacing={2} mt={4} mb={2}>
              <Grid item xs={5}></Grid>
              <Grid item xs={7} sx={{ textAlign: 'end' }}>
                <Button
                  id="btnSave"
                  variant="contained"
                  color="error"
                  className={classes.MbtnSave}
                  // onClick={handleSave}
                  startIcon={<SaveIcon />}
                  sx={{ width: 140 }}
                  // disabled={rowLength == 0}
                >
                  ปฎิเสธ
                </Button>
                <Button
                  id="btnCreateTransfer"
                  variant="contained"
                  color="primary"
                  className={classes.MbtnSave}
                  // onClick={handleSaveButton}
                  startIcon={<CheckCircleOutline />}
                  sx={{ width: 140 }}
                  // disabled={rowLength == 0}
                >
                  อนุมัติ
                </Button>
              </Grid>
            </Grid>
          )}

          <Box mb={4}>
            {(status === 'DRAFT' || status === 'AWAITING_FOR_REQUESTER') && (
              <StockRequestCreateItem onChangeItems={handleChangeItems} />
            )}
            {status !== 'DRAFT' && status !== 'AWAITING_FOR_REQUESTER' && (
              <StockRequestItem onChangeItems={handleChangeItems} />
            )}
          </Box>

          {status !== 'DRAFT' && status !== 'AWAITING_FOR_REQUESTER' && (
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

      <ModalAddItems open={openModelAddItems} onClose={handleModelAddItems}></ModalAddItems>

      <SnackbarStatus
        open={showSnackBar}
        onClose={handleCloseSnackBar}
        isSuccess={snackbarIsStatus}
        contentMsg={contentMsg}
      />

      <LoadingModal open={openLoadingModal} />
      <AlertError open={openAlert} onClose={handleCloseAlert} textError={textError} />
    </div>
  );
}

export default createStockTransfer;
