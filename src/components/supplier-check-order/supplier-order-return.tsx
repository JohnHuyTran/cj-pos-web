import React, { useMemo } from 'react';
import { Button, Checkbox, DialogActions, DialogContent, DialogContentText, Grid, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import Box from '@mui/system/Box';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { BootstrapDialogTitle } from '../commons/ui/dialog-title';
import Steppers from '../commons/ui/steppers';

import { useStyles } from '../../styles/makeTheme';
import {
  DataGrid,
  GridColDef,
  GridColumnHeaderParams,
  GridRenderCellParams,
  GridRowData,
  GridRowId,
  useGridApiRef,
} from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { PurchaseDetailEntries, PurchaseDetailInfo } from '../../models/supplier-check-order-model';
import AlertError from '../commons/ui/alert-error';
import { ErrorOutline } from '@mui/icons-material';
import SnackbarStatus from '../commons/ui/snackbar-status';
import ConfirmModalExit from '../commons/ui/confirm-exit-model';
import LoadingModal from '../commons/ui/loading-modal';
import { approvePurchaseCreditNote, draftPurchaseCreditNote } from '../../services/purchase';
import { ItemsType, PurchaseCreditNoteType } from '../../models/purchase-credit-note';
import { ApiError } from '../../models/api-error-model';
import { featchSupplierOrderDetailAsync } from '../../store/slices/supplier-order-detail-slice';
import ModalConfirmOrderReturn from './modal-confirm-order-return';
import { featchOrderListSupAsync } from '../../store/slices/supplier-check-order-slice';
interface Props {
  isOpen: boolean;
  onClickClose: () => void;
}

const columns: GridColDef[] = [
  {
    field: 'index',
    headerName: 'ลำดับ',
    flex: 0.5,
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
    width: 200,
    flex: 0.7,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'productName',
    headerName: 'รายละเอียดสินค้า',
    headerAlign: 'center',
    minWidth: 220,
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
    field: 'qty',
    headerName: 'จำนวนที่รับ',
    width: 110,
    headerAlign: 'center',
    align: 'right',
    sortable: false,
  },
  {
    field: 'returnQty',
    headerName: 'จำนวนที่คืน',
    width: 110,
    headerAlign: 'center',
    sortable: false,
    renderCell: (params: GridRenderCellParams) => (
      <div>
        <TextField
          variant='outlined'
          name='txnQtyReturn'
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
            // if (value > qty) value = qty;
            params.api.updateRows([{ ...params.row, returnQty: value }]);
          }}
          disabled={params.getValue(params.id, 'isDraftStatus') ? true : false}
          autoComplete='off'
        />
      </div>
    ),
  },
  {
    field: 'unitName',
    headerName: 'หน่วย',
    width: 90,
    headerAlign: 'center',
    sortable: false,
  },
];
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

function SupplierOrderReturn({ isOpen, onClickClose }: Props) {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const purchaseDetailList = useAppSelector((state) => state.supplierOrderDetail.purchaseDetail);
  const payloadSearch = useAppSelector((state) => state.saveSearchOrderSup.searchCriteria);

  const purchaseDetail: any = purchaseDetailList.data ? purchaseDetailList.data : null;
  const [purchaseDetailItems, setPurchaseDetailItems] = React.useState<PurchaseDetailEntries[]>(
    purchaseDetail.entries ? purchaseDetail.entries : []
  );

  const { apiRef, columns } = useApiRef();

  const [openAlert, setOpenAlert] = React.useState(false);
  const [textError, setTextError] = React.useState('');
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [contentMsg, setContentMsg] = React.useState('');
  const [snackbarIsStatus, setSnackbarIsStatus] = React.useState(false);
  const [openModelConfirm, setOpenModelConfirm] = React.useState(false);

  const [confirmModelExit, setConfirmModelExit] = React.useState(false);

  const [openLoadingModal, setOpenLoadingModal] = React.useState(false);

  const [pageSize, setPageSize] = React.useState<number>(10);
  const [open, setOpen] = React.useState(isOpen);
  const [pnStatus, setPnStatus] = React.useState(0);
  const [comment, setComment] = React.useState('');
  const [characterCount, setCharacterCount] = React.useState(0);
  const maxCommentLength = 255;
  const handleChangeComment = (event: any) => {
    const value = event.target.value;
    const length = event.target.value.length;
    if (length <= maxCommentLength) {
      setCharacterCount(event.target.value.length);
      setComment(value);
    }
  };
  const [cols, setCols] = React.useState(columns);

  React.useEffect(() => {
    setComment(purchaseDetail.pnComment);
    setPnStatus(purchaseDetail.pnState !== 2 ? 0 : 1);
    let newColumns = [...cols];
    if (purchaseDetail.pnState == 2) {
      newColumns[0]['hide'] = false;
    } else {
      newColumns[0]['hide'] = true;
    }
    setCols(newColumns);
  }, [open]);

  let rows = purchaseDetailItems
    // .filter((item: PurchaseDetailEntries) => item.pnDisplay === 1)
    .map((item: PurchaseDetailEntries, index: number) => {
      return {
        id: `${item.barcode}-${index + 1}`,
        index: index + 1,
        seqItem: item.seqItem,
        produtStatus: item.produtStatus,
        isDraftStatus: pnStatus === 0 ? false : true,
        isControlStock: item.isControlStock,
        isAllowDiscount: item.isAllowDiscount,
        skuCode: item.skuCode,
        barcode: item.barcode,
        productName: item.productName,
        unitCode: item.unitCode,
        unitName: item.unitName,
        qty: item.qty,
        qtyAll: item.qtyAll,
        controlPrice: item.controlPrice,
        salePrice: item.salePrice,
        setPrice: item.setPrice,
        sumPrice: item.sumPrice,
        actualQty: item.actualQty,
        returnQty: item.returnQty ? item.returnQty : 0,
        actualQtyAll: item.actualQtyAll,
      };
    });

  const handleClose = async () => {
    await storeItem();
    let isExit = true;
    // onClickClose();
    if (comment !== purchaseDetail.pnComment) {
      isExit = false;
    }
    const rowSelect = apiRef.current.getSelectedRows();
    if (rowSelect.size > 0) {
      isExit = false;
    }
    const ent: PurchaseDetailEntries[] = purchaseDetail.entries;
    const rowsEdit: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
    if (rowsEdit.size !== ent.length) {
      isExit = false;
    }

    let i = 0;
    rowsEdit.forEach((data: GridRowData) => {
      if (data.returnQty !== (ent[i].returnQty ? ent[i].returnQty : 0)) {
        isExit = false;
      }
      i++;
    });

    if (!isExit) {
      setConfirmModelExit(true);
    } else {
      setOpen(false);
      onClickClose();
    }
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const storeItem_ = () => {
    const rowsEdit: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
    let itemNotValid: boolean = false;
    rowsEdit.forEach((data: GridRowData) => {
      if (data.returnQty > data.qty || data.returnQty <= 0) {
        itemNotValid = true;
        return;
      }
    });

    const items: PurchaseDetailEntries[] = [];
    rowsEdit.forEach((data: GridRowData) => {
      const newData: PurchaseDetailEntries = {
        seqItem: data.seqItem,
        produtStatus: data.produtStatus,
        isDraftStatus: pnStatus === 0 ? false : true,
        isControlStock: data.isControlStock,
        isAllowDiscount: data.isAllowDiscount,
        skuCode: data.skuCode,
        barcode: data.barcode,
        productName: data.productName,
        unitCode: data.unitCode,
        unitName: data.unitName,
        qty: data.qty,
        qtyAll: data.qtyAll,
        controlPrice: data.controlPrice,
        salePrice: data.salePrice,
        setPrice: data.setPrice,
        sumPrice: data.sumPrice,
        actualQty: data.actualQty,
        returnQty: data.returnQty,
        actualQtyAll: data.actualQtyAll,
      };
      items.push(newData);
    });
    setPurchaseDetailItems(items);
    if (itemNotValid) {
      setOpenAlert(true);
      setTextError('จำนวนที่คืนต้องมากกว่า 0 หรือ น้อยกว่า จำนวนที่รับ');
      return false;
    } else {
      return true;
    }
  };

  const validateItem = () => {
    const rowsEdit: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
    let itemNotValid: boolean = false;
    rowsEdit.forEach((data: GridRowData) => {
      if (data.returnQty > data.qty || data.returnQty <= 0) {
        itemNotValid = true;
        return;
      }
    });
    if (itemNotValid) {
      setOpenAlert(true);
      setTextError('จำนวนที่คืนต้องมากกว่า 0 หรือ น้อยกว่า จำนวนที่รับ');
      return false;
    } else {
      return true;
    }
  };

  const storeItem = () => {
    const rowsEdit: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
    const items: PurchaseDetailEntries[] = [];
    rowsEdit.forEach((data: GridRowData) => {
      const newData: PurchaseDetailEntries = {
        seqItem: data.seqItem,
        produtStatus: data.produtStatus,
        isDraftStatus: pnStatus === 0 ? false : true,
        isControlStock: data.isControlStock,
        isAllowDiscount: data.isAllowDiscount,
        skuCode: data.skuCode,
        barcode: data.barcode,
        productName: data.productName,
        unitCode: data.unitCode,
        unitName: data.unitName,
        qty: data.qty,
        qtyAll: data.qtyAll,
        controlPrice: data.controlPrice,
        salePrice: data.salePrice,
        setPrice: data.setPrice,
        sumPrice: data.sumPrice,
        actualQty: data.actualQty,
        returnQty: data.returnQty,
        actualQtyAll: data.actualQtyAll,
      };
      items.push(newData);
    });
    setPurchaseDetailItems(items);
  };

  const handleSaveBtn = async () => {
    await storeItem();
    const rs = validateItem();
    // call api
    if (rs) {
      setOpenLoadingModal(true);
      let items: ItemsType[] = [];
      const rowsEdit: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
      rowsEdit.forEach((data: GridRowData) => {
        const item: ItemsType = {
          barcode: data.barcode,
          returnQry: data.returnQty ? data.returnQty : 0,
        };
        items.push(item);
      });

      const payload: PurchaseCreditNoteType = {
        pnNo: purchaseDetail.pnNo,
        items: items,
      };
      await draftPurchaseCreditNote(payload)
        .then((_value) => {
          setShowSnackBar(true);
          setSnackbarIsStatus(true);
          setContentMsg('คุณได้บันทึกข้อมูลเรียบร้อยแล้ว');
          dispatch(featchSupplierOrderDetailAsync(purchaseDetail.pnNo));
          dispatch(featchOrderListSupAsync(payloadSearch));

          // localStorage.removeItem('SupplierRowsEdit');
        })
        .catch((error: ApiError) => {
          setShowSnackBar(true);
          setContentMsg(error.message);
        });
      setOpenLoadingModal(false);
    }
  };

  const handleDeleteBtn = () => {
    const rowsEdit: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
    const rowSelect = apiRef.current.getSelectedRows();
    if (rowSelect.size === rowsEdit.size) {
      setOpenAlert(true);
      setTextError('ไม่สามารถลบรายการทั้งหมดได้');
      return;
    }
    rowSelect.forEach((data: GridRowData, key) => {
      rowsEdit.delete(key);
    });

    const items: PurchaseDetailEntries[] = [];
    rowsEdit.forEach((data: GridRowData) => {
      const newData: PurchaseDetailEntries = {
        seqItem: data.seqItem,
        produtStatus: data.produtStatus,
        isDraftStatus: pnStatus === 0 ? false : true,
        isControlStock: data.isControlStock,
        isAllowDiscount: data.isAllowDiscount,
        skuCode: data.skuCode,
        barcode: data.barcode,
        productName: data.productName,
        unitCode: data.unitCode,
        unitName: data.unitName,
        qty: data.qty,
        qtyAll: data.qtyAll,
        controlPrice: data.controlPrice,
        salePrice: data.salePrice,
        setPrice: data.setPrice,
        sumPrice: data.sumPrice,
        actualQty: data.actualQty,
        returnQty: data.returnQty,
        actualQtyAll: data.actualQtyAll,
      };
      items.push(newData);
    });
    setPurchaseDetailItems([]);
    setPurchaseDetailItems(items);
    // if (countIsDelete === rowsEdit.size) {
    //   setOpenAlert(true);
    //   setTextError('ไม่สามารถลบรายการทั้งหมดได้');
    //   setPurchaseDetailItems([]);
    //   setPurchaseDetailItems(itemsDelete);
    // } else {
    //   setPurchaseDetailItems([]);
    //   setPurchaseDetailItems(itemsNoDelete);
    // }
  };
  const handleCloseSnackBar = () => {
    setShowSnackBar(false);
  };

  function handleNotExitModelConfirm() {
    setConfirmModelExit(false);
  }

  function handleExitModelConfirm() {
    setConfirmModelExit(false);
    setOpen(false);
    onClickClose();
  }
  const handleOnCloseModalConfirm = () => {
    setOpenModelConfirm(false);
  };

  const handleConfirmBtn = async () => {
    await storeItem();
    const rs = validateItem();
    if (rs) {
      setOpenModelConfirm(true);
    }
  };

  const approvePN = async () => {
    setOpenLoadingModal(true);
    let items: ItemsType[] = [];
    purchaseDetailItems.forEach((data: PurchaseDetailEntries) => {
      const item: ItemsType = {
        barcode: data.barcode,
        returnQry: data.returnQty ? data.returnQty : 0,
      };
      items.push(item);
    });

    const payload: PurchaseCreditNoteType = {
      pnNo: purchaseDetail.pnNo,
      items: items,
    };
    await approvePurchaseCreditNote(payload, fileInfo)
      .then((_value) => {
        handleOnCloseModalConfirm();
        setShowSnackBar(true);
        setSnackbarIsStatus(true);
        setContentMsg('คุณได้อนุมัติข้อมูล เรียบร้อยแล้ว');
        dispatch(featchOrderListSupAsync(payloadSearch));
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
    // setOpen(false);
    // onClickClose();
    // handleOnCloseModalConfirm();
    setOpenLoadingModal(false);
  };

  const [fileInfo, setFileInfo] = React.useState<any>([]);
  const handleFileInputChange = (e: any) => {
    // setValidationFile(false);
    // setErrorBrowseFile(false);
    // setMsgErrorBrowseFile('');
    checkSizeFile(e);

    let file: File = e.target.files[0];
    console.log('filelist: ', e.target.files);
    console.log('file: ', file);
    let fileType = file.type.split('/');
    const fileName = `test-01.${fileType[1]}`;

    setFileInfo([...fileInfo, file]);
  };

  const checkSizeFile = (e: any) => {
    const fileSize = e.target.files[0].size;
    const fileName = e.target.files[0].name;
    let parts = fileName.split('.');
    let length = parts.length - 1;
    // pdf, .jpg, .jpeg
    if (
      parts[length].toLowerCase() !== 'pdf' &&
      parts[length].toLowerCase() !== 'jpg' &&
      parts[length].toLowerCase() !== 'jpeg'
    ) {
      // setValidationFile(true);
      // setErrorBrowseFile(true);
      // setMsgErrorBrowseFile('กรุณาแนบไฟล์.pdf หรือ .jpg เท่านั้น');
      return;
    }

    // 1024 = bytes
    // 1024*1024*1024 = mb
    let mb = 1024 * 1024 * 1024;
    // fileSize = mb unit
    if (fileSize < mb) {
      //size > 5MB
      let size = fileSize / 1024 / 1024;
      if (size > 5) {
        // setValidationFile(true);
        // setErrorBrowseFile(true);
        // setMsgErrorBrowseFile('ขนาดไฟล์เกิน 5MB กรุณาเลือกไฟล์ใหม่');
        return;
      }
    }
  };

  return (
    <div>
      {' '}
      <Dialog open={open} maxWidth='xl' fullWidth={true}>
        <BootstrapDialogTitle id='customized-dialog-title' onClose={handleClose}>
          <Typography sx={{ fontSize: '1em' }}>ใบคืนสินค้า</Typography>
          <Steppers status={pnStatus}></Steppers>
        </BootstrapDialogTitle>
        <DialogContent>
          <Box mt={4} sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={2}>
                <Typography variant='body2'>เลขที่เอกสาร PN</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant='body2'>
                  {' '}
                  <TextField
                    id='txtDocPN'
                    name='paramQuery'
                    size='small'
                    value={purchaseDetail.pnNo}
                    className={classes.MtextFieldNumber}
                    disabled
                    sx={{ background: '#EAEBEB' }}
                  />
                </Typography>
              </Grid>
              <Grid item lg={2}>
                <Typography variant='body2'>ผู้จำหน่าย</Typography>
              </Grid>
              <Grid item lg={4}>
                <div
                  style={{
                    border: '1px solid #CBD4DB',
                    borderRadius: 5,
                    maxWidth: 250,
                    background: '#EAEBEB',
                    padding: 2,
                  }}>
                  <Typography variant='body2' sx={{ color: '#263238' }}>
                    {purchaseDetail.supplierName}
                  </Typography>
                  <Typography variant='body2' sx={{ color: '#AEAEAE', fontSize: 12 }}>
                    {purchaseDetail.supplierTaxNo}
                  </Typography>
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={2}>
                <Typography variant='body2'>เลขที่เอกสาร PI :</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant='body2'>{purchaseDetail.piNo}</Typography>
              </Grid>
              <Grid item lg={2}>
                <Typography variant='body2'>แนบเอกสารจากผู้จำหน่าย :</Typography>
              </Grid>
              <Grid item lg={4}>
                <TextField
                  name='browserTxf'
                  className={classes.MtextFieldBrowse}
                  value={fileInfo.fileName}
                  placeholder='แนบไฟล์ .pdf หรือ .jpg ขนาดไฟล์ไม่เกิน 5 MB'
                />
                <input
                  id='btnBrowse'
                  type='file'
                  multiple
                  // onDrop
                  accept='.pdf, .jpg, .jpeg'
                  onChange={handleFileInputChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor={'btnBrowse'}>
                  <Button
                    id='btnPrint'
                    color='primary'
                    variant='contained'
                    component='span'
                    className={classes.MbtnBrowse}
                    style={{ marginLeft: 10, textTransform: 'none' }}>
                    Browse
                  </Button>
                </label>
              </Grid>
            </Grid>
          </Box>
          {pnStatus === 0 && (
            <Grid
              item
              container
              xs={12}
              sx={{ mt: 3 }}
              justifyContent='space-between'
              direction='row'
              alignItems='flex-end'>
              <Grid item xl={2}>
                <Button
                  id='btnSave'
                  variant='contained'
                  color='secondary'
                  className={classes.MbtnSave}
                  onClick={handleDeleteBtn}
                  startIcon={<DeleteIcon />}
                  sx={{ width: 200 }}>
                  ลบรายการ
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
                  ยืนยัน
                </Button>
              </Grid>
            </Grid>
          )}
          <Box mt={2} bgcolor='background.paper'>
            <div
              style={{ width: '100%', height: rows.length >= 8 ? '70vh' : 'auto' }}
              className={classes.MdataGridDetail}>
              <DataGrid
                rows={rows}
                columns={cols}
                checkboxSelection={pnStatus === 0 ? true : false}
                disableSelectionOnClick
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[10, 20, 50, 100]}
                pagination
                disableColumnMenu
                autoHeight={rows.length >= 8 ? false : true}
                scrollbarSize={10}
                rowHeight={65}
              />
            </div>
          </Box>
          <Box mt={3}>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={4}>
                <Typography variant='body2'>หมายเหตุ:</Typography>
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
                  disabled={pnStatus !== 0}
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
                </div>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
      <AlertError open={openAlert} onClose={handleCloseAlert} textError={textError} />
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
      <ModalConfirmOrderReturn
        open={openModelConfirm}
        onClose={handleOnCloseModalConfirm}
        handleConfirm={approvePN}
        header='ยืนยันอนุมัติใบรับสินค้า'
        title='เลขที่เอกสาร PN'
        value={purchaseDetail.pnNo}
      />
      <LoadingModal open={openLoadingModal} />
    </div>
  );
}

export default SupplierOrderReturn;
