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
    width: 200,
    headerAlign: "center",
    disableColumnMenu: true,
  },
  {
    field: "productBarCode",
    headerName: "บาร์โค้ด",
    minWidth: 150,
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
    width: 90,
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
  },
  {
    field: "productDifference",
    headerName: "ส่วนต่างการรับ",
    width: 145,
    headerAlign: "center",
    align: "right",
    renderCell: (params) => calProductDiff(params),
  },
  {
    field: "productComment",
    headerName: "หมายเหตุ",
    headerAlign: "center",
    minWidth: 150,
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

// const res = useAppSelector((state) => state.checkOrderList.orderList);
// const shipmentList: ShipmentInfo[] = res.data.filter(
//   (shipmentInfo: ShipmentInfo) => shipmentInfo.sdNo === sdNo
// );
// let entries: Entry[] = shipmentList[0].entries ? shipmentList[0].entries : [];
// let rowsEntries = entries.map((item: Entry, index: number) => {
//   return {
//     id: `${item.deliveryOrderNo}${item.barcode}_${index}`,
//     doNo: item.deliveryOrderNo,
//     isTote: item.isTote,
//     isDraftStatus:
//       shipmentList[0].sdStatus === ShipmentDeliveryStatusCodeEnum.STATUS_DRAFT
//         ? false
//         : true,
//     col1: index + 1,
//     productId: item.skuCode,
//     productBarCode: item.barcode,
//     productDescription: item.productName,
//     productUnit: item.unitName,
//     productQuantityRef: item.qty,
//     productQuantityActual: item.actualQty,
//     productDifference: item.qtyDiff,
//     productComment: item.comment,
//   };
// });

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
  const [openModelConfirm, setOpenModelConfirm] = React.useState(false);
  const [shipmentStatusText, setShipmentStatusText] = useState<
    string | undefined
  >("");
  const [shipmentTypeText, setShipmentTypeText] = useState<string | undefined>(
    ""
  );
  const [openModelPreviewDocument, setOpenModelPreviewDocument] =
    React.useState(false);
  const [shipmentDateFormat, setShipmentDateFormat] = useState<
    string | undefined
  >("");
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
    setOpen(defaultOpen);
    setShipmentStatusText(getShipmentStatusText(shipments[0].sdStatus));
    setShipmentTypeText(getShipmentTypeText(shipments[0].sdType));
    setShipmentDateFormat(convertUtcToBkkDate(shipments[0].shipmentDate));
  }, [open, openModelConfirm]);

  const updateShipmentOrder = () => {
    dispatch(featchOrderListAsync(payloadSearchOrder));
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

  // // data grid
  const shipments: ShipmentInfo[] = res.data.filter(
    (shipmentInfo: ShipmentInfo) => shipmentInfo.sdNo === sdNo
  );

  let entries: Entry[] = shipments[0].entries ? shipments[0].entries : [];

  console.log("----------------------");
  console.log("entries : " + JSON.stringify(entries));

  let rowsEntries = entries.map((item: Entry, index: number) => {
    return {
      id: `${item.deliveryOrderNo}${item.barcode}_${index}`,
      doNo: item.deliveryOrderNo,
      isTote: item.isTote,
      isDraftStatus:
        shipments[0].sdStatus === ShipmentDeliveryStatusCodeEnum.STATUS_DRAFT
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

  const getfileName = (fileName: string) => {
    console.log(`fileName>>: ${fileName}`);
    return fileName;
  };

  const handleLinkDocument = () => {
    setOpenModelPreviewDocument(true);
  };

  const handleClose = () => {
    setOpen(false);
    onClickClose();
  };

  return (
    <div>
      <Dialog open={open} maxWidth="xl" fullWidth={true}>
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          <Typography variant="h5" gutterBottom>
            รายละเอียดใบตรวจสอบการรับ-โอนสินค้า (SD โอนลอย)
          </Typography>
        </BootstrapDialogTitle>

        <DialogContent sx={{ height: "605px" }}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2" gutterBottom>
                  เลขที่เอกสาร LD:
                </Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2" gutterBottom>
                  {shipments[0].shipmentNo}
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
                  {shipments[0].sdNo}
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
                {shipments[0].hasDoc === true &&
                  shipments[0].sdStatus ===
                    ShipmentDeliveryStatusCodeEnum.STATUS_CLOSEJOB && (
                    <Typography variant="body2" gutterBottom>
                      ใบผลต่างหลังเซ็นต์:
                    </Typography>
                  )}
              </Grid>
              <Grid item lg={4}>
                {shipments[0].hasDoc === true &&
                  shipments[0].sdStatus ===
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
          </Box>

          <Box mt={6} bgcolor="background.paper">
            <div
              style={{ height: 400, width: "100%" }}
              className={classes.MdataGrid}
            >
              <DataGrid
                rows={rowsEntries}
                columns={columns}
                disableColumnMenu
                pagination={true}
                pageSize={5}
                editMode="row"
                autoHeight
              />
            </div>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
