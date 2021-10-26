import React, { useEffect, useMemo, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/store';
import {
  featchOrderListAsync,
  clearDataFilter,
} from '../../store/slices/check-order-slice';

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  renderEditInputCell,
  GridEditRowsModel,
  useGridApiRef,
  GridValueGetterParams,
  GridRowId,
  GridRowData,
} from '@mui/x-data-grid';
import DialogTitle from '@mui/material/DialogTitle';
import Link from '@mui/material/Link';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import DoneIcon from '@mui/icons-material/Done';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PreviewIcon from '@mui/icons-material/Preview';

import { useStyles } from './check-order-detail-css';
import { useFilePicker } from 'use-file-picker';

import {
  saveOrderShipments,
  getPathReportSD,
} from '../../services/order-shipment';
import ConfirmOrderShipment from './check-order-confirm-model';
import {
  ShipmentDeliveryStatusCodeEnum,
  getShipmentTypeText,
  getShipmentStatusText,
} from '../../utils/enum/check-order-enum';
import ModalShowPDF from './modal-show-pdf';
import {
  ShipmentInfo,
  ShipmentResponse,
  SaveDraftSDRequest,
  CheckOrderDetailProps,
  Entry,
  ShipmentRequest,
} from '../../models/order-model';
import { convertUtcToBkkDate } from '../../utils/date-utill';
import { ApiError } from '../../models/api-error-model';
import AlertError from '../commons/ui/alert-error';
import { IndeterminateCheckBoxTwoTone } from '@mui/icons-material';

const columns: GridColDef[] = [
  { field: 'col1', headerName: 'ลำดับ', width: 90, disableColumnMenu: true },
  {
    field: 'productId',
    headerName: 'รหัสสินค้า',
    width: 170,
    disableColumnMenu: true,
  },
  {
    field: 'productBarCode',
    headerName: 'บาร์โค้ด',
    minWidth: 170,
    disableColumnMenu: true,
  },
  {
    field: 'productDescription',
    headerName: 'รายละเอียดสินค้า',
    minWidth: 300,
  },
  { field: 'productUnit', headerName: 'หน่วย', minWidth: 100 },
  {
    field: 'productQuantityRef',
    headerName: 'จำนวนอ้างอิง',
    width: 135,
    type: 'number',
  },
  {
    field: 'productQuantityActual',
    headerName: 'จำนวนรับจริง',
    width: 135,
    renderCell: (params: GridRenderCellParams) => (
      <TextField
        variant="outlined"
        name="txnQuantityActual"
        type="number"
        value={params.value}
        onChange={(e) => {
          params.api.updateRows([
            { ...params.row, productQuantityActual: e.target.value },
          ]);
        }}
        onBlur={(e) =>
          params.api.updateRows([
            {
              ...params.row,
              productQuantityActual: getActualQty(e.target.value),
            },
          ])
        }
        disabled={isDisable(params) ? true : false}
        autoComplete="off"
      />
    ),
  },
  {
    field: 'productDifference',
    headerName: 'ส่วนต่างการรับ',
    width: 145,
    type: 'number',
    valueGetter: (params) => calProductDiff(params),
  },
  {
    field: 'productComment',
    headerName: 'หมายเหตุ',
    minWidth: 200,
    renderCell: (params: GridRenderCellParams) => (
      <TextField
        variant="outlined"
        name="txnComment"
        value={params.value}
        onChange={(e) =>
          params.api.updateRows([
            { ...params.row, productComment: e.target.value },
          ])
        }
        disabled={isDisable(params) ? true : false}
        autoComplete="off"
      />
    ),
  },
];

var calProductDiff = function (params: GridValueGetterParams) {
  return (
    Number(params.getValue(params.id, 'productQuantityRef')) -
    Number(params.getValue(params.id, 'productQuantityActual'))
  );
};

var getActualQty = function (params: string) {
  return !params ? '0' : params;
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
const isDisable = (params: GridRenderCellParams) => {
  return params.row.isDraftStatus;
};

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose?: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme: any) => theme.palette.grey[100],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export default function CheckOrderDetail({ sdNo, shipmentNo, defaultOpen, onClickClose }: CheckOrderDetailProps) {
  const classes = useStyles();
  // const { sdNo, defaultOpen } = props;
  const res = useAppSelector((state) => state.checkOrderList.orderList);
  const payloadSearchOrder = useAppSelector(
    (state) => state.saveSearchOrder.searchCriteria
  );
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(defaultOpen);
  const [fileName, setFileName] = React.useState('');
  const { apiRef, columns } = useApiRef();

  const [disableSaveBtn, setDisableSaveBtn] = React.useState(false);
  const [disableApproveBtn, setDisableApproveBtn] = React.useState(false);
  const [disableCloseJobBtn, setDisableCloseJobBtn] = React.useState(false);
  const [isDisplayActBtn, setIsDisplayActBtn] = React.useState('');

  const [openModelConfirm, setOpenModelConfirm] = React.useState(false);
  const [action, setAction] = useState<number>(0);

  const [showSnackbarSuccess, setShowSnackbarSuccess] = React.useState(false);
  const [showSnackbarFail, setShowSnackbarFail] = React.useState(false);
  const [itemsDiffState, setItemsDiffState] = useState<Entry[]>([]);

  const [openModelPreviewDocument, setOpenModelPreviewDocument] =
    React.useState(false);
  const [shipmentStatusText, setShipmentStatusText] = useState<
    string | undefined
  >('');
  const [shipmentTypeText, setShipmentTypeText] = useState<string | undefined>(
    ''
  );
  // const [sdNo, setSdNo] = React.useState('');
  const [shipmentDateFormat, setShipmentDateFormat] = useState<
    string | undefined
  >('');
  const [snackBarFailMsg, setSnackBarFailMsg] = React.useState('');
  const [openAlert, setOpenAlert] = React.useState(false);

  useEffect(() => {
    if (
      shipmentList[0].sdStatus === ShipmentDeliveryStatusCodeEnum.STATUS_DRAFT
    ) {
      setDisableSaveBtn(false);
      setDisableApproveBtn(false);
      setDisableCloseJobBtn(true);
    }
    if (
      shipmentList[0].sdStatus === ShipmentDeliveryStatusCodeEnum.STATUS_APPROVE
    ) {
      setDisableSaveBtn(true);
      setDisableApproveBtn(true);
      setDisableCloseJobBtn(false);
    }

    if (
      shipmentList[0].sdStatus ===
      ShipmentDeliveryStatusCodeEnum.STATUS_CLOSEJOB
    ) {
      setIsDisplayActBtn('none');
    }

    setOpen(defaultOpen);
    setShipmentStatusText(getShipmentStatusText(shipmentList[0].sdStatus));
    setShipmentTypeText(getShipmentTypeText(shipmentList[0].sdType));
    setShipmentDateFormat(convertUtcToBkkDate(shipmentList[0].shipmentDate));
  }, [open, openModelConfirm]);

  const handleClose = () => {
    setOpen(false);
    onClickClose();
  };

  function handleCloseModelConfirm() {
    setOpenModelConfirm(false);
  }

  function handleModelPreviewDocument() {
    setOpenModelPreviewDocument(false);
  }

  const updateShipmentOrder = () => {
    dispatch(featchOrderListAsync(payloadSearchOrder));
  };

  const handleSaveButton = () => {
    let qtyIsValid: boolean = true;
    const rows: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
    const itemsList: any = [];
    rows.forEach((data: GridRowData) => {
      const item: Entry = {
        barcode: data.productBarCode,
        deliveryOrderNo: data.doNo,
        actualQty: data.productQuantityActual * 1,
        comment: data.productComment,
        seqItem: 0,
        itemNo: '',
        shipmentSAPRef: '',
        skuCode: '',
        skuType: '',
        productName: '',
        unitCode: '',
        unitName: '',
        unitFactor: 0,
        qty: 0,
        qtyAll: 0,
        qtyAllBefore: 0,
        qtyDiff: 0,
        price: 0,
        isControlStock: 0,
        toteCode: '',
        expireDate: '',
        isTote: false,
      };

      if (
        data.isTote === true &&
        !(
          data.productQuantityActual * 1 >= 0 &&
          data.productQuantityActual * 1 <= 1
        )
      ) {
        qtyIsValid = false;
      }
      itemsList.push(item);
    });

    setOpenAlert(!qtyIsValid);
    if (qtyIsValid) {
      const payload: SaveDraftSDRequest = {
        shipmentNo: shipmentNo,
        items: itemsList,
      };

      saveOrderShipments(payload, sdNo)
        .then((_value) => {
          setShowSnackbarSuccess(true);
          updateShipmentOrder();
        })
        .catch((error: ApiError) => {
          setShowSnackbarFail(true);
          setSnackBarFailMsg(error.message);
          updateShipmentOrder();
        });
    }
  };

  const handleApproveBtn = () => {
    setItemsDiffState([]);
    setOpenModelConfirm(true);
    setAction(ShipmentDeliveryStatusCodeEnum.STATUS_APPROVE);
    rows.forEach((data: GridRowData) => {
      const diffCount: number =
        data.productQuantityRef - data.productQuantityActual;
      if (diffCount !== 0) {
        const itemDiff: Entry = {
          barcode: data.productBarCode,
          productName: data.productDescription,
          actualQty: diffCount,
          seqItem: 0,
          itemNo: '',
          shipmentSAPRef: '',
          skuCode: '',
          skuType: '',
          deliveryOrderNo: '',
          unitCode: '',
          unitName: '',
          unitFactor: 0,
          qty: 0,
          qtyAll: 0,
          qtyAllBefore: 0,
          qtyDiff: 0,
          price: 0,
          isControlStock: 0,
          toteCode: '',
          expireDate: '',
          isTote: false,
          comment: '',
        };
        setItemsDiffState((itemsDiffState) => [...itemsDiffState, itemDiff]);
      }
    });
  };

  const handleCloseJobBtn = () => {
    setOpenModelConfirm(true);
    setAction(ShipmentDeliveryStatusCodeEnum.STATUS_CLOSEJOB);
  };

  const handlePrintBtn = () => {
    setOpenModelPreviewDocument(true);
  };

  const handleLinkDocument = () => {
    setOpenModelPreviewDocument(true);
  };

  // browser file
  const [
    openFileSelector,
    { filesContent, loading, errors, plainFiles, clear },
  ] = useFilePicker({
    multiple: true,
    readAs: 'BinaryString', // availible formats: "Text" | "BinaryString" | "ArrayBuffer" | "DataURL"
    accept: ['.pdf', '.txt'],
    limitFilesConfig: { min: 0.01, max: 3 },
    // minFileSize: 1, // in megabytes
    // maxFileSize: 1,
    // readFilesContent: false, // ignores file content
  });

  if (errors.length > 0) return <p>Error!</p>;

  if (loading) {
    return <div>Loading...</div>;
  }

  // data grid
  const shipmentList: ShipmentInfo[] = res.data.filter(
    (shipmentInfo: ShipmentInfo) => shipmentInfo.sdNo === sdNo
  );

  const entries: Entry[] = shipmentList[0].entries ? shipmentList[0].entries : [];
  const rows = entries.map((item: Entry, index: number) => {
    return {
      id: `${item.deliveryOrderNo}${item.barcode}_${index}`,
      doNo: item.deliveryOrderNo,
      isTote: item.isTote,
      isDraftStatus:
        shipmentList[0].sdStatus === ShipmentDeliveryStatusCodeEnum.STATUS_DRAFT
          ? false
          : true,
      col1: index + 1,
      productId: item.skuCode,
      productBarCode: item.barcode,
      productDescription: item.productName,
      productUnit: item.unitName,
      productQuantityRef: item.qty,
      productQuantityActual: item.actualQty,
      productDifference: item.qtyDiff,
      productComment: item.comment,
    };
  });

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleCloseSnackBar = () => {
    setShowSnackbarFail(false);
    setShowSnackbarSuccess(false);
  };
  // const handleEditRowsModelChange = React.useCallback((model: GridEditRowsModel) => {
  //     console.log(model);
  // }, []);

  const handleShowSnackBar = (issuccess: boolean, errorMsg: any) => {
    if (issuccess) {
      // setDisableSaveBtn(true);
      // setDisableApproveBtn(true);
      // setDisableCloseJobBtn(false)
      setShowSnackbarSuccess(true);
      // updateShipmentOrder()
    } else {
      setShowSnackbarFail(true);
      setSnackBarFailMsg(errorMsg);
      // updateShipmentOrder()
    }
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  return (
    <div>
      <Dialog open={open} maxWidth="xl" fullWidth={true}>
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          <Typography variant="body1" gutterBottom>
            รายละเอียดใบตรวจสอบการรับ-โอนสินค้า
          </Typography>
        </BootstrapDialogTitle>
        <DialogContent>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item lg={3}>
                <Typography variant="body2" gutterBottom>
                  เลขที่เอกสาร LD:
                </Typography>
              </Grid>
              <Grid item lg={9}>
                <Typography variant="body2" gutterBottom>
                  {shipmentList[0].shipmentNo}
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item lg={3}>
                <Typography variant="body2" gutterBottom>
                  เลขที่เอกสาร SD:
                </Typography>
              </Grid>
              <Grid item lg={9}>
                <Typography variant="body2" gutterBottom>
                  {shipmentList[0].sdNo}
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item lg={3}>
                <Typography variant="body2" gutterBottom>
                  วันที่:
                </Typography>
              </Grid>
              <Grid item lg={9}>
                <Typography variant="body2" gutterBottom>
                  {shipmentDateFormat}
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item lg={3}>
                <Typography variant="body2" gutterBottom>
                  สถานะ:
                </Typography>
              </Grid>
              <Grid item lg={9}>
                <Typography variant="body2" gutterBottom>
                  {shipmentStatusText}
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item lg={3}>
                <Typography variant="body2" gutterBottom>
                  ประเภท:
                </Typography>
              </Grid>
              <Grid item lg={9}>
                <Typography variant="body2" gutterBottom>
                  {shipmentTypeText}
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item lg={3}>
                <Typography variant="body2" gutterBottom>
                  แนบเอกสารใบตรวจสอบการรับ-โอนสินค้าหลังเซ็นต์:
                </Typography>
              </Grid>
              <Grid item lg={9}>
                {shipmentList[0].sdStatus !==
                  ShipmentDeliveryStatusCodeEnum.STATUS_CLOSEJOB && (
                    <div>
                      <TextField
                        name="browserTxf"
                        className={classes.textField}
                        value={
                          !!filesContent.length && filesContent[0].content
                            ? filesContent[0].name
                            : ''
                        }
                      />
                      <Button
                        id="btnPrint"
                        variant="contained"
                        color="primary"
                        className={classes.browserBtn}
                        onClick={() => openFileSelector()}
                        style={{ marginLeft: 10, textTransform: 'none' }}
                        endIcon={<UploadFileIcon />}
                      >
                        Browse
                      </Button>
                    </div>
                  )}
                {shipmentList[0].sdStatus ===
                  ShipmentDeliveryStatusCodeEnum.STATUS_CLOSEJOB && (
                    <div>
                      <Link
                        component="button"
                        variant="body2"
                        onClick={handleLinkDocument}
                      >
                        ดูเอกสาร
                      </Link>
                    </div>
                  )}
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              justifyContent="center"
              style={{ marginTop: 0.1 }}
            >
              <Grid item>
                <Button
                  id="btnBack"
                  variant="contained"
                  color="secondary"
                  className={classes.browserBtn}
                  onClick={handleClose}
                  startIcon={<ArrowBackIosIcon />}
                >
                  ย้อนกลับ
                </Button>
              </Grid>
              <Grid item>
                <Box sx={{ display: isDisplayActBtn }}>
                  <Button
                    id="btnSave"
                    variant="contained"
                    color="primary"
                    className={classes.browserBtn}
                    onClick={handleSaveButton}
                    disabled={disableSaveBtn}
                    endIcon={<SaveIcon />}
                  >
                    บันทึก
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ display: isDisplayActBtn }}>
            <Grid
              container
              spacing={2}
              display="flex"
              justifyContent="space-between"
            >
              <Grid item xl={2}>
                <Button
                  id="btnApprove"
                  variant="contained"
                  color="primary"
                  className={classes.browserBtn}
                  onClick={handleApproveBtn}
                  disabled={disableApproveBtn}
                  endIcon={<AssignmentTurnedInIcon />}
                >
                  อนุมัติ
                </Button>

                <Button
                  id="btnClose"
                  variant="contained"
                  color="primary"
                  className={classes.browserBtn}
                  style={{ marginLeft: 10 }}
                  onClick={handleCloseJobBtn}
                  disabled={disableCloseJobBtn}
                  endIcon={<DoneIcon />}
                >
                  ปิดงาน
                </Button>
              </Grid>

              <Grid item xl={2}>
                <Button
                  id="btnPrint"
                  variant="contained"
                  color="secondary"
                  onClick={handlePrintBtn}
                  endIcon={<PreviewIcon />}
                  style={{ textTransform: 'none' }}
                >
                  Preview ใบตรวจการรับสินค้า
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box mt={2} bgcolor="background.paper">
            <div
              style={{ height: 400, width: '100%' }}
              className={classes.rowDataGrid}
            >
              <DataGrid
                rows={rows}
                columns={columns}
                disableColumnMenu
                autoPageSize={true}
                pagination={true}
                pageSize={5}
                editMode="row"
                getRowClassName={(params) =>
                  `row-style--${Number(params.getValue(params.id, 'productQuantityRef')) -
                    Number(
                      params.getValue(params.id, 'productQuantityActual')
                    ) !=
                    0
                    ? 'diff'
                    : ''
                  }`
                }
              // onEditRowsModelChange={handleEditRowsModelChange}
              // autoHeight
              />
            </div>
          </Box>
        </DialogContent>
      </Dialog>
      <ConfirmOrderShipment
        open={openModelConfirm}
        onClose={handleCloseModelConfirm}
        onUpdateShipmentStatus={handleShowSnackBar}
        shipmentNo={shipmentNo}
        sdNo={sdNo}
        action={action}
        items={itemsDiffState}
        percentDiffType={false}
        percentDiffValue="0"
        fileName={fileName}
        imageContent={filesContent.length > 0 ? filesContent[0].content : ''}
      />

      <ModalShowPDF
        open={openModelPreviewDocument}
        onClose={handleModelPreviewDocument}
        url={getPathReportSD(sdNo)}
      />
      <AlertError
        open={openAlert}
        onClose={handleCloseAlert}
        titleError="Failed"
        textError="จำนวนรับจริง ของ tote  ต้องเป็น 0 หรือ 1เท่านั้น"
      />

      <Snackbar
        open={showSnackbarSuccess}
        onClose={handleCloseSnackBar}
        autoHideDuration={6000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Alert
          severity="success"
          sx={{ width: '100%' }}
          onClose={handleCloseSnackBar}
        >
          This transaction is success
        </Alert>
      </Snackbar>

      <Snackbar
        open={showSnackbarFail}
        onClose={handleCloseSnackBar}
        autoHideDuration={6000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Alert
          severity="error"
          sx={{ width: '100%' }}
          onClose={handleCloseSnackBar}
        >
          {snackBarFailMsg}
        </Alert>
      </Snackbar>
    </div>
  );
}
