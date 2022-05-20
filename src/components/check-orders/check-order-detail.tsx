import React, { useEffect, useMemo, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { featchOrderListAsync } from '../../store/slices/check-order-slice';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  Menu,
  MenuItem,
  MenuProps,
  TextField,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  useGridApiRef,
  GridValueGetterParams,
  GridRowId,
  GridRowData,
  GridEditCellValueParams,
} from '@mui/x-data-grid';
import DialogTitle from '@mui/material/DialogTitle';
import Link from '@mui/material/Link';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import SaveIcon from '@mui/icons-material/Save';
import IconButton from '@mui/material/IconButton';
import { useStyles } from '../../styles/makeTheme';

import { saveOrderShipments, getPathReportSD, approveOrderShipmentsOC } from '../../services/order-shipment';
import ConfirmOrderShipment from './check-order-confirm-model';
import ConfirmExitModel from './confirm-model';
import {
  ShipmentDeliveryStatusCodeEnum,
  getShipmentTypeText,
  getShipmentStatusText,
  formatFileNam,
} from '../../utils/enum/check-order-enum';
import ModalShowFile from '../commons/ui/modal-show-file';
import { SaveDraftSDRequest, CheckOrderDetailProps, Entry, itemsDetail, ToteRequest } from '../../models/order-model';
import { convertUtcToBkkDate } from '../../utils/date-utill';
import { ApiError } from '../../models/api-error-model';
import AlertError from '../commons/ui/alert-error';
import { BookmarkAdded, CheckCircleOutline, HighlightOff, Print } from '@mui/icons-material';
import LoadingModal from '../commons/ui/loading-modal';
import CheckOrderSDRefDetail from './check-order-detail-sd';
import { featchOrderSDListAsync } from '../../store/slices/check-order-sd-slice';
import { featchOrderDetailAsync, setReloadScreen } from '../../store/slices/check-order-detail-slice';
import Snackbar from '../commons/ui/snackbar-status';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { styled } from '@mui/material/styles';
import AddToteModel from '../check-orders/add-tote-model';
import { updateAddItemsState } from '../../store/slices/add-items-slice';
import ModalAddItems from '../commons/ui/modal-add-items';
import { isAllowActionPermission, isGroupBranch } from '../../utils/role-permission';
import { getUserInfo } from '../../store/sessionStore';
import { getBranchName } from '../../utils/utils';
import { ACTIONS, PERMISSION_GROUP } from '../../utils/enum/permission-enum';
import AccordionUploadFile from '../commons/ui/accordion-upload-file';
import AccordionHuaweiFile from '../commons/ui/accordion-huawei-file';
import theme from '../../styles/theme';
import { env } from '../../adapters/environmentConfigs';
import CheckOrderDetailListTote from '../check-orders/check-order-detail-list-tote';
import CheckOrderDetailTote from './check-order-detail-tote';
import { couldStartTrivia } from 'typescript';
import OrderReceiveDetail from './order-receive-detail';
import { searchToteAsync } from '../../store/slices/search-tote-slice';
import CheckOrderDetailItems from '../check-orders/check-order-detail-items';
import { featchOrderDetailToteAsync } from '../../store/slices/check-order-detail-tote-slice';

interface loadingModalState {
  open: boolean;
}

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    // marginTop: theme.spacing(1),
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        marginRight: theme.spacing(1.5),
      },
    },
  },
}));

const columns: GridColDef[] = [
  {
    field: 'rowOrder',
    headerName: 'ลำดับ',
    width: 80,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'barcode',
    headerName: 'บาร์โค้ด',
    minWidth: 135,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'productName',
    headerName: 'รายละเอียดสินค้า',
    headerAlign: 'center',
    minWidth: 160,
    flex: 1,
    sortable: false,
    renderCell: (params) => (
      <div>
        <Typography variant="body2">{params.value}</Typography>
        <Typography variant="body2" color="textSecondary">
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
    field: 'qtyRef',
    headerName: 'จำนวนอ้างอิง',
    width: 130,
    headerAlign: 'center',
    align: 'right',
    sortable: false,
  },
  {
    field: 'actualQty',
    headerName: 'จำนวนรับจริง',
    width: 135,
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
          let actualQty = Number(params.getValue(params.id, 'actualQty'));
          var value = e.target.value ? parseInt(e.target.value, 10) : '';

          if (actualQty === 0) value = chkActualQty(value);
          if (value < 0) value = 0;
          params.api.updateRows([{ ...params.row, actualQty: value }]);
        }}
        // onBlur={(e) => {
        //   // isAllowActualQty(params, parseInt(e.target.value, 10));
        //   params.api.updateRows([{ ...params.row, actualQty: e.target.value }]);
        // }}
        disabled={isDisable(params) ? true : false}
        autoComplete="off"
      />
    ),
  },
  {
    field: 'qtyDiff',
    headerName: 'ส่วนต่างการรับ',
    width: 140,
    headerAlign: 'center',
    align: 'right',
    sortable: false,
    renderCell: (params) => calProductDiff(params),
  },
  {
    field: 'comment',
    headerName: 'หมายเหตุ',
    headerAlign: 'center',
    minWidth: 120,
    // flex: 0.5,
    sortable: false,
    renderCell: (params: GridRenderCellParams) => (
      <TextField
        variant="outlined"
        name="txnComment"
        value={params.value}
        onChange={(e) => params.api.updateRows([{ ...params.row, comment: e.target.value }])}
        disabled={isDisable(params) ? true : false}
        autoComplete="off"
      />
    ),
  },
];

var calProductDiff = function (params: GridValueGetterParams) {
  let diff = Number(params.getValue(params.id, 'actualQty')) - Number(params.getValue(params.id, 'qtyRef'));

  if (diff > 0) return <label style={{ color: '#446EF2', fontWeight: 700 }}> +{diff} </label>;
  if (diff < 0) return <label style={{ color: '#F54949', fontWeight: 700 }}> {diff} </label>;
  return diff;
};

var chkActualQty = (value: any) => {
  let v = String(value);
  if (v.substring(1) === '0') return Number(v.substring(0, 1));
  return value;
};

function useApiRef() {
  const apiRef = useGridApiRef();
  const _columns = useMemo(
    () =>
      columns.concat({
        field: '',
        width: 0,
        minWidth: 0,
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
const isDisable = (params: GridRenderCellParams) => {
  return params.row.sdStatus;
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

interface fileInfoProps {
  file?: any;
  fileName: string;
  base64URL: any;
}

export default function CheckOrderDetail({
  sdNo,
  docRefNo,
  docType,
  defaultOpen,
  onClickClose,
}: CheckOrderDetailProps) {
  const classes = useStyles();
  const sdRef = useAppSelector((state) => state.checkOrderSDList.orderList);
  const payloadSearchOrder = useAppSelector((state) => state.saveSearchOrder.searchCriteria);
  const dispatch = useAppDispatch();
  const orderDetails = useAppSelector((state) => state.checkOrderDetail.orderDetail);
  const orderDetail: any = orderDetails.data ? orderDetails.data : null;
  const [open, setOpen] = React.useState(defaultOpen);
  const { apiRef, columns } = useApiRef();
  const [showSaveBtn, setShowSaveBtn] = React.useState(false);
  const [showApproveBtn, setShowApproveBtn] = React.useState(false);
  const [statusWaitApprove1, setStatusWaitApprove1] = React.useState(false);
  const [showCloseJobBtn, setShowCloseJobBtn] = React.useState(false);
  const [closeJobTote, setCloseJobTote] = React.useState(false);
  const [validationFile, setValidationFile] = React.useState(false);
  const [errorBrowseFile, setErrorBrowseFile] = React.useState(false);
  const [msgErrorBrowseFile, setMsgErrorBrowseFile] = React.useState('');
  const [openModelConfirm, setOpenModelConfirm] = React.useState(false);
  const [action, setAction] = useState<string>('');
  const [itemsDiffState, setItemsDiffState] = useState<Entry[]>([]);
  const [confirmModelExit, setConfirmModelExit] = React.useState(false);
  const [openModelPreviewDocument, setOpenModelPreviewDocument] = React.useState(false);
  const [shipmentStatusText, setShipmentStatusText] = useState<string | undefined>('');
  const [shipmentTypeText, setShipmentTypeText] = useState<string | undefined>('');
  const [shipmentDateFormat, setShipmentDateFormat] = useState<string | undefined>('');
  const [snackBarFailMsg, setSnackBarFailMsg] = React.useState('');
  const [openFailAlert, setOpenFailAlert] = React.useState(false);
  const [textFail, setTextFail] = React.useState('');
  const [toteNo, setToteNo] = React.useState('');
  const [showSdTypeTote, setShowSdTypeTote] = React.useState(false);
  const [openLoadingModal, setOpenLoadingModal] = React.useState<loadingModalState>({
    open: false,
  });

  const [pageSize, setPageSize] = React.useState<number>(10);
  const [statusFile, setStatusFile] = React.useState(0);
  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [contentMsg, setContentMsg] = React.useState('');
  const [snackbarStatus, setSnackbarStatus] = React.useState(false);

  const payloadAddItem = useAppSelector((state) => state.addItems.state);
  const fileUploadList = useAppSelector((state) => state.uploadFileSlice.state);

  const [displayBranchGroup, setDisplayBranchGroup] = React.useState(false);
  const [statusOC, setStatusOC] = React.useState(false);
  const DCPercent = env.dc.percent;
  const [isAllowExportBtn, setIsAllowExportBtn] = React.useState(true);

  useEffect(() => {
    const branch = getUserInfo().group === PERMISSION_GROUP.BRANCH;
    const oc = getUserInfo().group === PERMISSION_GROUP.OC;
    setDisplayBranchGroup(branch);
    setStatusOC(oc);
    setIsAllowExportBtn(isAllowActionPermission(ACTIONS.ORDER_SD_EXPORT));
    if (orderDetail) {
      setShowSaveBtn(orderDetail.sdStatus === ShipmentDeliveryStatusCodeEnum.STATUS_DRAFT);
      setStatusWaitApprove1(orderDetail.sdStatus === ShipmentDeliveryStatusCodeEnum.STATUS_WAITAPPROVEL_1);
      setShowApproveBtn(orderDetail.sdStatus === ShipmentDeliveryStatusCodeEnum.STATUS_APPROVE);
      setShowCloseJobBtn(orderDetail.sdStatus === ShipmentDeliveryStatusCodeEnum.STATUS_CLOSEJOB);
      setShowSdTypeTote(orderDetail.sdType === 0);
      setCloseJobTote(
        orderDetail.sdStatus === ShipmentDeliveryStatusCodeEnum.STATUS_CLOSEJOB && orderDetail.sdType === 0
      );

      // setOpen(defaultOpen);
      setShipmentStatusText(getShipmentStatusText(orderDetail.sdStatus));
      setShipmentTypeText(getShipmentTypeText(orderDetail.sdType));
      if (orderDetail.receivedDate) setShipmentDateFormat(convertUtcToBkkDate(orderDetail.receivedDate));
      if (orderDetail.Comment !== '') {
        dispatch(featchOrderSDListAsync(orderDetail.Comment));
      }
    }

    // }, [open, openModelConfirm]);
  }, [open, orderDetail]);

  const updateState = async (items: any) => {
    await dispatch(updateAddItemsState(items));
  };

  const [openTote, setOpenTote] = React.useState(false);
  const [openOrderReceiveModal, setOpenOrderReceiveModal] = React.useState(false);
  const [toteCode, setToteCode] = React.useState('');

  const handleOpenModalTote = async (value: string, isAddItem: boolean) => {
    rowsEntries = [];
    if (isAddItem === false) {
      try {
        await dispatch(featchOrderDetailAsync(value));
        await dispatch(setReloadScreen(true));
        await dispatch(updateAddItemsState({}));
      } catch (error) {
        console.log(error);
      }

      // await dispatch(featchOrderDetailToteAsync(value)).then(() => {});
      // await setOpenTote(true);
    } else if (isAddItem === true) {
      setToteCode(value);
      handleOpenLoading('open', true);
      const payload: ToteRequest = {
        docRefNo: docRefNo,
        toteCode: value,
      };
      // await dispatch(updateAddItemsState({}));
      await dispatch(searchToteAsync(payload));
      await setOpenOrderReceiveModal(true);
      handleOpenLoading('open', false);
    }
  };

  // function handleCloseDetailToteModal() {
  //   setOpenTote(false);
  //   onClickClose();
  // }

  function handleCloseOrderReceiveModal() {
    setOpenOrderReceiveModal(false);
    onClickClose();
  }

  let rowsEntries: any = [];
  let sumDCPercent: number = 0;
  const handleCalculateDCPercent = async () => {
    // if (docType === 'LD' && orderDetail.sdStatus === ShipmentDeliveryStatusCodeEnum.STATUS_WAITAPPROVEL_1) {
    let sumActualQtyItems: number = 0;
    let sumQuantityRefItems: number = 0;

    if (Object.keys(payloadAddItem).length > 0) {
      payloadAddItem.forEach((item: itemsDetail) => {
        sumActualQtyItems = Number(sumActualQtyItems) + Number(item.actualQty); //รวมจำนวนรับจริง
        sumQuantityRefItems = Number(sumQuantityRefItems) + Number(item.qty); //รวมจำนวนอ้าง
      });

      let sumPercent: number = (sumActualQtyItems * 100) / sumQuantityRefItems;
      sumPercent = Math.trunc(sumPercent); //remove decimal

      if (sumPercent >= 0) {
        sumDCPercent = sumPercent;
      }
    }
  };

  if (openTote === false) {
    let entries: itemsDetail[] = orderDetail.items ? orderDetail.items : [];
    if (entries.length > 0 && Object.keys(payloadAddItem).length === 0) {
      updateState(entries);
    }

    if (Object.keys(payloadAddItem).length !== 0) {
      rowsEntries = payloadAddItem.map((item: any, index: number) => {
        let qtyRef: number = 0;
        let actualQty: number = 0;

        if (item.id !== null && item.id !== undefined) {
          qtyRef = Number(item.qtyRef) ? Number(item.qtyRef) : 0;
          actualQty = Number(item.qty) ? Number(item.qty) : Number(item.actualQty) ? Number(item.actualQty) : 0;
        } else {
          qtyRef = Number(item.qty);
          actualQty = Number(item.actualQty);
        }

        return {
          rowOrder: index + 1,
          id: `${item.deliveryOrderNo}${item.barcode}_${index}`,
          deliveryOrderNo: item.deliveryOrderNo,
          isTote: item.isTote ? item.isTote : false,
          sdStatus: orderDetail.sdStatus === ShipmentDeliveryStatusCodeEnum.STATUS_DRAFT ? false : true,
          skuCode: item.skuCode,
          barcode: item.barcode,
          productName: item.productName,
          unitName: item.unitName,
          qtyRef: qtyRef,
          actualQty: actualQty,
          qtyDiff: item.qtyDiff,
          comment: item.comment,
        };
      });
    }

    if (docType === 'LD' && orderDetail.sdStatus === ShipmentDeliveryStatusCodeEnum.STATUS_WAITAPPROVEL_1) {
      if (sumDCPercent === 0) {
        handleCalculateDCPercent();
      }
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

  function handleCloseModelConfirm() {
    setOpenModelConfirm(false);
  }

  function handleModelPreviewDocument() {
    setOpenModelPreviewDocument(false);
  }

  const updateShipmentOrder = () => {
    dispatch(featchOrderListAsync(payloadSearchOrder));
    // dispatch(featchOrderDetailAsync(sdNo));
  };

  const mapUpdateState = async () => {
    const itemsList: any = [];

    if (rowsEntries.length > 0) {
      const rows: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
      await rows.forEach((data: GridRowData) => {
        itemsList.push(data);
      });
    }

    if (itemsList.length > 0) {
      updateState(itemsList);
    }
  };

  const handleEditItems = async (params: GridEditCellValueParams) => {
    if (params.field === 'actualQty' || params.field === 'comment') {
      mapUpdateState();
    }
  };

  const handleSaveButton = async () => {
    handleOpenLoading('open', true);

    let qtyIsValid: boolean = true;
    const rows: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();

    const itemsList: any = [];
    const itemsListUpdate: any = [];
    rows.forEach((data: GridRowData) => {
      const item: any = {
        barcode: data.barcode,
        deliveryOrderNo: data.deliveryOrderNo,
        actualQty: Number(data.actualQty),
        comment: data.comment,
        isTote: data.isTote,
      };

      if (data.isTote === true && !(data.actualQty * 1 >= 0 && data.actualQty * 1 <= 1)) {
        qtyIsValid = false;
      }
      itemsList.push(item);
      itemsListUpdate.push(data);
    });

    if (!qtyIsValid) {
      setOpenFailAlert(!qtyIsValid);
      setTextFail('จำนวนรับจริงของTote ต้องเป็น 0 หรือ 1 เท่านั้น');
    }

    if (qtyIsValid) {
      const payload: SaveDraftSDRequest = {
        shipmentNo: docRefNo,
        items: itemsList,
      };

      await saveOrderShipments(payload, orderDetail.sdNo)
        .then((_value) => {
          setShowSnackBar(true);
          setContentMsg('คุณได้บันทึกข้อมูลเรียบร้อยแล้ว');
          setSnackbarStatus(true);
          updateShipmentOrder();
        })
        .catch((error: ApiError) => {
          setShowSnackBar(true);
          setContentMsg(error.message);
          setSnackbarStatus(false);
          updateShipmentOrder();
        });

      updateState(itemsListUpdate);
    }

    handleOpenLoading('open', false);
  };

  const [sumActualQty, setSumActualQty] = React.useState(0);
  const [sumQuantityRef, setSumQuantityRef] = React.useState(0);
  const handleApproveBtn = async () => {
    mapUpdateState().then(() => {
      setItemsDiffState([]);

      setAction(ShipmentDeliveryStatusCodeEnum.STATUS_APPROVE);
      const rowsEdit: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
      const itemsList: any = [];

      let qtyIsValid: boolean = true;

      let sumActualQtyItems: number = 0;
      let sumQuantityRefItems: number = 0;
      rowsEdit.forEach((data: GridRowData) => {
        let diffCount: number = data.actualQty - data.qtyRef;
        sumActualQtyItems = Number(sumActualQtyItems) + Number(data.actualQty); //รวมจำนวนรับจริง
        sumQuantityRefItems = Number(sumQuantityRefItems) + Number(data.qtyRef); //รวมจำนวนอ้าง

        const itemDiff: Entry = {
          barcode: data.barcode,
          deliveryOrderNo: data.deliveryOrderNo,
          actualQty: data.actualQty,
          comment: data.comment,
          seqItem: 0,
          itemNo: '',
          shipmentSAPRef: '',
          skuCode: '',
          skuType: '',
          productName: data.productName,
          unitCode: '',
          unitName: '',
          unitFactor: 0,
          qty: 0,
          qtyAll: 0,
          qtyAllBefore: 0,
          qtyDiff: diffCount,
          price: 0,
          isControlStock: 0,
          toteCode: '',
          expireDate: '',
          isTote: data.isTote,
        };

        if (data.isTote === true && !(data.actualQty * 1 >= 0 && data.actualQty * 1 <= 1)) {
          qtyIsValid = false;
        }

        setItemsDiffState((itemsDiffState) => [...itemsDiffState, itemDiff]);
        itemsList.push(data);
      });

      setSumActualQty(sumActualQtyItems);
      setSumQuantityRef(sumQuantityRefItems);
      // handleCalculateDCPercent(sumActualQtyItems, sumQuantityRefItems); //คำนวณDC(%)

      if (!qtyIsValid) {
        setOpenFailAlert(!qtyIsValid);
        setTextFail('จำนวนรับจริงของTote ต้องเป็น 0 หรือ 1 เท่านั้น');
      }

      if (qtyIsValid) {
        setOpenModelConfirm(true);
      }
    });
  };

  const handleApproveOCBtn = async () => {
    await approveOrderShipmentsOC(orderDetail.sdNo)
      .then((_value) => {
        setShowSnackBar(true);
        setContentMsg('คุณได้อนุมัติเรียบร้อยแล้ว');
        setSnackbarStatus(true);
        updateShipmentOrder();
        updateAddItemsState({});
        onClickClose();
      })
      .catch((error: ApiError) => {
        setShowSnackBar(true);
        setContentMsg(error.message);
        setSnackbarStatus(false);
      });
  };

  const validateFileInfo = () => {
    const isvalid = fileUploadList.length > 0 ? true : false;
    if (!isvalid) {
      setOpenFailAlert(true);
      setTextFail('กรุณาแนบเอกสาร');
      return false;
    }
    return true;
  };

  const handleCloseJobBtn = () => {
    const isFileValidate: boolean = validateFileInfo();
    if (isFileValidate) {
      setOpenModelConfirm(true);
      setAction(ShipmentDeliveryStatusCodeEnum.STATUS_CLOSEJOB);
    }
  };

  const handlePrintBtn = async () => {
    handleOpenLoading('open', true);
    setStatusFile(1);
    setOpenModelPreviewDocument(true);
    handleOpenLoading('open', false);
  };

  // const handleLinkDocument = async () => {
  //   handleOpenLoading('open', true);
  //   setStatusFile(0);
  //   setOpenModelPreviewDocument(true);
  //   handleOpenLoading('open', false);
  // };

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleCloseSnackBar = () => {
    setShowSnackBar(false);
    setContentMsg('');
    setSnackbarStatus(false);
  };

  const handleShowSnackBar = async (issuccess: boolean, errorMsg: string) => {
    handleOpenLoading('open', true);
    const msg = issuccess ? 'คุณได้ทำรายการเรียบร้อยแล้ว' : errorMsg;
    setShowSnackBar(true);
    setContentMsg(msg);
    setSnackbarStatus(issuccess);

    if (issuccess) {
      updateShipmentOrder();
      setTimeout(() => {
        setOpen(false);
        onClickClose();
      }, 1000);
    }
    handleOpenLoading('open', false);
  };

  const handleCloseFailAlert = () => {
    setOpenFailAlert(false);
    setTextFail('');
  };

  const [opensSD, setOpensSD] = React.useState(false);
  function isClosSDModal() {
    setOpenModelConfirm(false);
    setOpensSD(false);
  }

  const clickSelectedSDRef = async () => {
    handleOpenLoading('open', true);
    setTimeout(() => {
      handleOpenLoading('open', false);

      if (sdRef.data !== null && sdRef.data !== []) {
        setOpensSD(true);
      } else {
        setOpenFailAlert(true);
        setTextFail(`ไม่พบข้อมูล อ้างอิง SD โอนลอย: ${orderDetail.Comment}`);
      }
    }, 200);
  };

  const handleClose = () => {
    if (orderDetail.sdStatus === ShipmentDeliveryStatusCodeEnum.STATUS_DRAFT) {
      const rowsEdit: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
      let i = 0;
      let exit = false;

      // const itemsList: any = [];
      // rowsEdit.forEach((data: GridRowData) => {
      //   if (data.actualQty !== rowsEntries[i].actualQty) {
      //     exit = true;
      //   } else if (data.comment !== rowsEntries[i].comment) {
      //     exit = true;
      //   }
      //   i++;

      //   itemsList.push(data);
      // });

      if (!exit) {
        dispatch(updateAddItemsState({}));
        setOpen(false);
        onClickClose();
      } else if (exit) {
        setConfirmModelExit(true);
      }
    } else if (orderDetail.sdStatus === ShipmentDeliveryStatusCodeEnum.STATUS_APPROVE) {
      // if (fileInfo.base64URL) {
      if (fileUploadList.length > 0) {
        setConfirmModelExit(true);
      } else {
        dispatch(updateAddItemsState({}));
        setOpen(false);
        onClickClose();
      }
    } else {
      dispatch(updateAddItemsState({}));
      setOpen(false);
      onClickClose();
    }
  };

  const [openModelAddTote, setOpenModelAddTote] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openDropdown = Boolean(anchorEl);

  const [openModelAddItems, setOpenModelAddItems] = React.useState(false);

  const handleClickAddItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };

  const handleOpenTote = () => {
    setOpenModelAddTote(true);
    setAnchorEl(null);
  };

  const handleOpenAddItem = () => {
    setOpenModelAddItems(true);
    setAnchorEl(null);
  };

  const handleCloseModelAddTote = () => {
    setOpenModelAddTote(false);
  };

  const handleUpdateToteNo = (toteNo: string) => {
    setToteNo(toteNo);
  };

  const handleModelAddItems = async () => {
    setOpenModelAddItems(false);
  };

  const [uploadFileFlag, setUploadFileFlag] = React.useState(false);
  const handleOnChangeUploadFile = (status: boolean) => {
    setUploadFileFlag(status);
  };

  const onDeleteAttachFileOld = (item: any) => {
    const fileKeyDel = item.fileKey;
  };

  return (
    <div>
      <Dialog open={open} maxWidth="xl" fullWidth={true}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          <Typography sx={{ fontSize: '1em' }}>รายละเอียดใบตรวจสอบการรับ-โอนสินค้า</Typography>
        </BootstrapDialogTitle>

        <DialogContent>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2">เลขที่เอกสาร:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">{docRefNo}</Typography>
              </Grid>
              <Grid item lg={2}>
                <Typography variant="body2">เลข Tote:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">{orderDetail.toteCode ? orderDetail.toteCode : '-'}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2">เลขที่เอกสาร SD:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">{orderDetail.sdNo}</Typography>
              </Grid>
              <Grid item lg={2}>
                <Typography variant="body2">สถานะ:</Typography>
              </Grid>
              <Grid item lg={4}>
                {/* <Typography variant="body2">{shipmentStatusText}</Typography> */}
                <Typography variant="body2">{getShipmentStatusText(orderDetail.sdStatus)}</Typography>
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
                <Typography variant="body2">ประเภท:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">{getShipmentTypeText(orderDetail.sdType)}</Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2} mb={1}>
              <Grid item lg={6}></Grid>
              <Grid item lg={2}>
                {orderDetail.sdStatus === ShipmentDeliveryStatusCodeEnum.STATUS_APPROVE && (
                  <Typography variant="body2">ใบผลต่างหลังเซ็นต์:</Typography>
                )}

                {orderDetail.sdImageFile !== '' &&
                  orderDetail.sdImageFile !== 'temp' &&
                  orderDetail.sdStatus === ShipmentDeliveryStatusCodeEnum.STATUS_CLOSEJOB && (
                    <Typography variant="body2">ใบผลต่างหลังเซ็นต์:</Typography>
                  )}
              </Grid>
              <Grid item lg={4}>
                {orderDetail.sdStatus === ShipmentDeliveryStatusCodeEnum.STATUS_APPROVE && !statusOC && (
                  <AccordionUploadFile
                    files={[]}
                    docNo=""
                    docType=""
                    isStatus={uploadFileFlag}
                    onChangeUploadFile={handleOnChangeUploadFile}
                    enabledControl={true}
                    onDeleteAttachFile={onDeleteAttachFileOld}
                  />
                )}

                {orderDetail.sdStatus === ShipmentDeliveryStatusCodeEnum.STATUS_CLOSEJOB &&
                  orderDetail.files !== null && <AccordionHuaweiFile files={orderDetail.files} />}
              </Grid>
            </Grid>

            {orderDetail.Comment !== '' && (
              <Grid container spacing={2} mb={1}>
                <Grid item lg={2}>
                  <Typography variant="body2">อ้างอิง SD โอนลอย :</Typography>
                </Grid>
                <Grid item lg={4}>
                  <Typography variant="body2">
                    <u onClick={clickSelectedSDRef} style={{ cursor: 'pointer' }}>
                      {orderDetail.Comment}
                    </u>
                  </Typography>
                </Grid>
                <Grid item lg={6}></Grid>
              </Grid>
            )}
          </Box>

          {/* DisplayBtn */}
          <Box sx={{ marginTop: 4 }}>
            <Grid container spacing={2} display="flex" justifyContent="space-between">
              {/* <Grid item xl={2}> */}
              <Grid item xl={4}>
                {statusWaitApprove1 && orderDetail.sdType !== 1 && (
                  <>
                    <Typography
                      variant="body1"
                      align="center"
                      sx={{
                        color: '#FF0000',
                      }}
                    >
                      {sumDCPercent < DCPercent && `*จำนวนรับจริง ${sumDCPercent}% น้อยกว่าค่าที่กำหนด ${DCPercent}%*`}
                      {sumDCPercent > DCPercent && `*จำนวนรับจริง ${sumDCPercent}% มากกว่าค่าที่กำหนด ${DCPercent}%*`}
                    </Typography>
                  </>
                )}

                {!statusWaitApprove1 && (
                  <Button
                    id="btnPrint"
                    variant="contained"
                    color="secondary"
                    onClick={handlePrintBtn}
                    startIcon={<Print />}
                    className={classes.MbtnPrint}
                    style={{ textTransform: 'none' }}
                    sx={{ display: `${showCloseJobBtn || isAllowExportBtn ? 'none' : ''}` }}
                  >
                    พิมพ์ใบผลต่าง
                  </Button>
                )}

                {showSaveBtn && (
                  <Button
                    id="btnAddItem"
                    variant="contained"
                    color="secondary"
                    onClick={handleClickAddItem}
                    className={classes.MbtnAdd}
                    sx={{ display: `${!displayBranchGroup ? 'none' : ''}` }}
                    // disabled={newAddItemListArray.length === 0}
                    startIcon={<AddCircleOutlineIcon />}
                    endIcon={<KeyboardArrowDownIcon />}
                  >
                    เพิ่มสินค้า
                  </Button>
                )}

                <StyledMenu
                  id="demo-customized-menu"
                  MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                  }}
                  anchorEl={anchorEl}
                  open={openDropdown}
                  onClose={handleCloseDropdown}
                >
                  {showSdTypeTote && (
                    <MenuItem sx={{ color: '#446EF2' }} onClick={handleOpenTote}>
                      เพิ่ม Tote
                    </MenuItem>
                  )}
                  <MenuItem sx={{ color: '#446EF2' }} onClick={handleOpenAddItem}>
                    เพิ่มสินค้า
                  </MenuItem>
                </StyledMenu>
              </Grid>

              <Grid item>
                {showSaveBtn && (
                  <div>
                    <Button
                      id="btnSave"
                      variant="contained"
                      color="warning"
                      className={classes.MbtnSave}
                      onClick={handleSaveButton}
                      startIcon={<SaveIcon />}
                      style={{ width: 200 }}
                      sx={{ display: `${!displayBranchGroup ? 'none' : ''}` }}
                    >
                      บันทึก
                    </Button>

                    <Button
                      id="btnApprove"
                      variant="contained"
                      color="primary"
                      className={classes.MbtnApprove}
                      onClick={handleApproveBtn}
                      startIcon={<CheckCircleOutline />}
                      style={{ width: 200 }}
                      sx={{ display: `${!displayBranchGroup ? 'none' : ''}` }}
                    >
                      ยืนยัน
                    </Button>
                  </div>
                )}

                {showApproveBtn && (
                  <Button
                    id="btnClose"
                    variant="contained"
                    color="primary"
                    className={classes.MbtnClose}
                    onClick={handleCloseJobBtn}
                    startIcon={<BookmarkAdded />}
                    sx={{ display: `${!displayBranchGroup ? 'none' : ''}` }}
                  >
                    ปิดงาน
                  </Button>
                )}

                {statusOC && statusWaitApprove1 && (
                  <Button
                    id="btnApprove"
                    variant="contained"
                    color="primary"
                    className={classes.MbtnApprove}
                    onClick={handleApproveOCBtn}
                    startIcon={<CheckCircleOutline />}
                    style={{ width: 200 }}
                  >
                    อนุมัติ
                  </Button>
                )}
              </Grid>
            </Grid>
          </Box>

          <Box mt={2} bgcolor="background.paper">
            {!closeJobTote && (
              <div
                style={{ width: '100%', height: rowsEntries.length >= 8 ? '70vh' : 'auto' }}
                className={classes.MdataGridDetail}
              >
                {/* {!openTote && <CheckOrderDetailItems rowList={rowsEntries} />} */}
                <DataGrid
                  rows={rowsEntries}
                  columns={columns}
                  pageSize={pageSize}
                  onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                  rowsPerPageOptions={[10, 20, 50, 100]}
                  pagination
                  disableColumnMenu
                  autoHeight={rowsEntries.length >= 8 ? false : true}
                  scrollbarSize={10}
                  onCellFocusOut={handleEditItems}
                  // onCellOut={handleEditItems}
                  // onCellKeyDown={handleEditItems}
                  // onCellBlur={handleEditItems}
                />
              </div>
            )}

            {closeJobTote && (
              <div>
                <CheckOrderDetailListTote onOpenToteDetail={handleOpenModalTote} />
              </div>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {opensSD && (
        <CheckOrderSDRefDetail
          sdNo={sdNo}
          sdRefNo={orderDetail.Comment}
          shipmentNo={docRefNo}
          defaultOpen={opensSD}
          onClickClose={isClosSDModal}
        />
      )}

      {/* {openTote && <CheckOrderDetailTote defaultOpen={openTote} onClickClose={handleCloseDetailToteModal} />} */}

      {openOrderReceiveModal && (
        <OrderReceiveDetail
          defaultOpen={openOrderReceiveModal}
          onClickClose={handleCloseOrderReceiveModal}
          isTote={true}
          toteCodeNew={toteCode}
        />
      )}

      <ConfirmOrderShipment
        open={openModelConfirm}
        onClose={handleCloseModelConfirm}
        onUpdateShipmentStatus={handleShowSnackBar}
        shipmentNo={docRefNo}
        sdNo={orderDetail.sdNo}
        action={action}
        items={itemsDiffState}
        percentDiffType={false}
        percentDiffValue="0"
        // sumDCPercent={sumDCPercent}
        sumActualQty={sumActualQty}
        sumQuantityRef={sumQuantityRef}
        docType={docType}
        sdType={orderDetail.sdType}
      />

      <ConfirmExitModel
        open={confirmModelExit}
        onClose={handleNotExitModelConfirm}
        onConfirm={handleExitModelConfirm}
      />

      <ModalShowFile
        open={openModelPreviewDocument}
        onClose={handleModelPreviewDocument}
        url={getPathReportSD(orderDetail.sdNo)}
        statusFile={statusFile}
        sdImageFile={orderDetail.sdImageFile ? orderDetail.sdImageFile : ''}
        fileName={
          orderDetail.sdImageFilename
            ? orderDetail.sdImageFilename
            : formatFileNam(orderDetail.sdNo, orderDetail.sdStatus)
        }
        btnPrintName="พิมพ์ใบผลต่าง"
      />

      <AlertError open={openFailAlert} onClose={handleCloseFailAlert} textError={textFail} />

      <Snackbar open={showSnackBar} onClose={handleCloseSnackBar} isSuccess={snackbarStatus} contentMsg={contentMsg} />

      <LoadingModal open={openLoadingModal.open} />

      <AddToteModel open={openModelAddTote} onClose={handleCloseModelAddTote} updateToteNo={handleUpdateToteNo} />
      <ModalAddItems
        open={openModelAddItems}
        onClose={handleModelAddItems}
        requestBody={{
          skuCodes: [],
        }}
      ></ModalAddItems>
    </div>
  );
}
