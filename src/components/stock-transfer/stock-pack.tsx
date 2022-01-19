import React, { useMemo } from 'react';
import {
  DataGrid,
  GridColDef,
  GridEditCellValueParams,
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
import BranchListDropDown from '../commons/ui/branch-list-dropdown';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import { useStyles } from '../../styles/makeTheme';
import { numberWithCommas } from '../../utils/utils';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { PurchaseNoteDetailEntries } from '../../models/purchase-credit-note';
import SnackbarStatus from '../commons/ui/snackbar-status';
import AlertError from '../commons/ui/alert-error';
import LoadingModal from '../commons/ui/loading-modal';
import ConfirmModalExit from '../commons/ui/confirm-exit-model';
import ModalConfirmTransaction from './modal-confirm-transaction';
import { SaveStockPackRequest, StockTransferItems } from '../../models/stock-transfer-model';
import { saveStockPack, sendStockPackDC } from '../../services/stock-transfer';
import moment from 'moment';
import { ApiError } from '../../models/api-error-model';
import TextBoxComment from '../commons/ui/textbox-comment';
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
    field: 'stockQty',
    headerName: 'สต๊อกสินค้าคงเหลือ',
    width: 150,
    headerAlign: 'center',
    align: 'right',
    sortable: false,
    renderCell: (params) => numberWithCommas(params.value),
  },
  {
    field: 'approveQty',
    headerName: 'จำนวนที่อนุมัติ',
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
              params.getValue(params.id, 'approveQty') &&
              params.getValue(params.id, 'approveQty') !== null &&
              params.getValue(params.id, 'approveQty') != undefined
                ? params.getValue(params.id, 'approveQty')
                : 0;
            var value = e.target.value ? parseInt(e.target.value, 10) : '0';
            var returnQty = Number(params.getValue(params.id, 'actualQty'));
            if (returnQty === 0) value = chkReturnQty(value);
            if (value < 0) value = 0;
            if (value > qty) value = qty;
            params.api.updateRows([{ ...params.row, actualQty: value }]);
          }}
          disabled={params.getValue(params.id, 'isDraftStatus') ? true : false}
          autoComplete='off'
        />
      </div>
    ),
  },
  {
    field: 'unitFactor',
    headerName: 'หน่วยย่อย',
    width: 150,
    headerAlign: 'center',
    sortable: false,
    align: 'right',
    renderCell: (params: GridRenderCellParams) => calUnitFactor(params),
  },
  {
    field: 'tote',
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
            params.api.updateRows([{ ...params.row, tote: e.target.value }]);
          }}
          disabled={params.getValue(params.id, 'isDraftStatus') ? true : false}
          autoComplete='off'
        />
      </div>
    ),
  },
];
var calUnitFactor = function (params: GridValueGetterParams) {
  let diff = Number(params.getValue(params.id, 'actualQty')) * Number(2);
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
  const purchaseDetailList = useAppSelector((state) => state.SupplierOrderReturn.purchaseDetail);
  const payloadSearch = useAppSelector((state) => state.saveSearchOrderSup.searchCriteria);

  const purchaseDetail: any = purchaseDetailList.data ? purchaseDetailList.data : null;
  const [purchaseDetailItems, setPurchaseDetailItems] = React.useState<PurchaseNoteDetailEntries[]>(
    purchaseDetail.entries ? purchaseDetail.entries : []
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
  const [btStatus, setBtStatus] = React.useState<String>('');
  const [reasons, setReasons] = React.useState('');
  const [isDraft, setIsDraft] = React.useState(false);

  const [comment, setComment] = React.useState('');
  const handleChangeComment = (value: any) => {
    storeItem();
    setComment(value);
  };

  React.useEffect(() => {
    setSourceBranch('1123-ท่าช่าง');
    setDestinationBranch('1124-พรหมบุรี');
    setBtNo('');
    setReasons('ทั้งหมด');
    setBtStatus('0');
    setComment('Test Comment');
    setIsDraft(false);
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
    let items: StockTransferItems[] = [];
    const rowsEdit: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
    rowsEdit.forEach((data: GridRowData) => {
      const item: StockTransferItems = {
        barcode: data.barcode,
        orderQty: data.actualQty,
      };
      items.push(item);
    });

    const payload: SaveStockPackRequest = {
      comment: comment,
      items: items,
      btNo: btNo,
      sdNo: '',
      startDate: moment(startDate).startOf('day').toISOString(),
      endDate: moment(endDate).startOf('day').toISOString(),
    };
    return payload;
  };

  const currentlySelected = () => {};

  let rows = purchaseDetailItems
    // .filter((item: PurchaseDetailEntries) => item.pnDisplay === 1)
    .map((item: PurchaseNoteDetailEntries, index: number) => {
      return {
        id: `${item.barcode}-${index + 1}`,
        index: index + 1,
        seqItem: item.seqItem,
        barcode: item.barcode,
        productName: item.productName,
        skuCode: item.skuCode,
        stockQty: item.qty,
        approveQty: item.actualQty,
        unitName: item.unitName,
        unitCode: item.unitCode,
        actualQty: item.returnQty ? item.returnQty : 0,
        unitFactor: '',
        tote: '',
        produtStatus: item.produtStatus,
        isDraftStatus: isDraft,
        qtyAll: item.qtyAll,
        actualQtyAll: item.actualQtyAll,
      };
    });

  const validateItem = () => {
    const rowsEdit: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
    let itemNotValid: boolean = false;
    rowsEdit.forEach((data: GridRowData) => {
      if (!data.tote) {
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
    // const rowsEdit: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
    // const items: PurchaseNoteDetailEntries[] = [];
    // rowsEdit.forEach((data: GridRowData) => {
    //   const newData: PurchaseNoteDetailEntries = {
    //     seqItem: data.seqItem,
    //     produtStatus: data.produtStatus,
    //     isDraftStatus: btStatus === '0' ? false : true,
    //     skuCode: data.skuCode,
    //     barcode: data.barcode,
    //     productName: data.productName,
    //     qty: data.qty,
    //     qtyAll: data.qtyAll,
    //     actualQty: data.actualQty,
    //     returnQty: data.returnQty,
    //     actualQtyAll: data.actualQtyAll,
    //     unitName: data.unitName,
    //     unitCode: data.unitCode,
    //   };
    //   items.push(newData);
    // });
    // setPurchaseDetailItems(items);
  };

  const handleClose = async () => {
    await storeItem();
    let showPopup = false;
    // onClickClose();
    if (comment !== purchaseDetail.comment) {
      showPopup = true;
    }
    const rowSelect = apiRef.current.getSelectedRows();
    if (rowSelect.size > 0) {
      showPopup = true;
    }
    const ent: PurchaseNoteDetailEntries[] = purchaseDetail.entries;
    const rowsEdit: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
    if (rowsEdit.size !== ent.length) {
      showPopup = true;
    }

    let i = 0;
    rowsEdit.forEach((data: GridRowData) => {
      if (data.returnQty !== (ent[i].returnQty ? ent[i].returnQty : 0)) {
        showPopup = true;
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
      const payload: SaveStockPackRequest = await mappingPayload();
      await saveStockPack(payload)
        .then((value) => {
          // setStatus(1);
          setBtNo(value.btNo);
          setShowSnackBar(true);
          setSnackbarIsStatus(true);
          setContentMsg('คุณได้บันทึกข้อมูลเรียบร้อยแล้ว');
        })
        .catch((error: ApiError) => {
          setShowSnackBar(true);
          setContentMsg(error.message);
        });
    }
  };
  const handleConfirmBtn = async () => {
    const isvalidItem = validateItem();
    if (isvalidItem) {
      // setOpenLoadingModal(true);
      if (!btNo) {
        const payload: SaveStockPackRequest = await mappingPayload();
        await saveStockPack(payload)
          .then((value) => {
            // setStatus(1);
            setBtNo(value.docNo);
            setOpenModelConfirmTransaction(true);
          })
          .catch((error: ApiError) => {
            setShowSnackBar(true);
            setContentMsg(error.message);
          });
      } else {
        setOpenModelConfirmTransaction(true);
      }
    }
  };

  const sendTransactionToDC = async () => {
    const payload: SaveStockPackRequest = await mappingPayload();
    await sendStockPackDC(payload)
      .then((value) => {
        handleOnCloseModalConfirm();
        setShowSnackBar(true);
        setSnackbarIsStatus(true);
        setContentMsg('คุณส่งรายการให้ DC เรียบร้อยแล้ว');
        // dispatch(featchOrderListSupAsync(payloadSearch));
        setTimeout(() => {
          setOpen(false);
          onClickClose();
        }, 500);
      })
      .catch((error: ApiError) => {
        handleOnCloseModalConfirm();
        setShowSnackBar(true);
        setContentMsg(error.message);
      });
    handleOnCloseModalConfirm();
    setOpenLoadingModal(false);
  };

  return (
    <React.Fragment>
      <Dialog open={open} maxWidth='xl' fullWidth={true}>
        <BootstrapDialogTitle id='customized-dialog-title' onClose={handleClose}>
          <Typography sx={{ fontSize: 24, fontWeight: 400 }}>ตรวจสอบรายการใบโอน</Typography>
        </BootstrapDialogTitle>
        <DialogContent>
          <Box mt={4} sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={2}>
                <Typography variant='body2'>เลขที่เอกสาร BT</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant='body2'>{btNo}</Typography>
              </Grid>
              <Grid item lg={6}></Grid>
            </Grid>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={2}>
                <Typography variant='body2'>วันที่สร้างรายการ:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant='body2'>{'create date'}</Typography>
              </Grid>
              <Grid item lg={6}></Grid>
            </Grid>

            <Grid container spacing={2} mb={2}>
              <Grid item lg={2}>
                <Typography variant='body2'>วันที่โอนสินค้า* :</Typography>
              </Grid>
              <Grid item lg={3}>
                <DatePickerComponent onClickDate={handleStartDatePicker} value={startDate} />
              </Grid>
              <Grid item lg={1}></Grid>
              <Grid item lg={2}>
                <Typography variant='body2'>วันที่สิ้นสุด* :</Typography>
              </Grid>
              <Grid item lg={3}>
                <DatePickerComponent
                  onClickDate={handleEndDatePicker}
                  value={endDate}
                  type={'TO'}
                  minDateTo={startDate}
                />
              </Grid>
              <Grid item lg={1}></Grid>
            </Grid>

            <Grid container spacing={2} mb={2}>
              <Grid item lg={2}>
                <Typography variant='body2'> สาขาต้นทาง* :</Typography>
              </Grid>
              <Grid item lg={3}>
                <TextField value={sourceBranch} disabled fullWidth></TextField>
              </Grid>
              <Grid item lg={1}></Grid>
              <Grid item lg={2}>
                <Typography variant='body2'>สาขาปลายทาง* :</Typography>
              </Grid>
              <Grid item lg={3}>
                <TextField value={destinationBranch} disabled fullWidth></TextField>
              </Grid>
              <Grid item lg={1}></Grid>
            </Grid>

            <Grid container spacing={2} mb={2}>
              <Grid item lg={2}>
                <Typography variant='body2'> สาเหตุการโอน :</Typography>
              </Grid>
              <Grid item lg={3}>
                <TextField value={reasons} disabled fullWidth></TextField>
              </Grid>
              <Grid item lg={6}></Grid>
            </Grid>
          </Box>
          <Grid
            item
            container
            xs={12}
            sx={{ mt: 3 }}
            justifyContent='space-between'
            direction='row'
            alignItems='flex-end'>
            <Grid item xl={2}></Grid>
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
                onCellFocusOut={currentlySelected}
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
                  isDisable={isDraft}
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

      <LoadingModal open={openLoadingModal} />
      <AlertError open={openAlert} onClose={handleCloseAlert} textError={textError} />
    </React.Fragment>
  );
}

export default StockPackChecked;
