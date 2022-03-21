import React, { useEffect, useMemo, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/store';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { HighlightOff } from '@mui/icons-material';
import {
  getShipmentStatusText,
  getShipmentTypeText,
  ShipmentDeliveryStatusCodeEnum,
} from '../../utils/enum/check-order-enum';
import { convertUtcToBkkDate } from '../../utils/date-utill';
import {
  DataGrid,
  GridColDef,
  GridEditCellValueParams,
  GridRenderCellParams,
  GridRowData,
  GridRowId,
  GridValueGetterParams,
  useGridApiRef,
} from '@mui/x-data-grid';
import { itemsDetail } from '../../models/order-model';
import { updateAddItemsState } from '../../store/slices/add-items-slice';
import { useStyles } from '../../styles/makeTheme';

export interface CheckOrderDetailToteProps {
  defaultOpen: boolean;
  onClickClose: any;
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

function CheckOrderDetailTote({ defaultOpen, onClickClose }: CheckOrderDetailToteProps) {
  const { apiRef, columns } = useApiRef();
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const payloadAddItem = useAppSelector((state) => state.addItems.state);
  const orderDetails = useAppSelector((state) => state.checkOrderDetail.orderDetail);
  const orderDetail: any = orderDetails.data ? orderDetails.data : null;

  const [open, setOpen] = React.useState(defaultOpen);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [shipmentStatusText, setShipmentStatusText] = useState<string | undefined>('');
  const [shipmentTypeText, setShipmentTypeText] = useState<string | undefined>('');
  const [shipmentDateFormat, setShipmentDateFormat] = useState<string | undefined>('');
  const [statusClosed, setStatusClosed] = useState<boolean>(false);

  console.log('orderDetail: ', orderDetail);

  useEffect(() => {
    setShipmentStatusText(getShipmentStatusText(orderDetail.sdStatus));
    setShipmentTypeText(getShipmentTypeText(orderDetail.sdType));
    setShipmentDateFormat(convertUtcToBkkDate(orderDetail.receivedDate));
    setStatusClosed(orderDetail.sdStatus === ShipmentDeliveryStatusCodeEnum.STATUS_CLOSEJOB);
  }, [open]);

  const handleClose = async () => {
    setOpen(false);
    onClickClose();
  };

  const updateState = async (items: any) => {
    await dispatch(updateAddItemsState(items));
  };

  let entries: itemsDetail[] = orderDetail.items ? orderDetail.items : [];
  if (entries.length > 0 && Object.keys(payloadAddItem).length === 0) {
    updateState(entries);
  }
  let rowsEntries: any = [];
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
    <div>
      <Dialog open={open} maxWidth="xl" fullWidth={true}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          <Typography sx={{ fontSize: '1em' }}>รายละเอียดตรวจสอบการรับ-โอนสินค้า</Typography>
        </BootstrapDialogTitle>

        <DialogContent>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2">เลขที่เอกสาร:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">{orderDetail.docRefNo ? orderDetail.docRefNo : '-'}</Typography>
              </Grid>
              <Grid item lg={2}>
                <Typography variant="body2">เลข Tote:</Typography>
              </Grid>
              <Grid item lg={4}>
                {/* <Typography variant="body2">{shipmentStatusText}</Typography> */}
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
                <Typography variant="body2">{shipmentStatusText}</Typography>
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
                <Typography variant="body2">{shipmentTypeText}</Typography>
              </Grid>
            </Grid>
          </Box>

          {/* DisplayBtn */}
          <Box sx={{ marginTop: 4 }}>
            <Grid container spacing={2} display="flex" justifyContent="space-between">
              <Grid item xl={4}>
                {/* {!statusWaitApprove1 && (
                  <Button
                    id="btnPrint"
                    variant="contained"
                    color="secondary"
                    onClick={handlePrintBtn}
                    startIcon={<Print />}
                    className={classes.MbtnPrint}
                    style={{ textTransform: 'none' }}
                    sx={{ display: `${showCloseJobBtn ? 'none' : ''}` }}
                  >
                    พิมพ์ใบผลต่าง
                  </Button>
                )} */}

                {/* {showSaveBtn && (
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
                )} */}

                {/* <StyledMenu
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
                </StyledMenu> */}
              </Grid>

              {/* <Grid item>
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
              </Grid> */}
            </Grid>
          </Box>

          <Box mt={2} bgcolor="background.paper">
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
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CheckOrderDetailTote;
