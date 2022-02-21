import React, { useEffect } from 'react';
import { useStyles } from '../../styles/makeTheme';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { numberWithCommas } from '../../utils/utils';
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';

import { useAppDispatch, useAppSelector } from '../../store/store';
import { Item, Item_ } from '../../models/stock-transfer-model';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';

function BranchTransferListItem() {
  const classes = useStyles();

  const dispatch = useAppDispatch();
  const branchTransferRslList = useAppSelector((state) => state.branchTransferDetailSlice.branchTransferRs);
  const reasonsList = useAppSelector((state) => state.transferReasonsList.reasonsList.data);
  const branchList = useAppSelector((state) => state.searchBranchSlice).branchList.data;
  const payloadSearch = useAppSelector((state) => state.saveSearchStock.searchStockTransfer);

  const branchTransferInfo: any = branchTransferRslList.data ? branchTransferRslList.data : null;
  const [branchTransferItems, setBranchTransferItems] = React.useState<Item[]>(
    branchTransferInfo.items ? branchTransferInfo.items : []
  );
  const [isDraft, setIsDraft] = React.useState(false);

  const [pageSize, setPageSize] = React.useState<number>(10);

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: 'ลำดับ',
      minWidth: 70,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <Box component='div' sx={{ paddingLeft: '20px' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'barcode',
      headerName: 'บาร์โค้ด',
      minWidth: 200,
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
        </div>
      ),
    },
    {
      field: 'orderQty',
      headerName: 'จำนวนที่สั่ง',
      minWidth: 120,
      headerAlign: 'center',
      align: 'right',
      sortable: false,
      renderCell: (params) => numberWithCommas(params.value),
    },
    {
      field: 'unitName',
      headerName: 'หน่วย',
      minWidth: 110,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'actualQty',
      headerName: 'จำนวนโอนจริง',
      minWidth: 120,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <div>
          <TextField
            variant='outlined'
            name='txnActualQty'
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
              var returnQty = Number(params.getValue(params.id, 'actualQty'));
              if (returnQty === 0) value = chkReturnQty(value);
              if (value < 0) value = 0;
              params.api.updateRows([{ ...params.row, actualQty: value }]);
            }}
            disabled={params.getValue(params.id, 'isDraft') ? false : true}
            autoComplete='off'
          />
        </div>
      ),
    },
    {
      field: 'toteCode',
      headerName: 'เลข Tote/ลัง',
      minWidth: 120,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <TextField
          variant='outlined'
          name='txbToteCode'
          inputProps={{ style: { textAlign: 'right' } }}
          value={params.value}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            const cursorStart = e.target.selectionStart;
            const cursorEnd = e.target.selectionEnd;
            params.api.updateRows([{ ...params.row, toteCode: e.target.value }]);
            e.target.setSelectionRange(cursorStart, cursorEnd);
          }}
          disabled={params.getValue(params.id, 'isDraft') ? false : true}
          autoComplete='off'
        />
      ),
    },
    {
      field: 'boNo',
      headerName: 'เลขที่ BO',
      minWidth: 200,
      flex: 0.7,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
    },
  ];

  const chkReturnQty = (value: any) => {
    let v = String(value);
    if (v.substring(1) === '0') return Number(v.substring(0, 1));
    return value;
  };

  const currentlySelected = () => {};

  let rows = branchTransferItems.map((item: Item_, index: number) => {
    return {
      id: `${item.barcode}-${index + 1}`,
      index: index + 1,
      seqItem: item.seqItem,
      barcode: item.barcode,
      productName: item.productName,
      skuCode: item.skuCode,
      barFactor: item.barFactor,
      unitCode: item.unitCode ? item.unitCode : 0,
      unitName: item.unitName,
      orderQty: item.orderQty ? item.orderQty : 0,
      actualQty: item.actualQty ? item.actualQty : 0,
      toteCode: item.toteCode,
      isDraft: isDraft,
      boNo: item.boNo,
    };
  });

  React.useEffect(() => {
    setIsDraft(branchTransferInfo.status === 'CREATED' ? true : false);
    let newColumns = [...columns];
    if (branchTransferInfo.status != 'CREATED') {
      newColumns[7]['hide'] = false;
    } else {
      newColumns[7]['hide'] = true;
    }
  }, []);
  return (
    <Box mt={2} bgcolor='background.paper'>
      <Typography>รายการสินค้า: รายการสินค้าทั้งหมด</Typography>
      <FormGroup>
        <FormControlLabel control={<Checkbox defaultChecked />} label='รายการสินค้าทั้งหมด' />
      </FormGroup>
      <div style={{ width: '100%', height: rows.length >= 8 ? '70vh' : 'auto' }} className={classes.MdataGridDetail}>
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
  );
}
export default BranchTransferListItem;
