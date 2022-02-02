import React, { useMemo } from 'react';
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridRenderCellParams,
  GridRowData,
  GridRowId,
  GridValueGetterParams,
  useGridApiRef,
} from '@mui/x-data-grid';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { BootstrapDialogTitle } from '../commons/ui/dialog-title';
import DatePickerComponent from '../commons/ui/date-picker-detail';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import ControlPoint from '@mui/icons-material/ControlPoint';
import { useStyles } from '../../styles/makeTheme';
import { getBranchName, getReasonLabel, isOwnBranch, numberWithCommas } from '../../utils/utils';
import { useAppDispatch, useAppSelector } from '../../store/store';
import SnackbarStatus from '../commons/ui/snackbar-status';
import AlertError from '../commons/ui/alert-error';
import LoadingModal from '../commons/ui/loading-modal';
import ConfirmModalExit from '../commons/ui/confirm-exit-model';
import ModalConfirmTransaction from './modal-confirm-transaction';
import { BranchTransferRequest, Item } from '../../models/stock-transfer-model';
import { saveBranchTransfer, sendBranchTransferToDC } from '../../services/stock-transfer';
import moment from 'moment';
import { ApiError } from '../../models/api-error-model';
import TextBoxComment from '../commons/ui/textbox-comment';
import Steppers from './steppers';
import { convertUtcToBkkDate } from '../../utils/date-utill';
import { featchBranchTransferDetailAsync } from '../../store/slices/stock-transfer-branch-request-slice';
import { featchSearchStockTransferAsync } from '../../store/slices/stock-transfer-slice';
import ModalAddItems from '../commons/ui/modal-add-items';

interface Props {
  isOpen: boolean;
  onClickClose: () => void;
}

const columns: GridColDef[] = [
  {
    field: 'index',
    headerName: 'ลำดับ',
    //flex: 0.5,
    width: 70,
    headerAlign: 'center',
    sortable: false,
    // hide: true,
    renderCell: (params) => (
      <Box component='div' sx={{ paddingLeft: '20px' }}>
        {params.value}
      </Box>
    ),
  },
  {
    field: 'barcode',
    headerName: 'บาร์โค้ด',
    width: 300,
    flex: 0.7,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'productName',
    headerName: 'รายละเอียดสินค้า',
    headerAlign: 'center',
    width: 220,
    flex: 1,
    sortable: false,
    renderCell: (params) => (
      <div>
        <Typography variant='body2'>{params.value}</Typography>
        <Typography color='textSecondary' sx={{ fontSize: 12 }}>
          {params.getValue(params.id, 'skuCode') || ''}
        </Typography>
      </div>
    ),
  },
  {
    field: 'remainStock',
    headerName: 'สต๊อกสินค้าคงเหลือ',
    width: 150,
    headerAlign: 'center',
    align: 'right',
    sortable: false,
    renderCell: (params) => numberWithCommas(params.value),
  },
  {
    field: 'qty',
    headerName: 'จำนวนที่สั่ง',
    width: 150,
    headerAlign: 'center',
    align: 'right',
    sortable: false,
    renderCell: (params) => numberWithCommas(params.value),
  },
  {
    field: 'unitName',
    headerName: 'หน่วย',
    width: 110,
    headerAlign: 'center',
    sortable: false,
  },
  {
    field: 'actualQty',
    headerName: 'จำนวนโอนจริง',
    width: 150,
    headerAlign: 'center',
    sortable: false,
    renderCell: (params: GridRenderCellParams) => (
      <div>
        <TextField
          variant='outlined'
          name='txnActualQty'
          type='number'
          inputProps={{ style: { textAlign: 'right' } }}
          value={params.value}
          onChange={(e) => {
            var qty: any =
              params.getValue(params.id, 'qty') &&
              params.getValue(params.id, 'qty') !== null &&
              params.getValue(params.id, 'qty') != undefined
                ? params.getValue(params.id, 'qty')
                : 0;
            var value = e.target.value ? parseInt(e.target.value, 10) : '0';
            var returnQty = Number(params.getValue(params.id, 'actualQty'));
            if (returnQty === 0) value = chkReturnQty(value);
            if (value < 0) value = 0;
            //if (value > qty) value = qty;
            params.api.updateRows([{ ...params.row, actualQty: value }]);
          }}
          disabled={params.getValue(params.id, 'isDraft') ? false : true}
          autoComplete='off'
        />
      </div>
    ),
  },
  {
    field: 'unitFactor',
    headerName: 'จัด(ชิ้น)',
    width: 150,
    headerAlign: 'center',
    sortable: false,
    align: 'right',
    renderCell: (params: GridRenderCellParams) => calUnitFactor(params),
  },
  {
    field: 'toteCode',
    headerName: 'เลข Tote/ลัง',
    width: 150,
    headerAlign: 'center',
    sortable: false,
    renderCell: (params: GridRenderCellParams) => (
      <div>
        <TextField
          variant='outlined'
          name='txnQtyReturn'
          inputProps={{ style: { textAlign: 'right' } }}
          value={params.value}
          onChange={(e) => {
            params.api.updateRows([{ ...params.row, toteCode: e.target.value }]);
          }}
          disabled={params.getValue(params.id, 'isDraft') ? false : true}
          autoComplete='off'
        />
      </div>
    ),
  },
];
var calUnitFactor = function (params: GridValueGetterParams) {
  let diff = Number(params.getValue(params.id, 'actualQty')) * Number(params.getValue(params.id, 'baseUnit'));
  return diff;
};

function useApiRef() {
  const apiRef = useGridApiRef();
  const _columns = useMemo(
    () =>
      columns.concat({
        field: '',
        width: 0,
        sortable: false,
        renderCell: (params) => {
          apiRef.current = params.api;
          return null;
        },
      }),
    [columns]
  );

  return { apiRef, columns: _columns };
}

const chkReturnQty = (value: any) => {
  let v = String(value);
  if (v.substring(1) === '0') return Number(v.substring(0, 1));
  return value;
};
function StockPackChecked({ isOpen, onClickClose }: Props) {
  const classes = useStyles();
  const { apiRef, columns } = useApiRef();
  const dispatch = useAppDispatch();
  const branchTransferRslList = useAppSelector((state) => state.branchTransferDetailSlice.branchTransferRs);
  const reasonsList = useAppSelector((state) => state.transferReasonsList.reasonsList.data);
  const branchList = useAppSelector((state) => state.searchBranchSlice).branchList.data;
  const payloadSearch = useAppSelector((state) => state.saveSearchStock.searchStockTransfer);

  const branchTransferInfo: any = branchTransferRslList.data ? branchTransferRslList.data : null;
  const [branchTransferItems, setBranchTransferItems] = React.useState<Item[]>(
    branchTransferInfo.items ? branchTransferInfo.items : []
  );
  const [openModelConfirmTransaction, setOpenModelConfirmTransaction] = React.useState(false);
  const [confirmModelExit, setConfirmModelExit] = React.useState(false);
  const [openLoadingModal, setOpenLoadingModal] = React.useState(false);
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [contentMsg, setContentMsg] = React.useState('');
  const [snackbarIsStatus, setSnackbarIsStatus] = React.useState(false);
  const handleCloseSnackBar = () => {
    setShowSnackBar(false);
  };

  const [openAlert, setOpenAlert] = React.useState(false);
  const [textError, setTextError] = React.useState('');
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const [cols, setCols] = React.useState(columns);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [open, setOpen] = React.useState(isOpen);
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());
  const [sourceBranch, setSourceBranch] = React.useState('');
  const [destinationBranch, setDestinationBranch] = React.useState('');
  const [btNo, setBtNo] = React.useState('');
  const [btStatus, setBtStatus] = React.useState<String>('CREATED');
  const [reasons, setReasons] = React.useState('');
  const [isDraft, setIsDraft] = React.useState(false);

  const [comment, setComment] = React.useState('');
  const handleChangeComment = (value: any) => {
    storeItem();
    setComment(value);
  };

  React.useEffect(() => {
    const fromBranch = getBranchName(branchList, branchTransferInfo.branchFrom);
    setSourceBranch(fromBranch ? fromBranch : '');

    const toBranch = getBranchName(branchList, branchTransferInfo.branchTo);
    setDestinationBranch(toBranch ? toBranch : '');

    const reason = getReasonLabel(reasonsList, branchTransferInfo.transferReason);
    setReasons(reason ? reason : '');

    setBtNo(branchTransferInfo.btNo);
    setBtStatus(branchTransferInfo.status);
    setComment(branchTransferInfo.comment);

    const isBranch = isOwnBranch('D0001');
    setIsDraft(isBranch && branchTransferInfo.status === 'CREATED' ? true : false);
  }, [open]);
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

  function handleNotExitModelConfirm() {
    setConfirmModelExit(false);
  }

  function handleExitModelConfirm() {
    setConfirmModelExit(false);
    setOpen(false);
    onClickClose();
  }

  const handleOnCloseModalConfirm = () => {
    setOpenModelConfirmTransaction(false);
  };

  const mappingPayload = () => {
    let items: Item[] = [];
    const rowsEdit: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
    rowsEdit.forEach((data: GridRowData) => {
      const item: Item = {
        seqItem: data.seqItem,
        barcode: data.barcode,
        actualQty: data.actualQty,
        toteCode: data.toteCode,
      };
      items.push(item);
    });

    const payload: BranchTransferRequest = {
      comment: comment,
      items: items,
      btNo: btNo,
    };
    return payload;
  };

  let rows = branchTransferItems.map((item: Item, index: number) => {
    return {
      id: `${item.barcode}-${index + 1}`,
      index: index + 1,
      seqItem: item.seqItem,
      barcode: item.barcode,
      productName: item.productName,
      skuCode: item.skuCode,
      baseUnit: item.baseUnit ? item.baseUnit : 0,
      unitName: item.unitName,
      remainStock: item.remainStock ? item.remainStock : 0,
      qty: item.qty ? item.qty : 0,
      actualQty: item.actualQty ? item.actualQty : 0,
      toteCode: item.toteCode,
      isDraft: isDraft,
    };
  });

  const validateItem = () => {
    const rowsEdit: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
    let itemNotValid: boolean = false;
    rowsEdit.forEach((data: GridRowData) => {
      if (!data.toteCode && data.actualQty > 0) {
        itemNotValid = true;
        return;
      }
    });
    if (itemNotValid) {
      setOpenAlert(true);
      setTextError('กรุณาป้อนเลขที่ Tote/ลัง');
      return false;
    } else {
      return true;
    }
  };

  const storeItem = () => {
    const rowsEdit: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
    const items: Item[] = [];
    rowsEdit.forEach((data: GridRowData) => {
      const newData: Item = {
        seqItem: data.seqItem,
        barcode: data.barcode,
        productName: data.productName,
        skuCode: data.skuCode,
        baseUnit: data.baseUnit,
        unitName: data.unitName,
        remainStock: data.remainStock,
        qty: data.qty,
        actualQty: data.actualQty,
        toteCode: data.toteCode,
        isDraft: isDraft,
      };
      items.push(newData);
    });
    setBranchTransferItems(items);
  };

  const handleClose = async () => {
    await storeItem();
    let showPopup = false;
    // onClickClose();
    if (comment !== branchTransferInfo.comment) {
      showPopup = true;
    }
    const rowSelect = apiRef.current.getSelectedRows();
    if (rowSelect.size > 0) {
      showPopup = true;
    }
    const ent: Item[] = branchTransferInfo.items;
    const rowsEdit: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();

    let i = 0;
    rowsEdit.forEach((data: GridRowData) => {
      if (data.actualQty !== (ent[i].actualQty ? ent[i].actualQty : 0) || data.toteCode != ent[i].toteCode) {
        showPopup = true;
        return;
      }
      i++;
    });

    if (!showPopup) {
      setOpen(false);
      onClickClose();
    } else {
      setConfirmModelExit(true);
    }
  };

  const handleSaveBtn = async () => {
    const isvalidItem = validateItem();
    if (isvalidItem) {
      const payload: BranchTransferRequest = await mappingPayload();
      await saveBranchTransfer(payload)
        .then(async (value) => {
          setBtNo(value.docNo);
          setShowSnackBar(true);
          setSnackbarIsStatus(true);
          setContentMsg('คุณได้บันทึกข้อมูลเรียบร้อยแล้ว');
          await dispatch(featchBranchTransferDetailAsync(value.docNo));
          await dispatch(featchSearchStockTransferAsync(payloadSearch));
        })
        .catch((error: ApiError) => {
          setShowSnackBar(true);
          setSnackbarIsStatus(false);
          setContentMsg(error.message);
        });
    }
  };
  const handleConfirmBtn = async () => {
    await storeItem();
    const isvalidItem = validateItem();
    if (isvalidItem) {
      // setOpenLoadingModal(true);
      if (!btNo) {
        const payload: BranchTransferRequest = await mappingPayload();
        await saveBranchTransfer(payload)
          .then(async (value) => {
            // setStatus(1);
            setBtNo(value.btNo);
            setOpenModelConfirmTransaction(true);
          })
          .catch((error: ApiError) => {
            setShowSnackBar(true);
            setSnackbarIsStatus(false);
            setContentMsg(error.message);
          });
      } else {
        setOpenModelConfirmTransaction(true);
      }
    }
  };

  const sendTransactionToDC = async () => {
    const payload: BranchTransferRequest = await mappingPayload();
    await sendBranchTransferToDC(payload)
      .then(async (value) => {
        handleOnCloseModalConfirm();
        setShowSnackBar(true);
        setSnackbarIsStatus(true);
        setContentMsg('คุณส่งรายการให้ DC เรียบร้อยแล้ว');
        await dispatch(featchSearchStockTransferAsync(payloadSearch));
        setTimeout(() => {
          setOpen(false);
          onClickClose();
        }, 500);
      })
      .catch((error: ApiError) => {
        handleOnCloseModalConfirm();
        setShowSnackBar(true);
        setSnackbarIsStatus(false);
        setContentMsg(error.message);
      });
    handleOnCloseModalConfirm();
    setOpenLoadingModal(false);
  };

  const currentlySelected = () => {
    storeItem();
  };

  const onCellFocusOut = async (params: GridCellParams) => {
    storeItem();
  };

  const handleOpenAddItems = () => {
    setOpenModelAddItems(true);
  };

  const [openModelAddItems, setOpenModelAddItems] = React.useState(false);
  const handleModelAddItems = async () => {
    setOpenModelAddItems(false);
  };

  return (
    <React.Fragment>
      <Dialog open={open} maxWidth='xl' fullWidth={true}>
        <BootstrapDialogTitle id='customized-dialog-title' onClose={handleClose}>
          <Typography sx={{ fontSize: 24, fontWeight: 400 }}>ตรวจสอบรายการใบโอน</Typography>
          <Steppers status={branchTransferInfo.status} type='BT'></Steppers>
        </BootstrapDialogTitle>
        <DialogContent>
          <Box mt={4} sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} mb={2}>
              <Grid item lg={2}>
                <Typography variant='body2'>เลขที่เอกสาร BT</Typography>
              </Grid>
              <Grid item lg={3}>
                <Typography variant='body2'>{btNo}</Typography>
              </Grid>
              <Grid item lg={1}></Grid>
              <Grid item lg={2}>
                <Typography variant='body2'>เลขที่เอกสาร RT</Typography>
              </Grid>
              <Grid item lg={3}>
                <Typography variant='body2'>{branchTransferInfo.rtNo}</Typography>
              </Grid>
              <Grid item lg={1}></Grid>
            </Grid>
            <Grid container spacing={2} mb={2}>
              <Grid item lg={2}>
                <Typography variant='body2'>วันที่สร้างรายการ:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant='body2'>{convertUtcToBkkDate(branchTransferInfo.createdDate)}</Typography>
              </Grid>
              <Grid item lg={6}></Grid>
            </Grid>

            <Grid container spacing={2} mb={2}>
              <Grid item lg={2}>
                <Typography variant='body2'>วันที่โอน :</Typography>
              </Grid>
              <Grid item lg={3}>
                <Typography variant='body2'>{convertUtcToBkkDate(branchTransferInfo.startDate)}</Typography>
              </Grid>
              <Grid item lg={1}></Grid>
              <Grid item lg={2}>
                <Typography variant='body2'>วันที่สิ้นสุด :</Typography>
              </Grid>
              <Grid item lg={3}>
                <Typography variant='body2'>{convertUtcToBkkDate(branchTransferInfo.endDate)}</Typography>
              </Grid>
              <Grid item lg={1}></Grid>
            </Grid>

            <Grid container spacing={2} mb={2}>
              <Grid item lg={2}>
                <Typography variant='body2'> สาขาต้นทาง :</Typography>
              </Grid>
              <Grid item lg={3}>
                <Typography variant='body2'>{sourceBranch} </Typography>
              </Grid>
              <Grid item lg={1}></Grid>
              <Grid item lg={2}>
                <Typography variant='body2'>สาขาปลายทาง :</Typography>
              </Grid>
              <Grid item lg={3}>
                <Typography variant='body2'>{destinationBranch} </Typography>
              </Grid>
              <Grid item lg={1}></Grid>
            </Grid>

            <Grid container spacing={2} mb={2}>
              <Grid item lg={2}>
                <Typography variant='body2'> สาเหตุการโอน :</Typography>
              </Grid>
              <Grid item lg={3}>
                <Typography variant='body2'>{reasons} </Typography>
              </Grid>
              <Grid item lg={6}></Grid>
            </Grid>
          </Box>
          {isDraft && (
            <Grid
              item
              container
              xs={12}
              sx={{ mt: 3 }}
              justifyContent='space-between'
              direction='row'
              alignItems='flex-end'>
              <Grid item xl={5}>
                <Button
                  id='btnAddItem'
                  variant='contained'
                  color='info'
                  className={classes.MbtnPrint}
                  onClick={handleOpenAddItems}
                  startIcon={<ControlPoint />}
                  sx={{ width: 200 }}>
                  เพิ่มสินค้า
                </Button>
              </Grid>
              <Grid item>
                <Button
                  id='btnSave'
                  variant='contained'
                  color='warning'
                  className={classes.MbtnSave}
                  onClick={handleSaveBtn}
                  startIcon={<SaveIcon />}
                  sx={{ width: 200 }}>
                  บันทึก
                </Button>

                <Button
                  id='btnApprove'
                  variant='contained'
                  color='primary'
                  className={classes.MbtnApprove}
                  onClick={handleConfirmBtn}
                  startIcon={<CheckCircleOutline />}
                  sx={{ width: 200 }}>
                  ส่งงานให้ DC
                </Button>
              </Grid>
            </Grid>
          )}
          <Box mt={2} bgcolor='background.paper'>
            <div
              style={{ width: '100%', height: rows.length >= 8 ? '70vh' : 'auto' }}
              // style={{ width: '100%', height: 'auto' }}
              className={classes.MdataGridDetail}>
              <DataGrid
                rows={rows}
                columns={cols}
                // checkboxSelection={pnStatus === 0 ? true : false}
                disableSelectionOnClick
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[10, 20, 50, 100]}
                pagination
                disableColumnMenu
                autoHeight={rows.length >= 8 ? false : true}
                // autoHeight={true}
                scrollbarSize={10}
                rowHeight={65}
                onCellClick={currentlySelected}
                onCellFocusOut={onCellFocusOut}
              />
            </div>
          </Box>
          <Box mt={3}>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={4}>
                <TextBoxComment
                  fieldName='สาเหตุการเปลี่ยนจำนวน:'
                  defaultValue={comment}
                  maxLength={100}
                  onChangeComment={handleChangeComment}
                  isDisable={!isDraft}
                />
                {/* <Typography variant='body2'>หมายเหตุ:</Typography>
                <TextField
                  multiline
                  fullWidth
                  rows={5}
                  onChange={handleChangeComment}
                  defaultValue={comment}
                  placeholder='ความยาวไม่เกิน 255 ตัวอักษร'
                  className={classes.MtextFieldRemark}
                  inputProps={{ maxLength: maxCommentLength }}
                  sx={{ maxWidth: 350 }}
                  disabled={btStatus !== '0'}
                />

                <div
                  style={{
                    fontSize: '11px',
                    color: '#AEAEAE',
                    width: '100%',
                    maxWidth: 350,
                    textAlign: 'right',
                    // marginTop: "-1.5em",
                  }}>
                  {characterCount}/{maxCommentLength}
                </div> */}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>

      <SnackbarStatus
        open={showSnackBar}
        onClose={handleCloseSnackBar}
        isSuccess={snackbarIsStatus}
        contentMsg={contentMsg}
      />

      <ConfirmModalExit
        open={confirmModelExit}
        onClose={handleNotExitModelConfirm}
        onConfirm={handleExitModelConfirm}
      />

      <ModalConfirmTransaction
        open={openModelConfirmTransaction}
        onClose={handleOnCloseModalConfirm}
        handleConfirm={sendTransactionToDC}
        header='ยืนยันส่งรายการให้ DC'
        title='เลขที่เอกสาร BT'
        value={btNo}
      />

      <ModalAddItems open={openModelAddItems} onClose={handleModelAddItems}></ModalAddItems>
      <LoadingModal open={openLoadingModal} />
      <AlertError open={openAlert} onClose={handleCloseAlert} textError={textError} />
    </React.Fragment>
  );
}

export default StockPackChecked;
