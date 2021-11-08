import React, { useEffect, useMemo, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../store/store";
import {
  featchOrderListAsync,
  clearDataFilter,
} from "../../store/slices/check-order-slice";

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  FormControl,
  formControlClasses,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
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
  GridCellParams,
  GridRowsProp,
} from "@mui/x-data-grid";
import DialogTitle from "@mui/material/DialogTitle";
import Link from "@mui/material/Link";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import { useStyles } from "./check-order-detail-css";
import {
  saveOrderShipments,
  getPathReportSD,
} from "../../services/order-shipment";
import ConfirmOrderShipment from "./check-order-confirm-model";
import ConfirmExitModel from "./confirm-model";
import {
  ShipmentDeliveryStatusCodeEnum,
  getShipmentTypeText,
  getShipmentStatusText,
} from "../../utils/enum/check-order-enum";
import ModalShowPDF from "./modal-show-pdf";
import {
  ShipmentInfo,
  ShipmentResponse,
  SaveDraftSDRequest,
  CheckOrderDetailProps,
  Entry,
  ShipmentRequest,
} from "../../models/order-model";
import { convertUtcToBkkDate } from "../../utils/date-utill";
import { ApiError } from "../../models/api-error-model";
import AlertError from "../commons/ui/alert-error";
import {
  ArrowDownward,
  BookmarkAdd,
  BookmarkAdded,
  CheckCircleOutline,
  HighlightOff,
  Print,
} from "@mui/icons-material";
import LoadingModal from "../commons/ui/loading-modal";

interface loadingModalState {
  open: boolean;
}

const columns: GridColDef[] = [
  {
    field: "col1",
    headerName: "ลำดับ",
    width: 90,
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "productId",
    headerName: "รหัสสินค้า",
    width: 170,
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "productBarCode",
    headerName: "บาร์โค้ด",
    minWidth: 170,
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "productDescription",
    headerName: "รายละเอียดสินค้า",
    headerAlign: "center",
    minWidth: 300,
  },
  {
    field: "productUnit",
    headerName: "หน่วย",
    minWidth: 100,
    headerAlign: "center",
  },
  {
    field: "productQuantityRef",
    headerName: "จำนวนอ้างอิง",
    width: 135,
    headerAlign: "center",
    align: "right",
  },
  {
    field: "productQuantityActual",
    headerName: "จำนวนรับจริง",
    width: 135,
    headerAlign: "center",
    renderCell: (params: GridRenderCellParams) => (
      <TextField
        variant="outlined"
        name="txnQuantityActual"
        type="number"
        value={params.value}
        onChange={(e) => {
          var value = e.target.value ? parseInt(e.target.value, 10) : "";
          if (value < 0) value = 0;

          params.api.updateRows([
            { ...params.row, productQuantityActual: value },
          ]);
        }}
        onBlur={(e) => {
          isAllowActualQty(params, parseInt(e.target.value, 10));

          params.api.updateRows([
            { ...params.row, productQuantityActual: e.target.value },
          ]);
        }}
        disabled={isDisable(params) ? true : false}
        autoComplete="off"
      />
    ),
  },
  {
    field: "productDifference",
    headerName: "ส่วนต่างการรับ",
    width: 145,
    headerAlign: "center",
    align: "right",
    // valueGetter: (params) => calProductDiff(params),
    renderCell: (params) => calProductDiff(params),
  },
  {
    field: "productComment",
    headerName: "หมายเหตุ",
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
  let diff =
    Number(params.getValue(params.id, "productQuantityActual")) -
    Number(params.getValue(params.id, "productQuantityRef"));

  if (diff > 0)
    return (
      <label style={{ color: "#446EF2", fontWeight: 700 }}> +{diff} </label>
    );
  if (diff < 0)
    return (
      <label style={{ color: "#F54949", fontWeight: 700 }}> {diff} </label>
    );
  return diff;
};

var getActualQty = function (params: string) {
  return !params ? "0" : params;
};

function useApiRef() {
  const apiRef = useGridApiRef();
  const _columns = useMemo(
    () =>
      columns.concat({
        field: "__HIDDEN__",
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

const isAllowActualQty = (params: GridRenderCellParams, value: number) => {
  if (params.row.isTote === true && !(value * 1 >= 0 && value * 1 <= 1)) {
    return alert("สินค้าภายใน Tote กรอกได้เฉพาะ 0 กับ 1 เท่านั้น");
  }
};

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
            position: "absolute",
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

interface fileInfoProps {
  file?: any;
  fileName: string;
  base64URL: any;
}

export default function CheckOrderDetail({
  sdNo,
  shipmentNo,
  defaultOpen,
  onClickClose,
}: CheckOrderDetailProps) {
  // const { sdNo, defaultOpen } = props;
  const classes = useStyles();

  const res = useAppSelector((state) => state.checkOrderList.orderList);
  const payloadSearchOrder = useAppSelector(
    (state) => state.saveSearchOrder.searchCriteria
  );
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(defaultOpen);
  const [fileName, setFileName] = React.useState("");
  const { apiRef, columns } = useApiRef();

  const [disableSaveBtn, setDisableSaveBtn] = React.useState(false);
  const [disableApproveBtn, setDisableApproveBtn] = React.useState(false);
  const [disableCloseJobBtn, setDisableCloseJobBtn] = React.useState(false);
  const [isDisplayActBtn, setIsDisplayActBtn] = React.useState("");

  const [openModelConfirm, setOpenModelConfirm] = React.useState(false);
  const [action, setAction] = useState<number>(0);

  const [showSnackbarSuccess, setShowSnackbarSuccess] = React.useState(false);
  const [showSnackbarFail, setShowSnackbarFail] = React.useState(false);
  const [itemsDiffState, setItemsDiffState] = useState<Entry[]>([]);

  const [confirmModelExit, setConfirmModelExit] = React.useState(false);

  const [openModelPreviewDocument, setOpenModelPreviewDocument] =
    React.useState(false);
  const [shipmentStatusText, setShipmentStatusText] = useState<
    string | undefined
  >("");
  const [shipmentTypeText, setShipmentTypeText] = useState<string | undefined>(
    ""
  );
  // const [sdNo, setSdNo] = React.useState('');
  const [shipmentDateFormat, setShipmentDateFormat] = useState<
    string | undefined
  >("");
  const [snackBarFailMsg, setSnackBarFailMsg] = React.useState("");
  const [openAlert, setOpenAlert] = React.useState(false);
  const [fileInfo, setFileInfo] = React.useState<fileInfoProps>({
    file: null,
    fileName: "",
    base64URL: "",
  });

  const [openLoadingModal, setOpenLoadingModal] =
    React.useState<loadingModalState>({
      open: false,
    });

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
      setIsDisplayActBtn("none");
    }

    setOpen(defaultOpen);
    setShipmentStatusText(getShipmentStatusText(shipmentList[0].sdStatus));
    setShipmentTypeText(getShipmentTypeText(shipmentList[0].sdType));
    setShipmentDateFormat(convertUtcToBkkDate(shipmentList[0].shipmentDate));
  }, [open, openModelConfirm]);

  function handleNotExitModelConfirm() {
    setConfirmModelExit(false);
  }
  function handleExitModelConfirm() {
    localStorage.removeItem("localStorageRowsEdit");
    setConfirmModelExit(false);
    setOpen(false);
    onClickClose();
  }

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
        itemNo: "",
        shipmentSAPRef: "",
        skuCode: "",
        skuType: "",
        productName: "",
        unitCode: "",
        unitName: "",
        unitFactor: 0,
        qty: 0,
        qtyAll: 0,
        qtyAllBefore: 0,
        qtyDiff: 0,
        price: 0,
        isControlStock: 0,
        toteCode: "",
        expireDate: "",
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

    localStorage.removeItem("localStorageRowsEdit");
  };

  const handleApproveBtn = async () => {
    setItemsDiffState([]);
    setOpenModelConfirm(true);
    setAction(ShipmentDeliveryStatusCodeEnum.STATUS_APPROVE);
    const rowsEdit: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();

    const itemsList: any = [];
    rowsEdit.forEach((data: GridRowData) => {
      let diffCount: number =
        data.productQuantityActual - data.productQuantityRef;

      // console.log("data: " + JSON.stringify(data));

      const itemDiff: Entry = {
        barcode: data.productBarCode,
        deliveryOrderNo: data.doNo,
        actualQty: data.productQuantityActual,
        comment: data.productComment,
        seqItem: 0,
        itemNo: "",
        shipmentSAPRef: "",
        skuCode: "",
        skuType: "",
        productName: data.productDescription,
        unitCode: "",
        unitName: "",
        unitFactor: 0,
        qty: 0,
        qtyAll: 0,
        qtyAllBefore: 0,
        qtyDiff: diffCount,
        price: 0,
        isControlStock: 0,
        toteCode: "",
        expireDate: "",
        isTote: false,
      };
      setItemsDiffState((itemsDiffState) => [...itemsDiffState, itemDiff]);

      itemsList.push(data);
    });

    localStorage.setItem("localStorageRowsEdit", JSON.stringify(itemsList));
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

  const getBase64 = (file: Blob) => {
    return new Promise((resolve) => {
      let fileInfo;
      let baseURL: any = "";
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };

  const handleFileInputChange = (e: any) => {
    let file: File = e.target.files[0];
    const fileSize = e.target.files[0].size;
    const fileName = e.target.files[0].name;

    getBase64(file)
      .then((result: any) => {
        file = result;
        setFileInfo({ ...fileInfo, base64URL: result, fileName: fileName });
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  // data grid
  const shipmentList: ShipmentInfo[] = res.data.filter(
    (shipmentInfo: ShipmentInfo) => shipmentInfo.sdNo === sdNo
  );

  let entries: Entry[] = shipmentList[0].entries ? shipmentList[0].entries : [];
  let rowsEntries = entries.map((item: Entry, index: number) => {
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

  if (localStorage.getItem("localStorageRowsEdit")) {
    let localStorageEdit = JSON.parse(
      localStorage.getItem("localStorageRowsEdit") || ""
    );
    rowsEntries = localStorageEdit;
  }

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

  const getfileName = (fileName: string) => {
    console.log(`fileName>>: ${fileName}`);
    return fileName;
  };

  // const [opensSD, setOpensSD] = React.useState(false);
  // function isClosSDModal() {
  //   setOpensSD(false);
  // }

  // function clickSelectedSD() {
  //   setOpensSD(true);
  // }

  const handleClose = () => {
    const rowsEdit: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
    let i = 0;
    let exit = false;

    const itemsList: any = [];
    rowsEdit.forEach((data: GridRowData) => {
      if (data.productQuantityActual !== rowsEntries[i].productQuantityActual) {
        exit = true;
      } else if (data.productComment !== rowsEntries[i].productComment) {
        exit = true;
      }
      i++;

      itemsList.push(data);
    });

    if (!exit) {
      setOpen(false);
      onClickClose();
    }

    if (exit) {
      localStorage.setItem("localStorageRowsEdit", JSON.stringify(itemsList));
      setConfirmModelExit(true);
    }
  };

  return (
    <div>
      <Dialog open={open} maxWidth="xl" fullWidth={true}>
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          <Typography variant="h5" gutterBottom>
            รายละเอียดใบตรวจสอบการรับ-โอนสินค้า
          </Typography>
        </BootstrapDialogTitle>

        <DialogContent>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2" gutterBottom>
                  เลขที่เอกสาร LD:
                </Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2" gutterBottom>
                  {shipmentList[0].shipmentNo}
                </Typography>
              </Grid>
              <Grid item lg={2}>
                <Typography variant="body2" gutterBottom>
                  สถานะ:
                </Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2" gutterBottom>
                  {shipmentStatusText}
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2" gutterBottom>
                  เลขที่เอกสาร SD:
                </Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2" gutterBottom>
                  {shipmentList[0].sdNo}
                </Typography>
              </Grid>
              <Grid item lg={2}>
                <Typography variant="body2" gutterBottom>
                  ประเภท:
                </Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2" gutterBottom>
                  {shipmentTypeText}
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2" gutterBottom>
                  วันที่:
                </Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2" gutterBottom>
                  {shipmentDateFormat}
                </Typography>
              </Grid>
              <Grid item lg={2}>
                <Typography variant="body2" gutterBottom>
                  ใบผลต่างหลังเซ็นต์:
                </Typography>
              </Grid>
              <Grid item lg={4}>
                {shipmentList[0].sdStatus !==
                  ShipmentDeliveryStatusCodeEnum.STATUS_CLOSEJOB && (
                  <div>
                    <TextField
                      name="browserTxf"
                      className={classes.MtextFieldBrowse}
                      value={fileInfo.fileName}
                      placeholder="แนบไฟล์ .pdf หรือ .jpg ขนาดไฟล์ไม่เกิน 5 MB"
                    />
                    <input
                      id="btnBrowse"
                      type="file"
                      accept=".pdf, .jpg, .jpeg"
                      onChange={handleFileInputChange}
                      style={{ display: "none" }}
                    />

                    <label htmlFor={"btnBrowse"}>
                      <Button
                        id="btnPrint"
                        color="primary"
                        variant="contained"
                        component="span"
                        className={classes.MbtnBrowse}
                        style={{ marginLeft: 10, textTransform: "none" }}
                      >
                        Browse
                      </Button>
                    </label>
                  </div>
                )}

                {shipmentList[0].hasDoc === true &&
                  shipmentList[0].sdStatus ===
                    ShipmentDeliveryStatusCodeEnum.STATUS_CLOSEJOB && (
                    <div>
                      <Link
                        component="button"
                        variant="body2"
                        onClick={handleLinkDocument}
                      >
                        ดูเอกสาร <ArrowDownward />
                      </Link>
                    </div>
                  )}
              </Grid>
            </Grid>

            {/* <Grid container spacing={2} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2" gutterBottom>
                  อ้างอิง SD โอนลอย :
                </Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2" gutterBottom>
                  <u onClick={clickSelectedSD} style={{ cursor: "pointer" }}>
                    SD20020101-000001
                  </u>
                </Typography>
              </Grid>
              <Grid item lg={2}>
                <Typography variant="body2" gutterBottom>
                  แนบภาพสินค้า / วีดีโอ:
                </Typography>
              </Grid>
              <Grid item lg={4}>
                {shipmentList[0].sdStatus !==
                  ShipmentDeliveryStatusCodeEnum.STATUS_CLOSEJOB && (
                  <div>
                    <TextField
                      name="browserTxf"
                      className={classes.MtextFieldBrowse}
                      value={fileInfo.fileName}
                      placeholder="แนบไฟล์รวมไม่เกิน 30 MB"
                    />
                    <input
                      id="btnBrowse"
                      type="file"
                      accept=".pdf, .jpg, .jpeg"
                      onChange={handleFileInputChange}
                      style={{ display: "none" }}
                    />

                    <label htmlFor={"btnBrowse"}>
                      <Button
                        id="btnPrint"
                        color="primary"
                        variant="contained"
                        component="span"
                        className={classes.MbtnBrowse}
                        style={{ marginLeft: 10, textTransform: "none" }}
                      >
                        Browse
                      </Button>
                    </label>
                  </div>
                )}
                {shipmentList[0].hasDoc === true &&
                  shipmentList[0].sdStatus ===
                    ShipmentDeliveryStatusCodeEnum.STATUS_CLOSEJOB && (
                    <div>
                      <Link
                        component="button"
                        variant="body2"
                        onClick={handleLinkDocument}
                      >
                        ดูเอกสาร <ArrowDownward />
                      </Link>
                    </div>
                  )}
              </Grid>
            </Grid>
            hasDoc : {shipmentList[0].hasDoc} */}
          </Box>

          {/* DisplayBtn */}
          <Box sx={{ display: isDisplayActBtn, marginTop: 4 }}>
            <Grid
              container
              spacing={2}
              display="flex"
              justifyContent="space-between"
            >
              <Grid item xl={2}>
                <Button
                  id="btnPrint"
                  variant="contained"
                  color="secondary"
                  onClick={handlePrintBtn}
                  startIcon={<Print />}
                  className={classes.MbtnPrint}
                  style={{ textTransform: "none" }}
                >
                  พิมพ์ใบผลต่าง
                </Button>
              </Grid>

              <Grid item>
                {!disableSaveBtn && (
                  <Button
                    id="btnSave"
                    variant="contained"
                    color="warning"
                    className={classes.MbtnSave}
                    onClick={handleSaveButton}
                    startIcon={<SaveIcon />}
                  >
                    บันทึก
                  </Button>
                )}

                {!disableApproveBtn && (
                  <Button
                    id="btnApprove"
                    variant="contained"
                    color="primary"
                    className={classes.MbtnApprove}
                    onClick={handleApproveBtn}
                    startIcon={<CheckCircleOutline />}
                  >
                    อนุมัติ
                  </Button>
                )}

                {!disableCloseJobBtn && (
                  <Button
                    id="btnClose"
                    variant="contained"
                    color="primary"
                    className={classes.MbtnClose}
                    onClick={handleCloseJobBtn}
                    startIcon={<BookmarkAdded />}
                  >
                    ปิดงาน
                  </Button>
                )}
              </Grid>
            </Grid>
          </Box>

          <Box mt={2} bgcolor="background.paper">
            <div
              style={{ height: 400, width: "100%" }}
              className={classes.MdataGrid}
            >
              <DataGrid
                rows={rowsEntries}
                columns={columns}
                disableColumnMenu
                // autoPageSize={true}
                pagination={true}
                pageSize={5}
                editMode="row"
                autoHeight
                // onCellEditStart={handleCellClick2}
                // onEditRowsModelChange={handleCellClick2}
                // onCellClick={handleCellClick2}

                // onEditRowsModelChange={handleEditRowsModelChange}
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
        fileName={fileInfo.fileName}
        imageContent={fileInfo.base64URL}
      />

      <ConfirmExitModel
        open={confirmModelExit}
        onClose={handleNotExitModelConfirm}
        onConfirm={handleExitModelConfirm}
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
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          severity="success"
          sx={{ width: "100%" }}
          onClose={handleCloseSnackBar}
        >
          {/* This transaction is success */}
          ทำรายการสำเร็จ
        </Alert>
      </Snackbar>

      <Snackbar
        open={showSnackbarFail}
        onClose={handleCloseSnackBar}
        autoHideDuration={6000}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          severity="error"
          sx={{ width: "100%" }}
          onClose={handleCloseSnackBar}
        >
          {snackBarFailMsg}
        </Alert>
      </Snackbar>

      <LoadingModal open={openLoadingModal.open} />

      {/* {opensSD && (
        <CheckOrderDetail
          sdNo={sdNo}
          shipmentNo={shipmentNo}
          defaultOpen={opensSD}
          onClickClose={isClosSDModal}
        />
      )} */}
    </div>
  );
}
