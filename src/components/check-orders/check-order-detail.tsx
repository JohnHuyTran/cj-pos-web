import React, { useEffect, useMemo, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../store/store";
import { featchOrderListAsync } from "../../store/slices/check-order-slice";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  useGridApiRef,
  GridValueGetterParams,
  GridRowId,
  GridRowData,
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
  SaveDraftSDRequest,
  CheckOrderDetailProps,
  Entry,
} from "../../models/order-model";
import { convertUtcToBkkDate } from "../../utils/date-utill";
import { ApiError } from "../../models/api-error-model";
import AlertError from "../commons/ui/alert-error";
import {
  ArrowDownward,
  BookmarkAdded,
  CheckCircleOutline,
  HighlightOff,
  Print,
} from "@mui/icons-material";
import LoadingModal from "../commons/ui/loading-modal";
import CheckOrderSDRefDetail from "./check-order-detail-sd";
import { featchOrderSDListAsync } from "../../store/slices/check-order-sd-slice";

interface loadingModalState {
  open: boolean;
}

const columns: GridColDef[] = [
  {
    field: "rowOrder",
    headerName: "ลำดับ",
    width: 80,
    headerAlign: "center",
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "productId",
    headerName: "รหัสสินค้า",
    width: 180,
    headerAlign: "center",
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "productBarCode",
    headerName: "บาร์โค้ด",
    minWidth: 135,
    headerAlign: "center",
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "productDescription",
    headerName: "รายละเอียดสินค้า",
    headerAlign: "center",
    // minWidth: 300,
    flex: 1,
    sortable: false,
  },
  {
    field: "productUnit",
    headerName: "หน่วย",
    width: 90,
    headerAlign: "center",
    sortable: false,
  },
  {
    field: "productQuantityRef",
    headerName: "จำนวนอ้างอิง",
    width: 130,
    headerAlign: "center",
    align: "right",
    sortable: false,
  },
  {
    field: "productQuantityActual",
    headerName: "จำนวนรับจริง",
    width: 135,
    headerAlign: "center",
    sortable: false,
    renderCell: (params: GridRenderCellParams) => (
      <TextField
        variant="outlined"
        name="txnQuantityActual"
        type="number"
        inputProps={{ style: { textAlign: "right" } }}
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
    width: 140,
    headerAlign: "center",
    align: "right",
    sortable: false,
    renderCell: (params) => calProductDiff(params),
  },
  {
    field: "productComment",
    headerName: "หมายเหตุ",
    headerAlign: "center",
    minWidth: 120,
    // flex: 0.5,
    sortable: false,
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
    // return alert("สินค้าภายใน Tote กรอกได้เฉพาะ 0 กับ 1 เท่านั้น");
    return console.log("สินค้าภายใน Tote กรอกได้เฉพาะ 0 กับ 1 เท่านั้น");
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
  const sdRef = useAppSelector((state) => state.checkOrderSDList.orderList);
  const payloadSearchOrder = useAppSelector(
    (state) => state.saveSearchOrder.searchCriteria
  );
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(defaultOpen);
  const [fileName, setFileName] = React.useState("");
  const { apiRef, columns } = useApiRef();

  const [showSaveBtn, setShowSaveBtn] = React.useState(false);
  const [showApproveBtn, setShowApproveBtn] = React.useState(false);
  const [showCloseJobBtn, setShowCloseJobBtn] = React.useState(false);
  // const [disableCloseJobBtn, setDisableCloseJobBtn] = React.useState(true);
  const [validationFile, setValidationFile] = React.useState(false);
  const [isDisplayActBtn, setIsDisplayActBtn] = React.useState("");

  const [errorBrowseFile, setErrorBrowseFile] = React.useState(false);
  const [msgErrorBrowseFile, setMsgErrorBrowseFile] = React.useState("");

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
  const [openFailAlert, setOpenFailAlert] = React.useState(false);
  const [textFail, setTextFail] = React.useState("");

  const [fileInfo, setFileInfo] = React.useState<fileInfoProps>({
    file: null,
    fileName: "",
    base64URL: "",
  });

  const [openLoadingModal, setOpenLoadingModal] =
    React.useState<loadingModalState>({
      open: false,
    });

  const [pageSize, setPageSize] = React.useState<number>(10);

  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };

  useEffect(() => {
    if (
      shipmentList[0].sdStatus === ShipmentDeliveryStatusCodeEnum.STATUS_DRAFT
    ) {
      setShowSaveBtn(false);
      setShowApproveBtn(false);
      setShowCloseJobBtn(true);
    }
    if (
      shipmentList[0].sdStatus === ShipmentDeliveryStatusCodeEnum.STATUS_APPROVE
    ) {
      setShowSaveBtn(true);
      setShowApproveBtn(true);
      setShowCloseJobBtn(false);
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

    dispatch(featchOrderSDListAsync(shipmentList[0].comment));
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

  const handleSaveButton = async () => {
    handleOpenLoading("open", true);

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

    if (!qtyIsValid) {
      setOpenFailAlert(!qtyIsValid);
      setTextFail("จำนวนรับจริงของTote ต้องเป็น 0 หรือ 1 เท่านั้น");
    }

    if (qtyIsValid) {
      const payload: SaveDraftSDRequest = {
        shipmentNo: shipmentNo,
        items: itemsList,
      };

      await saveOrderShipments(payload, sdNo)
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

    handleOpenLoading("open", false);
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
    if (!fileInfo.base64URL) {
      setErrorBrowseFile(true);
      setMsgErrorBrowseFile("กรุณาแนบไฟล์เอกสาร");
    } else if (validationFile === true) {
      setOpenFailAlert(true);
      setTextFail("กรุณาตรวจสอบ ไฟล์เอกสาร");
    } else {
      setOpenModelConfirm(true);
      setAction(ShipmentDeliveryStatusCodeEnum.STATUS_CLOSEJOB);
    }
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
    setValidationFile(false);
    setErrorBrowseFile(false);
    setMsgErrorBrowseFile("");
    checkSizeFile(e);

    let file: File = e.target.files[0];
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

  const checkSizeFile = (e: any) => {
    const fileSize = e.target.files[0].size;
    const fileName = e.target.files[0].name;
    let parts = fileName.split(".");
    let length = parts.length - 1;
    // pdf, .jpg, .jpeg
    if (
      parts[length].toLowerCase() !== "pdf" &&
      parts[length].toLowerCase() !== "jpg" &&
      parts[length].toLowerCase() !== "jpeg"
    ) {
      setValidationFile(true);
      setErrorBrowseFile(true);
      setMsgErrorBrowseFile("กรุณาแนบไฟล์.pdf หรือ .jpg เท่านั้น");
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
        setValidationFile(true);
        setErrorBrowseFile(true);
        setMsgErrorBrowseFile("ขนาดไฟล์เกิน 5MB กรุณาเลือกไฟล์ใหม่");
        return;
      }
    }
  };

  // data grid
  const shipmentList: ShipmentInfo[] = res.data.filter(
    (shipmentInfo: ShipmentInfo) => shipmentInfo.sdNo === sdNo
  );

  let entries: Entry[] = shipmentList[0].entries ? shipmentList[0].entries : [];
  let rowsEntries = entries.map((item: Entry, index: number) => {
    return {
      rowOrder: index + 1,
      id: `${item.deliveryOrderNo}${item.barcode}_${index}`,
      doNo: item.deliveryOrderNo,
      isTote: item.isTote,
      isDraftStatus:
        shipmentList[0].sdStatus === ShipmentDeliveryStatusCodeEnum.STATUS_DRAFT
          ? false
          : true,
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

  const handleShowSnackBar = (issuccess: boolean, errorMsg: any) => {
    if (issuccess) {
      setShowSnackbarSuccess(true);
    } else {
      setShowSnackbarFail(true);
      setSnackBarFailMsg(errorMsg);
    }
  };

  const handleCloseFailAlert = () => {
    setOpenFailAlert(false);
    setTextFail("");
  };

  const [opensSD, setOpensSD] = React.useState(false);
  function isClosSDModal() {
    setOpenModelConfirm(false);
    setOpensSD(false);
  }

  const clickSelectedSDRef = () => {
    handleOpenLoading("open", true);
    setTimeout(() => {
      handleOpenLoading("open", false);
      if (sdRef.data !== null && sdRef.data !== []) {
        setOpensSD(true);
      } else {
        setOpenFailAlert(true);
        setTextFail(
          `ไม่พบข้อมูล อ้างอิง SD โอนลอย: ${shipmentList[0].comment}`
        );
      }
    }, 200);
  };

  const handleClose = () => {
    if (
      shipmentList[0].sdStatus === ShipmentDeliveryStatusCodeEnum.STATUS_DRAFT
    ) {
      const rowsEdit: Map<GridRowId, GridRowData> =
        apiRef.current.getRowModels();
      let i = 0;
      let exit = false;

      const itemsList: any = [];
      rowsEdit.forEach((data: GridRowData) => {
        if (
          data.productQuantityActual !== rowsEntries[i].productQuantityActual
        ) {
          exit = true;
        } else if (data.productComment !== rowsEntries[i].productComment) {
          exit = true;
        }
        i++;

        itemsList.push(data);
      });

      if (!exit) {
        localStorage.removeItem("localStorageRowsEdit");
        setOpen(false);
        onClickClose();
      } else if (exit) {
        localStorage.setItem("localStorageRowsEdit", JSON.stringify(itemsList));
        setConfirmModelExit(true);
      }
    } else if (
      shipmentList[0].sdStatus === ShipmentDeliveryStatusCodeEnum.STATUS_APPROVE
    ) {
      if (fileInfo.base64URL) {
        setConfirmModelExit(true);
      } else {
        setOpen(false);
        onClickClose();
      }
    } else {
      setOpen(false);
      onClickClose();
    }
  };

  return (
    <div>
      <Dialog open={open} maxWidth="xl" fullWidth={true}>
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          <Typography variant="h5">
            รายละเอียดใบตรวจสอบการรับ-โอนสินค้า
          </Typography>
        </BootstrapDialogTitle>

        <DialogContent>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2">เลขที่เอกสาร LD:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">
                  {shipmentList[0].shipmentNo}
                </Typography>
              </Grid>
              <Grid item lg={2}>
                <Typography variant="body2">สถานะ:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">{shipmentStatusText}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2">เลขที่เอกสาร SD:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">{shipmentList[0].sdNo}</Typography>
              </Grid>
              <Grid item lg={2}>
                <Typography variant="body2">ประเภท:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">{shipmentTypeText}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2">วันที่:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">{shipmentDateFormat}</Typography>
              </Grid>
              <Grid item lg={2}>
                {shipmentList[0].sdStatus ===
                  ShipmentDeliveryStatusCodeEnum.STATUS_APPROVE && (
                  <Typography variant="body2">ใบผลต่างหลังเซ็นต์:</Typography>
                )}

                {shipmentList[0].hasDoc === true &&
                  shipmentList[0].sdStatus ===
                    ShipmentDeliveryStatusCodeEnum.STATUS_CLOSEJOB && (
                    <Typography variant="body2">ใบผลต่างหลังเซ็นต์:</Typography>
                  )}
              </Grid>
              <Grid item lg={4}>
                {shipmentList[0].sdStatus ===
                  ShipmentDeliveryStatusCodeEnum.STATUS_APPROVE && (
                  <div>
                    {errorBrowseFile === true && (
                      <TextField
                        error
                        name="browserTxf"
                        className={classes.MtextFieldBrowse}
                        value={fileInfo.fileName}
                        placeholder="แนบไฟล์ .pdf หรือ .jpg ขนาดไฟล์ไม่เกิน 5 MB"
                        helperText={msgErrorBrowseFile}
                      />
                    )}

                    {errorBrowseFile === false && (
                      <TextField
                        name="browserTxf"
                        className={classes.MtextFieldBrowse}
                        value={fileInfo.fileName}
                        placeholder="แนบไฟล์ .pdf หรือ .jpg ขนาดไฟล์ไม่เกิน 5 MB"
                      />
                    )}

                    <input
                      id="btnBrowse"
                      type="file"
                      // multiple
                      // onDrop
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
                        ดูเอกสาร{" "}
                        <u>
                          <ArrowDownward fontSize="small" />
                        </u>
                      </Link>
                    </div>
                  )}
              </Grid>
            </Grid>

            <Grid container spacing={2} mb={1}>
              <Grid item lg={2}>
                {shipmentList[0].comment !== "" && (
                  <Typography variant="body2">อ้างอิง SD โอนลอย :</Typography>
                )}
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">
                  {shipmentList[0].comment !== "" && (
                    <u
                      onClick={clickSelectedSDRef}
                      style={{ cursor: "pointer" }}
                    >
                      {shipmentList[0].comment}
                    </u>
                  )}
                </Typography>
              </Grid>
              <Grid item lg={6}></Grid>
            </Grid>
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
                {!showSaveBtn && (
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

                {!showApproveBtn && (
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

                {!showCloseJobBtn && (
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
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[10, 20, 50, 100]}
                pagination
                autoHeight
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
        open={openFailAlert}
        onClose={handleCloseFailAlert}
        textError={textFail}
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
          sx={{
            width: "300px",
            background: "#36C690",
            borderRadius: "6px",
            fontSize: "14px",
          }}
          onClose={handleCloseSnackBar}
        >
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
          sx={{
            width: "300px",
            borderRadius: "6px",
            fontSize: "12px",
          }}
          onClose={handleCloseSnackBar}
        >
          {snackBarFailMsg}
        </Alert>
      </Snackbar>

      <LoadingModal open={openLoadingModal.open} />

      {opensSD && (
        <CheckOrderSDRefDetail
          sdNo={sdNo}
          sdRefNo={shipmentList[0].comment}
          shipmentNo={shipmentNo}
          defaultOpen={opensSD}
          onClickClose={isClosSDModal}
        />
      )}
    </div>
  );
}
