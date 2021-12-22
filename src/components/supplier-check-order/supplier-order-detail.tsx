import React, { ReactElement, useEffect, useMemo } from 'react';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { Button, DialogTitle, Grid, IconButton, Link, TextField } from '@mui/material';
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
import {
  PurchaseDetailEntries,
  SavePurchaseRequest,
  FileType,
  CalculatePurchasePIRequest,
} from '../../models/supplier-check-order-model';
import LoadingModal from '../commons/ui/loading-modal';
import { ApiError } from '../../models/api-error-model';
import { calculateSupplierPI, getPathReportPI, saveSupplierOrder } from '../../services/purchase';
import { featchSupplierOrderDetailAsync } from '../../store/slices/supplier-order-detail-slice';
import { featchOrderListSupAsync } from '../../store/slices/supplier-check-order-slice';
import SnackbarStatus from '../commons/ui/snackbar-status';
import ConfirmModelExit from '../commons/ui/confirm-exit-model';
import ModelConfirm from './modal-confirm';
import theme from '../../styles/theme';
import AccordionHuaweiFile from './accordion-huawei-file';
import ModalAddItem from './modal-add-item';
import ModelDeleteConfirm from './modal-delete-confirm';
import { updateItemsState } from '../../store/slices/supplier-add-items-slice';
import { featchItemBySupplierListAsync } from '../../store/slices/search-item-by-sup-slice';
import { GridEditCellValueParams } from '@material-ui/data-grid';
import ModalShowFile from '../commons/ui/modal-show-file';
import { formatFileNam } from '../../utils/enum/check-order-enum';

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
    width: 80,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
    renderCell: (params) => (
      <Box component="div" sx={{ paddingLeft: '20px' }}>
        {params.value}
      </Box>
    ),
  },
  {
    field: 'barCode',
    headerName: 'บาร์โค้ด',
    minWidth: 200,
    // flex: 0.7,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'productName',
    headerName: 'สินค้า',
    headerAlign: 'center',
    minWidth: 220,
    flex: 1,
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
    width: 100,
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
        // onBlur={(e) => {
        //   var value = e.target.value ? parseInt(e.target.value, 10) : '';
        //   if (value === 0) value = '';
        //   params.api.updateRows([{ ...params.row, actualQty: value }]);
        // }}
        onChange={(e) => {
          var value = e.target.value ? parseInt(e.target.value, 10) : '';
          if (value < 0) value = 0;
          var qty = Number(params.getValue(params.id, 'qty'));
          var piType = Number(params.getValue(params.id, 'piType'));
          if (piType === 0 && value > qty) value = qty;
          params.api.updateRows([{ ...params.row, actualQty: value }]);
        }}
        disabled={isDisable(params) ? true : false}
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
    width: 110,
    headerAlign: 'center',
    align: 'right',
    sortable: false,
    renderCell: (params: GridRenderCellParams) => (
      <div>
        {params.getValue(params.id, 'piType') === 0 && <label>{params.value}</label>}
        {params.getValue(params.id, 'piType') === 1 && params.getValue(params.id, 'piStatus') === 1 && (
          <label>{params.value}</label>
        )}
        {params.getValue(params.id, 'piType') === 1 && params.getValue(params.id, 'piStatus') === 0 && (
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
const isDisable = (params: GridRenderCellParams) => {
  let piStatus = params.getValue(params.id, 'piStatus');
  if (piStatus === 0) return false;
  else if (piStatus === 1) return true;
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
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(isOpen);
  const [confirmModelExit, setConfirmModelExit] = React.useState(false);

  const handleClose = async () => {
    let exit = false;
    if (comment !== purchaseDetail.comment || billNo !== purchaseDetail.billNo) {
      exit = true;
    }

    if (rows.length > 0) {
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

      if (itemsList !== []) await dispatch(updateItemsState(itemsList));
    }

    if (!exit) {
      await dispatch(updateItemsState({}));
      setOpen(false);
      onClickClose();
    } else if (exit) {
      setConfirmModelExit(true);
    }
  };

  // const [chkSetState, setChkSetState] = React.useState(false);
  const handleUpdateRowState = async () => {
    if (rows.length > 0) {
      const rowsEdit: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
      const itemsList: any = [];
      rowsEdit.forEach((data: GridRowData) => {
        const item: any = {
          id: data.index,
          barcode: data.barCode,
          unitName: data.unitName,
          productName: data.productName,
          qty: data.qty,
          actualQty: data.actualQty,
          skuCode: data.skuCode,
          unitPrice: data.setPrice,
          sumPrice: data.sumPrice,
        };

        itemsList.push(item);
      });
      // setChkSetState(true);
      await dispatch(updateItemsState(itemsList));
    }
  };

  function handleNotExitModelConfirm() {
    setConfirmModelExit(false);
  }

  const handleExitModelConfirm = async () => {
    await dispatch(updateItemsState({}));
    setConfirmModelExit(false);
    setOpen(false);
    onClickClose();
  };

  useEffect(() => {
    setOpen(isOpen);
    setsSupplierCode(purchaseDetail.supplierCode);
    setBillNo(purchaseDetail.billNo);
    setPiNo(purchaseDetail.piNo);
    setPiType(purchaseDetail.piType);
    setPiStatus(purchaseDetail.piStatus);
    setComment(purchaseDetail.comment);
    setCharacterCount(purchaseDetail.comment.length);
    setFiles(purchaseDetail.files ? purchaseDetail.files : []);

    if (purchaseDetail.piType === 1) dispatch(featchItemBySupplierListAsync(purchaseDetail.supplierCode));
  }, [open]);

  const saveStateRows = async () => {
    if (rows.length > 0) {
      const rowsEdit: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
      const itemsList: any = [];
      rowsEdit.forEach((data: GridRowData) => {
        itemsList.push(data);
      });
      // console.log('itemsList:', JSON.stringify(itemsList));
      if (itemsList.length > 0) updateStateRows(itemsList);
    }
  };
  const updateStateRows = async (items: any) => {
    await dispatch(updateItemsState(items));
  };

  const purchaseDetailList = useAppSelector((state) => state.supplierOrderDetail.purchaseDetail);
  const purchaseDetail: any = purchaseDetailList.data ? purchaseDetailList.data : null;
  const purchaseDetailItems = purchaseDetail.entries ? purchaseDetail.entries : [];
  const payloadAddItem = useAppSelector((state) => state.supplierAddItems.state);

  const [deleteItems, setDeleteItems] = React.useState(false);
  if (Object.keys(payloadAddItem).length === 0 && !deleteItems) {
    updateStateRows(purchaseDetailItems);
    console.log('setPurchaseDetailItems');
  }
  const [supplierCode, setsSupplierCode] = React.useState('');
  const [billNo, setBillNo] = React.useState('');
  const [errorBillNo, setErrorBillNo] = React.useState(false);
  const [piNo, setPiNo] = React.useState('');
  const [piType, setPiType] = React.useState(0);
  const [piStatus, setPiStatus] = React.useState(0);
  const [comment, setComment] = React.useState('');
  const [totalAmount, setTotalAmount] = React.useState(0);
  const [vat, setVat] = React.useState(0);
  const [grandTotalAmount, setGrandTotalAmount] = React.useState(0);
  const [flagCalculate, setFlagCalculate] = React.useState(false);

  const setItemCal = async () => {
    if (rows.length > 0) {
      const itemsList: any = [];
      await rows.forEach((data: GridRowData) => {
        const item: any = {
          barcode: data.barCode,
          actualQty: data.actualQty,
        };
        itemsList.push(item);
      });
      if (itemsList.length > 0) calculateItems(itemsList);
    }
  };

  const [files, setFiles] = React.useState<FileType[]>([
    // { fileKey: 'key.jpg', fileName: 'new-image.jpg', mimeType: 'image/jpeg' },
    // { fileKey: 'SD21120002-000014-Draft.pdf', fileName: 'new-document.pdf', mimeType: 'application/pdf' },
  ]);

  let rows: any = [];
  if (Object.keys(payloadAddItem).length !== 0) {
    rows = payloadAddItem.map((item: any, index: number) => {
      let barcode = item.barCode ? item.barCode : item.barcode;
      let setPrice = item.setPrice ? item.setPrice : item.unitPrice;
      return {
        id: `${barcode}-${index + 1}`,
        index: index + 1,
        seqItem: item.seqItem,
        isControlStock: item.isControlStock,
        isAllowDiscount: item.isAllowDiscount,
        skuCode: item.skuCode,
        barCode: barcode,
        productName: item.productName ? item.productName : item.barcodeName,
        unitCode: item.unitCode,
        unitName: item.unitName,
        qty: item.qty ? item.qty : 0,
        qtyAll: item.qtyAll,
        controlPrice: item.controlPrice,
        salePrice: item.salePrice,
        setPrice: setPrice ? setPrice : 0,
        sumPrice: item.sumPrice ? item.sumPrice : 0,
        actualQty: item.actualQty ? item.actualQty : 0,
        piType: piType,
        piStatus: piStatus,
      };
    });
  }

  if (rows.length === 0) {
    if (totalAmount !== 0) setTotalAmount(0);
    if (vat !== 0) setVat(0);
    if (grandTotalAmount !== 0) setGrandTotalAmount(0);
  }

  if (!flagCalculate && rows.length > 0) {
    setItemCal();
    setFlagCalculate(true);
  }

  const classes = useStyles();
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [characterCount, setCharacterCount] = React.useState(0);
  const maxCommentLength = 255;
  const handleChangeComment = (event: any) => {
    handleUpdateRowState();
    const value = event.target.value;
    const length = event.target.value.length;
    if (length <= maxCommentLength) {
      setCharacterCount(event.target.value.length);
      setComment(value);
    }
  };

  const handleChangeBillNo = (event: any) => {
    handleUpdateRowState();
    const value = event.target.value;
    setBillNo(value);
    setErrorBillNo(false);
  };

  const [openLoadingModal, setOpenLoadingModal] = React.useState(false);
  const { apiRef, columns } = useApiRef();
  const payloadSearch = useAppSelector((state) => state.saveSearchOrderSup.searchCriteria);
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [contentMsg, setContentMsg] = React.useState('');
  const [snackbarIsStatus, setSnackbarIsStatus] = React.useState(false);
  const [openModelConfirm, setOpenModelConfirm] = React.useState(false);
  const [items, setItems] = React.useState<any>([]);

  const handleCloseSnackBar = () => {
    setShowSnackBar(false);
  };

  const handleModelConfirm = () => {
    setOpenModelConfirm(false);
  };

  const handlConfirmButton = async () => {
    handleUpdateRowState();
    if (!billNo) {
      setErrorBillNo(true);
    } else {
      setErrorBillNo(false);

      if (rows.length > 0) {
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
      }
      setOpenModelConfirm(true);
    }
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
        setOpen(false);
        onClickClose();
      }, 500);
    } else {
      setOpenLoadingModal(false);
    }
  };

  const handleSaveButton = async () => {
    handleUpdateRowState();
    if (!billNo) {
      setErrorBillNo(true);
    } else {
      setErrorBillNo(false);
      setOpenLoadingModal(true);

      const itemsList: any = [];
      const itemsState: any = [];
      if (rows.length > 0) {
        const rows: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
        await rows.forEach((data: GridRowData) => {
          const item: any = {
            barcode: data.barCode,
            actualQty: data.actualQty,
          };
          itemsList.push(item);
          itemsState.push(data);
        });
      }

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
        })
        .catch((error: ApiError) => {
          setShowSnackBar(true);
          setContentMsg(error.message);
        });
      setOpenLoadingModal(false);
    }
  };

  const [openModelAddItems, setOpenModelAddItems] = React.useState(false);
  const handleAddItems = () => {
    handleUpdateRowState();
    setOpenModelAddItems(true);
  };

  const handleModelAddItems = () => {
    setFlagCalculate(false);
    setOpenModelAddItems(false);
  };

  const [openModelDeleteConfirm, setOpenModelDeleteConfirm] = React.useState(false);
  const [productNameDel, setProductNameDel] = React.useState('');
  const [skuCodeDel, setSkuCodeDel] = React.useState('');
  const [barCodeDel, setBarCodeDel] = React.useState('');
  const currentlySelected = async (params: GridCellParams) => {
    const value = params.colDef.field;
    const isRefPO = params.getValue(params.id, 'isRefPO');
    //deleteItem
    handleUpdateRowState();

    if (!isRefPO && value === 'sumPrice') {
      setDeleteItems(true);
      setProductNameDel(String(params.getValue(params.id, 'productName')));
      setSkuCodeDel(String(params.getValue(params.id, 'skuCode')));
      setBarCodeDel(String(params.getValue(params.id, 'barCode')));
      setOpenModelDeleteConfirm(true);
    }
  };

  const handleModelDeleteConfirm = () => {
    setFlagCalculate(false);
    setOpenModelDeleteConfirm(false);
  };

  const handleCalculateItems = async (params: GridEditCellValueParams) => {
    saveStateRows();
    if (params.field === 'actualQty') {
      const itemsList: any = [];
      if (rows.length > 0) {
        const rows: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
        await rows.forEach((data: GridRowData) => {
          const item: any = {
            barcode: data.barCode,
            actualQty: data.actualQty,
          };
          itemsList.push(item);
        });
      }

      calculateItems(itemsList);
      // setOpenLoadingModal(false);
    }
  };

  const calculateItems = async (items: any) => {
    const payloadCalculate: CalculatePurchasePIRequest = {
      piNo: purchaseDetail.piNo,
      docNo: purchaseDetail.docNo,
      SupplierCode: purchaseDetail.supplierCode,
      items: items,
    };

    await calculateSupplierPI(payloadCalculate)
      .then((value) => {
        setTotalAmount(value.data.amountText.totalAmount);
        setVat(value.data.amountText.vat);
        setGrandTotalAmount(value.data.amountText.grandTotalAmount);

        let calItem = value.data.items;
        const items: any = [];
        rows.forEach((data: GridRowData) => {
          const calculate = calItem.filter((r: any) => r.barcode === data.barCode);
          const item: any = {
            id: data.index,
            barCode: data.barCode,
            unitName: data.unitName,
            productName: data.productName,
            qty: data.qty,
            actualQty: calculate[0].actualQty,
            skuCode: data.skuCode,
            unitPrice: data.setPrice,
            sumPrice: calculate[0].amountText.sumPrice,
          };
          items.push(item);
        });
        updateStateRows(items);
      })
      .catch((error: ApiError) => {
        console.log('calculateSupplierPI error:', error);
      });
  };

  const [openModelPreviewDocument, setOpenModelPreviewDocument] = React.useState(false);
  const [statusFile, setStatusFile] = React.useState(0);
  function handleModelPreviewDocument() {
    setOpenModelPreviewDocument(false);
  }
  const handleLinkDocument = async () => {
    setOpenLoadingModal(true);
    setStatusFile(1);
    setOpenModelPreviewDocument(true);
    setOpenLoadingModal(false);
  };

  return (
    <div>
      <Dialog open={open} maxWidth="xl" fullWidth={true}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          <Typography sx={{ fontSize: '1em' }}>ใบรับสินค้าจากผู้จำหน่าย</Typography>
          <Steppers status={piStatus}></Steppers>
        </BootstrapDialogTitle>

        <DialogContent>
          <Box mt={4} sx={{ flexGrow: 1 }}>
            <Grid container mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2">เลขที่ใบสั่งซื้อ PO :</Typography>
              </Grid>
              <Grid item lg={4}>
                {piType !== 1 && <Typography variant="body2">{purchaseDetail.docNo}</Typography>}
                {piType === 1 && <Typography variant="body2">-</Typography>}
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
                  onChange={handleChangeBillNo}
                  className={classes.MtextFieldDetail}
                  disabled={piStatus !== 0}
                  error={errorBillNo === true}
                  helperText={errorBillNo === true ? 'กรุณากรอก เลขที่บิลผู้จำหน่าย' : ' '}
                />
              </Grid>
            </Grid>

            <Grid container mb={2} sx={{ mt: -4 }}>
              <Grid item lg={2}>
                <Typography variant="body2">เลขที่เอกสาร PI :</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">{piNo}</Typography>
              </Grid>
              <Grid item lg={6}></Grid>
            </Grid>

            <Grid container mb={1}>
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
                    {purchaseDetail.supplierName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#AEAEAE', fontSize: 12 }}>
                    {purchaseDetail.supplierTaxNo}
                  </Typography>
                </div>
              </Grid>
              <Grid item lg={2} sx={{ mt: -3 }}>
                <Typography variant="body2">แนบเอกสารจากผู้จำหน่าย :</Typography>
              </Grid>
              <Grid item lg={4} sx={{ mt: -3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1 }}>
                  <Button
                    id="btnPrint"
                    color="primary"
                    variant="contained"
                    component="span"
                    className={classes.MbtnBrowse}
                    disabled
                  >
                    แนบไฟล์
                  </Button>

                  <Typography
                    variant="overline"
                    sx={{ ml: 1, color: theme.palette.cancelColor.main, lineHeight: '120%' }}
                  >
                    แนบไฟล์ .pdf/.jpg ขนาดไม่เกิน 5 mb
                  </Typography>
                </Box>

                {piStatus === 1 && files.length > 0 && <AccordionHuaweiFile files={files} />}
                {piStatus === 1 && (
                  <Link component="button" variant="body2" onClick={handleLinkDocument}>
                    เรียกดูเอกสารใบรับสินค้า
                  </Link>
                )}
              </Grid>
            </Grid>
          </Box>

          <Box mt={4} mb={2}>
            <Grid container spacing={2} display="flex" justifyContent="space-between">
              <Grid item xl={2}>
                {piType == 1 && piStatus !== 1 && (
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
                {piStatus !== 1 && (
                  <Button
                    id="btnSave"
                    variant="contained"
                    color="warning"
                    className={classes.MbtnSave}
                    onClick={handleSaveButton}
                    startIcon={<SaveIcon />}
                    sx={{ width: 200 }}
                    disabled={rows.length == 0}
                  >
                    บันทึก
                  </Button>
                )}
                {piStatus !== 1 && (
                  <Button
                    id="btnApprove"
                    variant="contained"
                    color="primary"
                    className={classes.MbtnApprove}
                    onClick={handlConfirmButton}
                    startIcon={<CheckCircleOutline />}
                    sx={{ width: 200 }}
                    disabled={rows.length == 0}
                  >
                    ยืนยัน
                  </Button>
                )}
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
                onCellFocusOut={handleCalculateItems}
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
                  }}
                >
                  {characterCount}/{maxCommentLength}
                </div>
              </Grid>

              <Grid item lg={4}></Grid>
              <Grid item lg={4}>
                <Grid container spacing={2} justifyContent="flex-end" mb={1}>
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
                      value={totalAmount}
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
                      value={vat}
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
                      value={grandTotalAmount}
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
        supplierId={supplierCode}
        comment={comment}
        piType={piType}
        items={items}
        piDetail={false}
      />

      <ConfirmModelExit
        open={confirmModelExit}
        onClose={handleNotExitModelConfirm}
        onConfirm={handleExitModelConfirm}
      />

      <ModalAddItem open={openModelAddItems} onClose={handleModelAddItems} supNo={supplierCode}></ModalAddItem>

      <ModelDeleteConfirm
        open={openModelDeleteConfirm}
        onClose={handleModelDeleteConfirm}
        productName={productNameDel}
        skuCode={skuCodeDel}
        barCode={barCodeDel}
      />

      <ModalShowFile
        open={openModelPreviewDocument}
        onClose={handleModelPreviewDocument}
        url={getPathReportPI(piNo)}
        statusFile={statusFile}
        sdImageFile=""
        fileName={formatFileNam(piNo, piStatus)}
      />

      <LoadingModal open={openLoadingModal} />
    </div>
  );
}

export default SupplierOrderDetail;
