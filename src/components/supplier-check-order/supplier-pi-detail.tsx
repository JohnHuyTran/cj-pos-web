import React, { ReactElement, useEffect, useMemo } from 'react';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { Button, DialogTitle, Grid, IconButton, TextField } from '@mui/material';
import { CheckCircleOutline, ControlPoint, DeleteForever, HighlightOff, PlusOne } from '@mui/icons-material';
import { Box } from '@mui/system';
import Steppers from '../commons/ui/steppers';
import SaveIcon from '@mui/icons-material/Save';
import { useStyles } from '../../styles/makeTheme';
import { DataGrid, GridColDef, GridRenderCellParams, useGridApiRef, GridRowId, GridRowData } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { PurchaseDetailEntries, SavePurchaseRequest } from '../../models/supplier-check-order-model';
import LoadingModal from '../commons/ui/loading-modal';
import { ApiError } from '../../models/api-error-model';
import { saveSupplierOrder } from '../../services/purchase';
import { featchSupplierOrderDetailAsync } from '../../store/slices/supplier-order-detail-slice';
import { featchOrderListSupAsync } from '../../store/slices/supplier-check-order-slice';
import SnackbarStatus from '../commons/ui/snackbar-status';
import ConfirmModelExit from '../commons/ui/confirm-exit-model';
import ModelConfirm from './modal-confirm';
import ModelDeleteConfirm from './modal-delete-confirm';

interface Props {
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

const columns: GridColDef[] = [
  {
    field: 'index',
    headerName: 'ลำดับ',
    width: 65,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'barCode',
    headerName: 'บาร์โค้ด',
    minWidth: 200,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'productName',
    headerName: 'สินค้า',
    headerAlign: 'center',
    // minWidth: 250,
    flex: 2,
    sortable: false,
    renderCell: (params) => (
      <div>
        <Typography variant="body2">{params.value}</Typography>
        <Typography color="textSecondary" sx={{ fontSize: 12 }}>
          {params.getValue(params.id, 'skuCode') || ''}
        </Typography>
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
  {
    field: 'qty',
    headerName: 'จำนวนที่สั่ง',
    width: 110,
    headerAlign: 'center',
    align: 'right',
    sortable: false,
  },
  {
    field: 'actualQty',
    headerName: 'จำนวนที่รับ',
    width: 110,
    headerAlign: 'center',
    sortable: false,
    renderCell: (params: GridRenderCellParams) => (
      <TextField
        variant="outlined"
        name="txnQuantityActual"
        type="number"
        inputProps={{ style: { textAlign: 'right' } }}
        value={params.value}
        onChange={(e) => {
          var value = e.target.value ? parseInt(e.target.value, 10) : '';
          if (value < 0) value = 0;
          params.api.updateRows([{ ...params.row, actualQty: value }]);
        }}
        disabled={isDisable(params) ? true : false}
        autoComplete="off"
      />
    ),
  },
  {
    field: 'setPrice',
    headerName: 'ราคาต่อหน่วย',
    width: 135,
    headerAlign: 'center',
    align: 'right',
    sortable: false,
  },
  // {
  //   field: 'salePrice',
  //   headerName: 'ลด/ชาร์จ',
  //   width: 135,
  //   headerAlign: 'center',
  //   align: 'right',
  //   sortable: false,
  // },
  {
    field: 'sumPrice',
    headerName: 'รวม',
    width: 120,
    headerAlign: 'center',
    align: 'right',
    sortable: false,
  },
  // {
  //   field: 'action',
  //   headerName: ' ',
  //   width: 60,
  //   headerAlign: 'center',
  //   align: 'center',
  //   sortable: false,
  //   renderCell: (params) => (
  //     // params.piStatus !== 1
  //     <DeleteForever fontSize="small" sx={{ color: '#F54949' }} />
  //     //onClick={handlDeleteConfirmButton}
  //   ),
  // },
];

const isDisable = (params: GridRenderCellParams) => {
  return params.row.isDraftStatus;
};

function useApiRef() {
  const apiRef = useGridApiRef();
  const _columns = useMemo(
    () =>
      columns.concat({
        field: '__HIDDEN__',
        width: 0,
        renderCell: (params) => {
          apiRef.current = params.api;
          return null;
        },
      }),
    [columns]
  );

  return { apiRef, columns: _columns };
}

function SupplierOrderDetail({ isOpen, onClickClose }: Props): ReactElement {
  const [open, setOpen] = React.useState(isOpen);
  const [confirmModelExit, setConfirmModelExit] = React.useState(false);

  const handleClose = () => {
    let exit = false;
    if (comment !== purchaseDetail.comment || billNo !== purchaseDetail.billNo) {
      exit = true;
    }
    const rowsEdit: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
    let i = 0;
    const itemsList: any = [];
    rowsEdit.forEach((data: GridRowData) => {
      if (data.actualQty !== rows[i].actualQty) {
        exit = true;
      }
      i++;

      itemsList.push(data);
    });

    if (!exit) {
      localStorage.removeItem('SupplierRowsEdit');
      setOpen(false);
      onClickClose();
    } else if (exit) {
      if (itemsList !== []) {
        localStorage.setItem('SupplierRowsEdit', JSON.stringify(itemsList));
      }
      setConfirmModelExit(true);
    }
  };

  function handleNotExitModelConfirm() {
    setConfirmModelExit(false);
  }

  function handleExitModelConfirm() {
    localStorage.removeItem('SupplierRowsEdit');
    setConfirmModelExit(false);
    setOpen(false);
    onClickClose();
  }

  useEffect(() => {
    setOpen(isOpen);
    setBillNo(purchaseDetail.billNo);
    setPiNo(purchaseDetail.piNo);
    setPiType(purchaseDetail.piType);
    setPiStatus(purchaseDetail.piStatus);
    setComment(purchaseDetail.comment);
    setCharacterCount(purchaseDetail.comment.length);
  }, [open]);

  const purchasePIDetailList = useAppSelector((state) => state.supplierOrderPIDetail.purchasePIDetail);
  const purchaseDetail: any = purchasePIDetailList.data ? purchasePIDetailList.data : null;
  const purchaseDetailItems = purchaseDetail.entries ? purchaseDetail.entries : [];

  const [billNo, setBillNo] = React.useState('');
  const [errorBillNo, setErrorBillNo] = React.useState(false);
  const [piNo, setPiNo] = React.useState('');
  const [piType, setPiType] = React.useState(0);
  const [piStatus, setPiStatus] = React.useState(0);
  const [comment, setComment] = React.useState('');

  let rows = purchaseDetailItems.map((item: PurchaseDetailEntries, index: number) => {
    return {
      id: `${item.barcode}-${index + 1}`,
      index: index + 1,
      seqItem: item.seqItem,
      produtStatus: item.produtStatus,
      isDraftStatus: piStatus === 0 ? false : true,
      isControlStock: item.isControlStock,
      isAllowDiscount: item.isAllowDiscount,
      skuCode: item.skuCode,
      barCode: item.barcode,
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
      actualQtyAll: item.actualQtyAll,
      piStatus: piStatus,
    };
  });
  if (localStorage.getItem('SupplierRowsEdit')) {
    let localStorageEdit = JSON.parse(localStorage.getItem('SupplierRowsEdit') || '');
    rows = localStorageEdit;
  }

  const classes = useStyles();
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [characterCount, setCharacterCount] = React.useState(0);
  // const [errorCommentDC, setErrorCommentDC] = React.useState(false);
  const maxCommentLength = 255;
  const handleChangeComment = (event: any) => {
    const value = event.target.value;
    const length = event.target.value.length;
    if (length <= maxCommentLength) {
      setCharacterCount(event.target.value.length);
      setComment(value);
    }
  };

  const [openLoadingModal, setOpenLoadingModal] = React.useState(false);
  const { apiRef, columns } = useApiRef();
  const dispatch = useAppDispatch();
  const payloadSearch = useAppSelector((state) => state.saveSearchOrderSup.searchCriteria);
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [contentMsg, setContentMsg] = React.useState('');
  const [snackbarIsStatus, setSnackbarIsStatus] = React.useState(false);
  const [openModelConfirm, setOpenModelConfirm] = React.useState(false);
  const [openModelDeleteConfirm, setOpenModelDeleteConfirm] = React.useState(false);
  const [items, setItems] = React.useState<any>([]);

  const handleCloseSnackBar = () => {
    setShowSnackBar(false);
  };

  const handleModelConfirm = () => {
    setOpenModelConfirm(false);
  };
  const handlConfirmButton = () => {
    if (!billNo) {
      setErrorBillNo(true);
    } else {
      setErrorBillNo(false);
      setOpenModelConfirm(true);
    }
  };

  const handleModelDeleteConfirm = () => {
    setOpenModelDeleteConfirm(false);
  };
  const handlDeleteConfirmButton = () => {
    setOpenModelDeleteConfirm(true);
  };

  const handleConfirmStatus = async (issuccess: boolean, errorMsg: string) => {
    setOpenLoadingModal(true);
    const msg = issuccess ? 'คุณได้อนุมัติข้อมูล เรียบร้อยแล้ว' : errorMsg;
    setShowSnackBar(true);
    setContentMsg(msg);
    setSnackbarIsStatus(issuccess);

    if (issuccess) {
      dispatch(featchOrderListSupAsync(payloadSearch));
      setTimeout(() => {
        localStorage.removeItem('SupplierRowsEdit');
        setOpen(false);
        onClickClose();
      }, 500);
    } else {
      setOpenLoadingModal(false);
    }
  };

  const handleSaveButton = async () => {
    if (!billNo) {
      setErrorBillNo(true);
    } else {
      setErrorBillNo(false);
      setOpenLoadingModal(true);

      const rows: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
      const itemsList: any = [];
      await rows.forEach((data: GridRowData) => {
        const item: any = {
          barcode: data.barCode,
          actualQty: data.actualQty,
        };
        itemsList.push(item);
      });

      const payloadSave: SavePurchaseRequest = {
        billNo: billNo,
        comment: comment,
        items: itemsList,
      };

      await saveSupplierOrder(payloadSave, piNo)
        .then((_value) => {
          setShowSnackBar(true);
          setSnackbarIsStatus(true);
          setContentMsg('คุณได้บันทึกข้อมูลเรียบร้อยแล้ว');
          dispatch(featchSupplierOrderDetailAsync(piNo));
          dispatch(featchOrderListSupAsync(payloadSearch));

          localStorage.removeItem('SupplierRowsEdit');
        })
        .catch((error: ApiError) => {
          setShowSnackBar(true);
          setContentMsg(error.message);
        });
      setOpenLoadingModal(false);
    }
  };

  return (
    <div>
      <Dialog open={open} maxWidth="xl" fullWidth={true}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          <Typography sx={{ fontSize: '1em' }}>ใบสั่งซื้อ Supplier</Typography>
          <Steppers status={piStatus}></Steppers>
        </BootstrapDialogTitle>

        <DialogContent>
          <Box mt={4}>
            <Grid container spacing={2} mb={0}>
              <Grid item lg={2}>
                <Typography variant="body2">เลขที่ใบสั่งซื้อ PO :</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">{purchaseDetail.docNo}</Typography>
              </Grid>
              <Grid item lg={2}>
                <Typography variant="body2">เลขที่บิลผู้จำหน่าย :</Typography>
              </Grid>
              <Grid item lg={4}>
                <TextField
                  id="txtParamQuery"
                  name="paramQuery"
                  size="small"
                  value={billNo}
                  placeholder="กรุณากรอก เลขที่บิลผู้จำหน่าย"
                  onChange={(event) => setBillNo(event.target.value)}
                  className={classes.MtextFieldDetail}
                  disabled={piStatus !== 0}
                  error={errorBillNo === true}
                  helperText={errorBillNo === true ? 'กรุณากรอก เลขที่บิลผู้จำหน่าย' : ' '}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={0}>
              <Grid item lg={2}>
                <Typography variant="body2">เลขที่เอกสาร PI :</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">{piNo}</Typography>
              </Grid>
              <Grid item lg={2}>
                <Typography variant="body2">แนบเอกสารจากผู้ขาย:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Button
                  id="btnPrint"
                  color="primary"
                  variant="contained"
                  component="span"
                  className={classes.MbtnBrowse}
                  // style={{ marginLeft: 10, textTransform: "none" }}
                  disabled
                >
                  แนบไฟล์
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item lg={2}>
                <Typography variant="body2">รหัสผู้จัดจำหน่าย:</Typography>
              </Grid>
              <Grid item lg={4}>
                <div
                  style={{
                    border: '1px solid #CBD4DB',
                    borderRadius: 5,
                    maxWidth: 250,
                    background: '#EAEBEB',
                    padding: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#263238' }}>
                    {purchaseDetail.supplierName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#AEAEAE', fontSize: 12 }}>
                    {purchaseDetail.supplierTaxNo}
                  </Typography>
                </div>
              </Grid>
              <Grid item lg={6}></Grid>
            </Grid>
          </Box>

          {piStatus !== 1 && (
            <Box mt={4} mb={2}>
              <Grid container spacing={2} display="flex" justifyContent="space-between">
                {/* <Grid container spacing={2}> */}
                <Grid item xl={2}>
                  {piType === 1 && (
                    <Button
                      id="btnSave"
                      variant="contained"
                      color="info"
                      className={classes.MbtnPrint}
                      // onClick={handleSaveButton}
                      startIcon={<ControlPoint />}
                      sx={{ width: 200 }}
                    >
                      เพิ่มสินค้า
                    </Button>
                  )}
                </Grid>

                <Grid item xl={10}>
                  <Button
                    id="btnSave"
                    variant="contained"
                    color="warning"
                    className={classes.MbtnSave}
                    onClick={handleSaveButton}
                    startIcon={<SaveIcon />}
                    sx={{ width: 200 }}
                  >
                    บันทึก
                  </Button>
                  <Button
                    id="btnApprove"
                    variant="contained"
                    color="primary"
                    className={classes.MbtnApprove}
                    onClick={handlConfirmButton}
                    startIcon={<CheckCircleOutline />}
                    sx={{ width: 200 }}
                  >
                    อนุมัติ
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}

          <Box mt={2} bgcolor="background.paper">
            <div style={{ width: '100%' }} className={classes.MdataGridDetail}>
              <DataGrid
                rows={rows}
                columns={columns}
                disableColumnMenu
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[10, 20, 50, 100]}
                pagination
                autoHeight
                paginationMode="server"
              />
            </div>
          </Box>
          <Box mt={3}>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={4}>
                <Typography variant="body2">หมายเหตุ:</Typography>
                <TextField
                  multiline
                  fullWidth
                  rows={5}
                  onChange={handleChangeComment}
                  defaultValue={comment}
                  placeholder="ความยาวไม่เกิน 255 ตัวอักษร"
                  className={classes.MtextFieldRemark}
                  inputProps={{ maxLength: maxCommentLength }}
                  // error={errorCommentDC === true}
                  // helperText={
                  //   errorCommentDC === true ? "กรุณากรอก หมายเหตุ" : " "
                  // }
                  sx={{ maxWidth: 350 }}
                  disabled={piStatus !== 0}
                />

                <div
                  style={{
                    fontSize: '11px',
                    color: '#AEAEAE',
                    width: '100%',
                    maxWidth: 350,
                    textAlign: 'right',
                    // marginTop: "-1.5em",
                  }}
                >
                  {characterCount}/{maxCommentLength}
                </div>
              </Grid>

              <Grid item lg={4}></Grid>
              <Grid item lg={4}>
                <Grid container spacing={2} justifyContent="flex-end" mt={2} mb={1}>
                  <Grid item lg={5}></Grid>
                  <Grid item lg={3} alignItems="flex-end">
                    <Typography variant="body2" pt={1}>
                      ยอดรวม
                    </Typography>
                  </Grid>
                  <Grid item md={4}>
                    <TextField
                      id="txtParamQuery"
                      name="paramQuery"
                      size="small"
                      // value={totalAmount}
                      value="0"
                      className={classes.MtextFieldNumber}
                      fullWidth
                      disabled
                      sx={{ background: '#EAEBEB' }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} justifyContent="flex-end" mb={1}>
                  <Grid item lg={5}></Grid>
                  <Grid item lg={3} alignItems="flex-end">
                    <Typography variant="body2" pt={1}>
                      ภาษี(7%)
                    </Typography>
                  </Grid>
                  <Grid item lg={4}>
                    <TextField
                      id="txtParamQuery"
                      name="paramQuery"
                      size="small"
                      // value={vat}
                      value="0"
                      className={classes.MtextFieldNumber}
                      fullWidth
                      disabled
                      sx={{ background: '#EAEBEB' }}
                    />
                  </Grid>
                </Grid>

                {/* <Grid container spacing={2} justifyContent="flex-end" mb={1}>
                  <Grid item lg={5}></Grid>
                  <Grid item lg={3} alignItems="flex-end">
                    <Typography variant="body2" pt={1}>
                      ลด/ชาร์จ
                    </Typography>
                  </Grid>
                  <Grid item lg={4}>
                    <TextField
                      id="txtParamQuery"
                      name="paramQuery"
                      size="small"
                      // value={discount}
                      value="0"
                      className={classes.MtextFieldNumber}
                      fullWidth
                      disabled
                      sx={{ background: '#EAEBEB' }}
                    />
                  </Grid>
                </Grid> */}

                <Grid container spacing={2} justifyContent="flex-end" mb={1}>
                  <Grid item lg={5}></Grid>
                  <Grid item lg={3} alignItems="flex-end">
                    <Typography variant="body2" pt={1}>
                      <b>ยอดรวมทั้งสิ้น</b>
                    </Typography>
                  </Grid>
                  <Grid item lg={4}>
                    <TextField
                      id="txtParamQuery"
                      name="paramQuery"
                      size="small"
                      // value={afterDiscountCharge}
                      value="0"
                      className={classes.MtextFieldNumber}
                      fullWidth
                      disabled
                      sx={{ background: '#E7FFE9' }}
                    />
                  </Grid>
                </Grid>
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
      <ModelConfirm
        open={openModelConfirm}
        onClose={handleModelConfirm}
        onUpdateAction={handleConfirmStatus}
        piNo={piNo}
        docNo={purchaseDetail.docNo}
        billNo={billNo}
        comment={comment}
        items={items}
      />

      <ModelDeleteConfirm
        open={openModelDeleteConfirm}
        onClose={handleModelDeleteConfirm}
        onUpdateAction={handleConfirmStatus}
        piNo={piNo}
        docNo={purchaseDetail.docNo}
        billNo={billNo}
        comment={comment}
        items={items}
      />

      <ConfirmModelExit
        open={confirmModelExit}
        onClose={handleNotExitModelConfirm}
        onConfirm={handleExitModelConfirm}
      />

      <LoadingModal open={openLoadingModal} />
    </div>
  );
}

export default SupplierOrderDetail;
