import React, { ReactElement, useEffect, useMemo } from 'react';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { Button, DialogTitle, Grid, IconButton, TextField } from '@mui/material';
import { CheckCircleOutline, ControlPoint, DeleteForever, HighlightOff } from '@mui/icons-material';
import { Box } from '@mui/system';
import Steppers from '../commons/ui/steppers';
import SaveIcon from '@mui/icons-material/Save';
import { useStyles } from '../../styles/makeTheme';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  useGridApiRef,
  GridRowId,
  GridRowData,
  GridValueGetterParams,
  GridCellParams,
} from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { SavePurchasePIRequest } from '../../models/supplier-check-order-model';
import LoadingModal from '../commons/ui/loading-modal';
import { ApiError } from '../../models/api-error-model';
import { saveSupplierPI } from '../../services/purchase';
import SnackbarStatus from '../commons/ui/snackbar-status';
import ConfirmModelExit from '../commons/ui/confirm-exit-model';
import ModelConfirm from './modal-confirm';
import ModelDeleteConfirm from './modal-delete-confirm';
import ModelAddItems from './modal-add-items';
import { updateItemsState } from '../../store/slices/supplier-add-items-slice';

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
        // disabled={isDisable(params) ? true : false}
        autoComplete="off"
      />
    ),
  },
  {
    field: 'productDifference',
    headerName: 'ส่วนต่างการรับ',
    width: 140,
    headerAlign: 'center',
    align: 'right',
    sortable: false,
    renderCell: (params) => calProductDiff(params),
  },
  {
    field: 'setPrice',
    headerName: 'ราคาต่อหน่วย',
    width: 135,
    headerAlign: 'center',
    align: 'right',
    sortable: false,
  },
  {
    field: 'sumPrice',
    headerName: 'รวม',
    width: 120,
    headerAlign: 'center',
    align: 'right',
    sortable: false,
    renderCell: (params: GridRenderCellParams) => (
      <div>
        {params.getValue(params.id, 'isRefPO') && <label>{params.value}</label>}

        {!params.getValue(params.id, 'isRefPO') && (
          <div>
            <label style={{ position: 'relative', right: '-1.5em' }}>{params.value}</label>
            <DeleteForever
              fontSize="small"
              sx={{ color: '#F54949', position: 'relative', right: '-2em', top: '5px' }}
            />
          </div>
        )}
      </div>
    ),
  },
];

var calProductDiff = function (params: GridValueGetterParams) {
  let diff = Number(params.getValue(params.id, 'actualQty')) - Number(params.getValue(params.id, 'qty'));

  if (diff > 0) return <label style={{ color: '#446EF2', fontWeight: 700 }}> +{diff} </label>;
  if (diff < 0) return <label style={{ color: '#F54949', fontWeight: 700 }}> {diff} </label>;
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

function SupplierOrderDetail({ isOpen, onClickClose }: Props): ReactElement {
  const [open, setOpen] = React.useState(isOpen);
  const [confirmModelExit, setConfirmModelExit] = React.useState(false);

  const handleClose = async () => {
    let exit = false;
    if (comment !== '' || billNo !== '') {
      exit = true;
    }

    if (po) {
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

      if (itemsList !== []) {
        localStorage.setItem('SupplierPIRowsEdit', JSON.stringify(itemsList));
      }
    }

    if (!exit) {
      localStorage.removeItem('SupplierPIRowsEdit');

      await dispatch(updateItemsState({}));
      setOpen(false);
      onClickClose();
    } else if (exit) {
      setConfirmModelExit(true);
    }
  };

  function handleNotExitModelConfirm() {
    setConfirmModelExit(false);
  }

  function handleExitModelConfirm() {
    localStorage.removeItem('SupplierPIRowsEdit');
    setConfirmModelExit(false);
    setOpen(false);
    onClickClose();
  }

  useEffect(() => {
    setOpen(isOpen);
    if (po) {
      setDocNo(po.docNo);
      setPiStatus(0);
    }

    setSupplierCode(payloadSupplier.supplier.code);
    setSupplierName(payloadSupplier.supplier.name);
    setSupplierTaxNo(payloadSupplier.supplier.taxNo);
  }, [open]);

  const payloadSupplier = useAppSelector((state) => state.supplierSelectionSlice.state);
  const supplier = payloadSupplier.supplier;
  const po = payloadSupplier.poSelection;
  const payloadAddItem = useAppSelector((state) => state.supplierAddItems.state);
  // console.log('payloadSupplier: ', JSON.stringify(payloadSupplier));
  // console.log('payloadAddItem: ', po.docNo);
  // console.log('supplier : ', JSON.stringify(supplier));

  let rows: any = [];
  const handleAddRow = (items: any) => {
    rows = items.map((item: any, index: number) => {
      return {
        id: `${item.barcode}-${index + 1}`,
        index: index + 1,
        seqItem: item.seqItem,
        isControlStock: item.isControlStock,
        isAllowDiscount: item.isAllowDiscount,
        skuCode: item.skuCode,
        barCode: item.barcode,
        productName: item.barcodeName,
        unitCode: item.unitCode,
        unitName: item.unitName,
        qty: item.qty,
        qtyAll: item.qtyAll,
        controlPrice: item.controlPrice,
        salePrice: item.salePrice,
        setPrice: item.pricePerUnit,
        sumPrice: item.sumPrice,
        actualQty: item.actualQty ? item.actualQty : 0,
        isRefPO: supplier.isRefPO,
      };
    });
  };

  if (po) {
    const supplierItems = po.items;
    handleAddRow(supplierItems);
  } else if (payloadAddItem) {
    handleAddRow(payloadAddItem);
  }

  // const change = () => {
  //   columns[9].hide = !columns[9].hide;
  //   // setColumns([...columns]);
  // };

  const [billNo, setBillNo] = React.useState('');
  const [errorBillNo, setErrorBillNo] = React.useState(false);
  const [piNo, setPiNo] = React.useState('');
  const [supplierCode, setSupplierCode] = React.useState('');
  const [supplierName, setSupplierName] = React.useState('');
  const [supplierTaxNo, setSupplierTaxNo] = React.useState('');
  const [piType, setPiType] = React.useState(0);
  const [piStatus, setPiStatus] = React.useState(1);
  const [comment, setComment] = React.useState('');
  const [docNo, setDocNo] = React.useState('');

  if (localStorage.getItem('SupplierPIRowsEdit')) {
    let localStorageEdit = JSON.parse(localStorage.getItem('SupplierPIRowsEdit') || '');
    rows = localStorageEdit;
  }

  const classes = useStyles();
  const [pageSize, setPageSize] = React.useState<number>(10);
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

  const { apiRef, columns } = useApiRef();
  const dispatch = useAppDispatch();
  // const payloadSearch = useAppSelector((state) => state.saveSearchOrderSup.searchCriteria);
  const [openLoadingModal, setOpenLoadingModal] = React.useState(false);
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [contentMsg, setContentMsg] = React.useState('');
  const [snackbarIsStatus, setSnackbarIsStatus] = React.useState(false);
  const [openModelConfirm, setOpenModelConfirm] = React.useState(false);
  const [openModelDeleteConfirm, setOpenModelDeleteConfirm] = React.useState(false);
  const [openModelAddItems, setOpenModelAddItems] = React.useState(false);
  const [items, setItems] = React.useState<any>([]);

  const handleCloseSnackBar = () => {
    setShowSnackBar(false);
  };

  const handleModelConfirm = () => {
    setOpenModelConfirm(false);
  };
  const handlConfirmButton = async () => {
    if (!billNo) {
      setErrorBillNo(true);
    } else {
      setErrorBillNo(false);

      const rows: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
      const itemsList: any = [];
      await rows.forEach((data: GridRowData) => {
        const item: any = {
          barcode: data.barCode,
          actualQty: data.actualQty,
        };
        itemsList.push(item);
      });
      await setItems(itemsList);
      setOpenModelConfirm(true);
    }
  };

  const [productNameDel, setProductNameDel] = React.useState('');
  const [skuCodeDel, setSkuCodeDel] = React.useState('');
  const [barCodeDel, setBarCodeDel] = React.useState('');
  const currentlySelected = (params: GridCellParams) => {
    const value = params.colDef.field;
    const isRefPO = params.getValue(params.id, 'isRefPO');
    //deleteItem
    if (!isRefPO && value === 'sumPrice') {
      setProductNameDel(String(params.getValue(params.id, 'productName')));
      setSkuCodeDel(String(params.getValue(params.id, 'skuCode')));
      setBarCodeDel(String(params.getValue(params.id, 'barCode')));
      setOpenModelDeleteConfirm(true);
    }
  };

  const handleModelDeleteConfirm = () => {
    setOpenModelDeleteConfirm(false);
  };

  const handleAddItems = () => {
    setOpenModelAddItems(true);
  };

  const handleModelAddItems = () => {
    setOpenModelAddItems(false);
  };

  const handleConfirmStatus = async (issuccess: boolean, errorMsg: string) => {
    setOpenLoadingModal(true);
    const msg = issuccess ? 'คุณได้อนุมัติข้อมูล เรียบร้อยแล้ว' : errorMsg;
    setShowSnackBar(true);
    setContentMsg(msg);
    setSnackbarIsStatus(issuccess);

    if (issuccess) {
      // dispatch(featchOrderListSupAsync(payloadSearch));
      setTimeout(() => {
        localStorage.removeItem('SupplierPIRowsEdit');
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

      // if (itemsList !== []) {
      //   localStorage.setItem('SupplierPIRowsEdit', JSON.stringify(itemsList));
      // }

      const payloadSave: SavePurchasePIRequest = {
        piNo: piNo,
        supplierId: supplierCode,
        billNo: billNo,
        docNo: docNo ? docNo : '',
        flagPO: piStatus,
        comment: comment,
        items: itemsList,
      };

      // console.log(piType, ' : payloadSave : ', JSON.stringify(payloadSave));

      await saveSupplierPI(payloadSave)
        .then((value) => {
          setPiNo(value.piNo);
          setShowSnackBar(true);
          setSnackbarIsStatus(true);
          setContentMsg('คุณได้บันทึกข้อมูลเรียบร้อยแล้ว');
          // dispatch(featchOrderListSupAsync(payloadSearch));
          localStorage.removeItem('SupplierPIRowsEdit');
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
          <Typography sx={{ fontSize: '1em' }}>ใบรับสินค้าจากผู้จำหน่าย</Typography>
          <Steppers status={piStatus}></Steppers>
        </BootstrapDialogTitle>

        <DialogContent>
          <Box mt={4}>
            <Grid container spacing={2} mb={0}>
              <Grid item lg={2}>
                <Typography variant="body2">เลขที่ใบสั่งซื้อ PO :</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">{docNo}</Typography>
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
                  // disabled={piStatus !== 0}
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
                <Typography variant="body2">แนบเอกสารจากผู้จำหน่าย :</Typography>
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
                <Typography variant="body2">ผู้จัดจำหน่าย:</Typography>
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
                    {supplierName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#AEAEAE', fontSize: 12 }}>
                    {supplierTaxNo}
                  </Typography>
                </div>
              </Grid>
              <Grid item lg={6}></Grid>
            </Grid>
          </Box>

          <Box mt={4} mb={2}>
            <Grid container spacing={2} display="flex" justifyContent="space-between">
              <Grid item xl={2}>
                {!po && (
                  <Button
                    id="btnAddItem"
                    variant="contained"
                    color="info"
                    className={classes.MbtnPrint}
                    onClick={handleAddItems}
                    startIcon={<ControlPoint />}
                    sx={{ width: 200 }}
                  >
                    เพิ่มสินค้า
                  </Button>
                )}
              </Grid>

              <Grid item xl={10} sx={{ textAlign: 'end' }}>
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
                  ยืนยัน
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box mt={2} bgcolor="background.paper">
            <div
              style={{ width: '100%', height: rows.length >= 8 ? '70vh' : 'auto' }}
              className={classes.MdataGridDetail}
            >
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[10, 20, 50, 100]}
                pagination
                disableColumnMenu
                autoHeight={rows.length >= 8 ? false : true}
                scrollbarSize={10}
                rowHeight={65}
                onCellClick={currentlySelected}
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
                  // disabled={piStatus !== 0}
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
        docNo={docNo}
        billNo={billNo}
        supplierId={supplierCode}
        comment={comment}
        piStatus={piStatus}
        items={items}
        piDetail={true}
      />

      <ModelDeleteConfirm
        open={openModelDeleteConfirm}
        onClose={handleModelDeleteConfirm}
        productName={productNameDel}
        skuCode={skuCodeDel}
        barCode={barCodeDel}
      />

      <ModelAddItems open={openModelAddItems} onClose={handleModelAddItems} SupplierCode="0000400537"></ModelAddItems>
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
