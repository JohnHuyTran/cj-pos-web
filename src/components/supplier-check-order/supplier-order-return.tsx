import React, { useMemo } from 'react';
import { Button, Checkbox, DialogActions, DialogContent, DialogContentText, Grid, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import Box from '@mui/system/Box';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { BootstrapDialogTitle } from '../commons/ui/dialog-title';
import Steppers from '../commons/ui/steppers';

import { useStyles } from '../../styles/makeTheme';
import {
  DataGrid,
  GridColDef,
  GridColumnHeaderParams,
  GridRenderCellParams,
  GridRowData,
  GridRowId,
  useGridApiRef,
} from '@mui/x-data-grid';
import { useAppSelector } from '../../store/store';
import { PurchaseDetailEntries, PurchaseDetailInfo } from '../../models/supplier-check-order-model';
import AlertError from '../commons/ui/alert-error';
import { ErrorOutline } from '@mui/icons-material';
interface Props {
  isOpen: boolean;
  onClickClose: () => void;
}

const columns: GridColDef[] = [
  {
    field: 'index',
    headerName: 'ลำดับ',
    flex: 0.5,
    headerAlign: 'center',
    sortable: false,
    hide: true,
    renderHeader: (params) => <div>index</div>,
    renderCell: (params) => (
      <Box component='div' sx={{ paddingLeft: '20px' }}>
        {params.value}
      </Box>
    ),
  },
  {
    field: 'barcode',
    headerName: 'บาร์โค้ด',
    width: 200,
    flex: 0.7,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'productName',
    headerName: 'รายละเอียดสินค้า',
    headerAlign: 'center',
    minWidth: 220,
    flex: 1,
    sortable: false,
    renderCell: (params) => (
      <div>
        <Typography variant='body2'>{params.value}</Typography>
        <Typography color='textSecondary' sx={{ fontSize: 12 }}>
          {params.getValue(params.id, 'skuCode') || ''}
        </Typography>
      </div>
    ),
  },
  {
    field: 'qty',
    headerName: 'จำนวนที่รับ',
    width: 110,
    headerAlign: 'center',
    align: 'right',
    sortable: false,
  },
  {
    field: 'itemReturn',
    headerName: 'จำนวนที่คืน',
    width: 110,
    headerAlign: 'center',
    sortable: false,
    renderCell: (params: GridRenderCellParams) => (
      <div>
        <TextField
          variant='outlined'
          name='txnQtyReturn'
          type='number'
          inputProps={{ style: { textAlign: 'right' } }}
          value={params.value}
          onChange={(e) => {
            var qty: any =
              params.getValue(params.id, 'qty') &&
              params.getValue(params.id, 'qty') !== null &&
              params.getValue(params.id, 'qty') != undefined
                ? params.getValue(params.id, 'qty')
                : 0;
            var value = e.target.value ? parseInt(e.target.value, 10) : '0';
            // if (value > qty) value = qty;
            params.api.updateRows([{ ...params.row, itemReturn: value }]);
          }}
          disabled={params.getValue(params.id, 'isDraftStatus') ? true : false}
          autoComplete='off'
        />
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
];
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

function SupplierOrderReturn({ isOpen, onClickClose }: Props) {
  const classes = useStyles();

  const purchaseDetailList = useAppSelector((state) => state.supplierOrderDetail.purchaseDetail);

  const purchaseDetail: any = purchaseDetailList.data ? purchaseDetailList.data : null;
  const [purchaseDetailItems, setPurchaseDetailItems] = React.useState<PurchaseDetailEntries[]>(
    purchaseDetail.entries ? purchaseDetail.entries : []
  );

  const { apiRef, columns } = useApiRef();

  const [openAlert, setOpenAlert] = React.useState(false);
  const [textError, setTextError] = React.useState('');

  const [pageSize, setPageSize] = React.useState<number>(10);
  const [open, setOpen] = React.useState(isOpen);
  const [piStatus, setPiStatus] = React.useState(0);
  const [comment, setComment] = React.useState('');
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
  const [cols, setCols] = React.useState(columns);

  React.useEffect(() => {
    setPiStatus(0);
    if (piStatus != 0) {
      let newColumns = [...cols];
      newColumns[0]['hide'] = false;
      setCols(newColumns);
    }
  }, [open]);

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
      barcode: item.barcode,
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
      itemReturn: item.itemReturn ? item.itemReturn : 0,
      actualQtyAll: item.actualQtyAll,
    };
  });

  const handleClose = () => {
    onClickClose();
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const storeItem = () => {
    const rowsEdit: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
    let itemNotValid: boolean = false;
    rowsEdit.forEach((data: GridRowData) => {
      if (data.itemReturn > data.qty || data.itemReturn <= 0) {
        itemNotValid = true;
        return;
      }
    });
    if (itemNotValid) {
      setOpenAlert(true);
      setTextError('จำนวนที่คืนต้องมากกว่า 0 หรือ น้อยกว่า จำนวนที่รับ');
      const items: PurchaseDetailEntries[] = [];
      rowsEdit.forEach((data: GridRowData) => {
        const newData: PurchaseDetailEntries = {
          seqItem: data.seqItem,
          produtStatus: data.produtStatus,
          isDraftStatus: piStatus === 0 ? false : true,
          isControlStock: data.isControlStock,
          isAllowDiscount: data.isAllowDiscount,
          skuCode: data.skuCode,
          barcode: data.barcode,
          productName: data.productName,
          unitCode: data.unitCode,
          unitName: data.unitName,
          qty: data.qty,
          qtyAll: data.qtyAll,
          controlPrice: data.controlPrice,
          salePrice: data.salePrice,
          setPrice: data.setPrice,
          sumPrice: data.sumPrice,
          actualQty: data.actualQty,
          itemReturn: data.itemReturn,
          actualQtyAll: data.actualQtyAll,
        };
        items.push(newData);
      });
      setPurchaseDetailItems(items);
    }
  };

  const handleSaveBtn = async () => {
    storeItem();
    // call api
  };

  const handleConfirmBtn = () => {
    storeItem();
  };

  const handleDeleteBtn = () => {
    const rowsEdit: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
    const rowSelect = apiRef.current.getSelectedRows();
    if (rowSelect.size === rowsEdit.size) {
      setOpenAlert(true);
      setTextError('ไม่สามารถลบรายการทั้งหมดได้');
      return;
    }

    console.log('befor: ', rowsEdit);
    rowSelect.forEach((data: GridRowData, key) => {
      rowsEdit.delete(key);
    });
    console.log('after: ', rowsEdit);
    //

    //
    const items: PurchaseDetailEntries[] = [];
    rowsEdit.forEach((data: GridRowData) => {
      const newData: PurchaseDetailEntries = {
        seqItem: data.seqItem,
        produtStatus: data.produtStatus,
        isDraftStatus: piStatus === 0 ? false : true,
        isControlStock: data.isControlStock,
        isAllowDiscount: data.isAllowDiscount,
        skuCode: data.skuCode,
        barcode: data.barcode,
        productName: data.productName,
        unitCode: data.unitCode,
        unitName: data.unitName,
        qty: data.qty,
        qtyAll: data.qtyAll,
        controlPrice: data.controlPrice,
        salePrice: data.salePrice,
        setPrice: data.setPrice,
        sumPrice: data.sumPrice,
        actualQty: data.actualQty,
        itemReturn: data.itemReturn,
        actualQtyAll: data.actualQtyAll,
        deleteStatus: false,
      };
      items.push(newData);
    });
    setPurchaseDetailItems([]);
    setPurchaseDetailItems(items);
    // if (countIsDelete === rowsEdit.size) {
    //   setOpenAlert(true);
    //   setTextError('ไม่สามารถลบรายการทั้งหมดได้');
    //   setPurchaseDetailItems([]);
    //   setPurchaseDetailItems(itemsDelete);
    // } else {
    //   setPurchaseDetailItems([]);
    //   setPurchaseDetailItems(itemsNoDelete);
    // }
  };

  return (
    <div>
      {' '}
      <Dialog open={open} maxWidth='xl' fullWidth={true}>
        <BootstrapDialogTitle id='customized-dialog-title' onClose={handleClose}>
          <Typography sx={{ fontSize: '1em' }}>ใบคืนสินค้า</Typography>
          <Steppers status={piStatus}></Steppers>
        </BootstrapDialogTitle>
        <DialogContent>
          <Box mt={4} sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={2}>
                <Typography variant='body2'>เลขที่เอกสาร PN</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant='body2'>
                  {' '}
                  <TextField
                    id='txtDocPN'
                    name='paramQuery'
                    size='small'
                    value='xxxx'
                    className={classes.MtextFieldNumber}
                    disabled
                    sx={{ background: '#EAEBEB' }}
                  />
                </Typography>
              </Grid>
              <Grid item lg={2}>
                <Typography variant='body2'>ผู้จำหน่าย</Typography>
              </Grid>
              <Grid item lg={4}>
                <div
                  style={{
                    border: '1px solid #CBD4DB',
                    borderRadius: 5,
                    maxWidth: 250,
                    background: '#EAEBEB',
                    padding: 2,
                  }}>
                  <Typography variant='body2' sx={{ color: '#263238' }}>
                    {purchaseDetail.supplierName}
                  </Typography>
                  <Typography variant='body2' sx={{ color: '#AEAEAE', fontSize: 12 }}>
                    {purchaseDetail.supplierTaxNo}
                  </Typography>
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={2}>
                <Typography variant='body2'>เลขที่เอกสาร PI :</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant='body2'>{purchaseDetail.piNo}</Typography>
              </Grid>
              <Grid item lg={2}>
                <Typography variant='body2'>แนบเอกสารจากผู้จำหน่าย :</Typography>
              </Grid>
              <Grid item lg={4}>
                <Button
                  id='btnAttachedFile'
                  color='primary'
                  variant='contained'
                  component='span'
                  className={classes.MbtnBrowse}
                  // style={{ marginLeft: 10, textTransform: "none" }}
                  disabled>
                  แนบไฟล์
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Grid
            item
            container
            xs={12}
            sx={{ mt: 3 }}
            justifyContent='space-between'
            direction='row'
            alignItems='flex-end'>
            <Grid item xl={2}>
              <Button
                id='btnSave'
                variant='contained'
                color='secondary'
                className={classes.MbtnSave}
                onClick={handleDeleteBtn}
                startIcon={<DeleteIcon />}
                sx={{ width: 200 }}>
                ลบรายการ
              </Button>
            </Grid>
            <Grid item>
              <Button
                id='btnSave'
                variant='contained'
                color='warning'
                className={classes.MbtnSave}
                onClick={handleSaveBtn}
                startIcon={<SaveIcon />}
                sx={{ width: 200 }}>
                บันทึก
              </Button>

              <Button
                id='btnApprove'
                variant='contained'
                color='primary'
                className={classes.MbtnApprove}
                onClick={handleConfirmBtn}
                startIcon={<CheckCircleOutline />}
                sx={{ width: 200 }}>
                ยืนยัน
              </Button>
            </Grid>
          </Grid>
          <Box mt={2} bgcolor='background.paper'>
            <div
              style={{ width: '100%', height: rows.length >= 8 ? '70vh' : 'auto' }}
              className={classes.MdataGridDetail}>
              <DataGrid
                rows={rows}
                columns={cols}
                checkboxSelection={piStatus === 0 ? true : false}
                disableSelectionOnClick
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[10, 20, 50, 100]}
                pagination
                disableColumnMenu
                autoHeight={rows.length >= 8 ? false : true}
                scrollbarSize={10}
                rowHeight={65}
              />
            </div>
          </Box>
          <Box>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={4}>
                <Typography variant='body2'>หมายเหตุ:</Typography>
                <TextField
                  multiline
                  fullWidth
                  rows={5}
                  onChange={handleChangeComment}
                  defaultValue={comment}
                  placeholder='ความยาวไม่เกิน 255 ตัวอักษร'
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
                    // marginTop: "-1.5em",
                  }}>
                  {characterCount}/{maxCommentLength}
                </div>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
      <AlertError open={openAlert} onClose={handleCloseAlert} textError={textError} />
    </div>
  );
}

export default SupplierOrderReturn;
