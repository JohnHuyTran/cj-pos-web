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
import { featchOrderDetailAsync } from '../../store/slices/check-order-detail-slice';
import Snackbar from '../commons/ui/snackbar-status';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { styled } from '@mui/material/styles';
import AddToteModel from '../check-orders/add-tote-model';
import { updateAddItemsState } from '../../store/slices/add-items-slice';
import ModalAddItems from '../commons/ui/modal-add-items';
import { isGroupBranch } from '../../utils/role-permission';
import { getUserInfo } from '../../store/sessionStore';
import { getBranchName } from '../../utils/utils';
import { PERMISSION_GROUP } from '../../utils/enum/permission-enum';
import theme from '../../styles/theme';
import { env } from '../../adapters/environmentConfigs';
import CheckOrderDetailListTote from '../check-orders/check-order-detail-list-tote';
import CheckOrderDetailTote from './check-order-detail-tote';
import { couldStartTrivia } from 'typescript';
import OrderReceiveDetail from './order-receive-detail';
import { searchToteAsync } from '../../store/slices/search-tote-slice';

interface loadingModalState {
  open: boolean;
}
export interface CheckOrderItemProps {
  onchengItem?: (items: Array<any>) => void;
  rowList: Array<any>;
}

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
          var value = e.target.value ? parseInt(e.target.value, 10) : '';
          if (value < 0) value = 0;

          params.api.updateRows([{ ...params.row, actualQty: value }]);
        }}
        onBlur={(e) => {
          // isAllowActualQty(params, parseInt(e.target.value, 10));
          params.api.updateRows([{ ...params.row, actualQty: e.target.value }]);
        }}
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

export default function CheckOrderDetailItems({ onchengItem, rowList }: CheckOrderItemProps) {
  const classes = useStyles();
  const sdRef = useAppSelector((state) => state.checkOrderSDList.orderList);
  const payloadSearchOrder = useAppSelector((state) => state.saveSearchOrder.searchCriteria);
  const dispatch = useAppDispatch();
  const orderDetails = useAppSelector((state) => state.checkOrderDetail.orderDetail);
  const orderDetail: any = orderDetails.data ? orderDetails.data : null;
  // const [open, setOpen] = React.useState(defaultOpen);
  const { apiRef, columns } = useApiRef();
  const [showSaveBtn, setShowSaveBtn] = React.useState(false);
  const [showApproveBtn, setShowApproveBtn] = React.useState(false);
  const [statusWaitApprove1, setStatusWaitApprove1] = React.useState(false);
  const [showCloseJobBtn, setShowCloseJobBtn] = React.useState(false);
  const [closeJobTote, setCloseJobTote] = React.useState(false);
  const [validationFile, setValidationFile] = React.useState(false);
  const [isDisplayActBtn, setIsDisplayActBtn] = React.useState('');
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

  useEffect(() => {}, []);

  const [sumDCPercent, setSumDCPercent] = React.useState(0);
  const handleCalculateDCPercent = async (sumActualQty: number, sumQuantityRef: number) => {
    let sumPercent: number = (sumActualQty * 100) / sumQuantityRef;
    sumPercent = Math.trunc(sumPercent); //remove decimal

    setSumDCPercent(sumPercent);
  };

  const updateState = async (items: any) => {
    await dispatch(updateAddItemsState(items));
  };

  let rowsEntries: any = [];

  // if ((openTote && !openOrderReceiveModal) || (!openTote && openOrderReceiveModal)) {
  //   if (Object.keys(payloadAddItem).length !== 0) dispatch(updateAddItemsState({}));
  // } else {

  //   }
  // }
  // let entries: itemsDetail[] = orderDetail.items ? orderDetail.items : [];
  // if (entries.length > 0 && Object.keys(payloadAddItem).length === 0) {
  //   updateState(entries);
  // }

  // if (Object.keys(payloadAddItem).length !== 0) {
  rowsEntries = rowList.map((item: any, index: number) => {
    // let qtyRef: number = 0;
    // let actualQty: number = 0;

    // if (item.id !== null && item.id !== undefined) {
    //   qtyRef = Number(item.qtyRef) ? Number(item.qtyRef) : 0;
    //   actualQty = Number(item.qty) ? Number(item.qty) : Number(item.actualQty) ? Number(item.actualQty) : 0;
    // } else {
    //   qtyRef = Number(item.qty);
    //   actualQty = Number(item.actualQty);
    // }

    return {
      rowOrder: index + 1,
      id: `${item.deliveryOrderNo}${item.barcode}_${index}`,
      deliveryOrderNo: item.deliveryOrderNo,
      isTote: item.isTote ? item.isTote : false,
      sdStatus: item.sdStatus,
      skuCode: item.skuCode,
      barcode: item.barcode,
      productName: item.productName,
      unitName: item.unitName,
      qtyRef: item.qtyRef,
      actualQty: item.actualQty,
      qtyDiff: item.qtyDiff,
      comment: item.comment,
    };
  });
  // }

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

  return (
    <div
      style={{ width: '100%', height: rowsEntries.length >= 8 ? '70vh' : 'auto' }}
      className={classes.MdataGridDetail}
    >
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
  );
}
