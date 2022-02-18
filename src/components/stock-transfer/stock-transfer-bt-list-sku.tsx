import React from 'react';
import { useStyles } from '../../styles/makeTheme';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { numberWithCommas } from '../../utils/utils';
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';

import { useAppDispatch, useAppSelector } from '../../store/store';
import { Item } from '../../models/stock-transfer-model';
import Done from '@mui/icons-material/Done';
function BranchTransferListSKU() {
  const classes = useStyles();

  const dispatch = useAppDispatch();
  const branchTransferRslList = useAppSelector((state) => state.branchTransferDetailSlice.branchTransferRs);

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
      field: 'remainStock',
      headerName: 'สต๊อกสินค้าคงเหลือ',
      minWidth: 200,
      headerAlign: 'center',
      align: 'right',
      sortable: false,
      renderCell: (params) => numberWithCommas(params.value),
    },
    {
      field: 'orderQty',
      headerName: 'สั่ง(ชิ้น)',
      minWidth: 200,
      headerAlign: 'center',
      sortable: false,
      align: 'right',
      renderCell: (params: GridRenderCellParams) => {
        return numberWithCommas(calUnitFactor(params));
      },
    },
    {
      field: 'unitFactor',
      headerName: 'จัด(ชิ้น)',
      minWidth: 200,
      headerAlign: 'center',
      sortable: false,
      align: 'right',
      renderCell: (params: GridRenderCellParams) => {
        return numberWithCommas(calUnitFactor(params));
      },
    },
    {
      field: 'unitDiff',
      headerName: 'ส่วนต่าง',
      minWidth: 200,
      headerAlign: 'center',
      sortable: false,
      align: 'right',
      renderCell: (params: GridRenderCellParams) => calProductDiff(params),
    },
  ];

  const chkReturnQty = (value: any) => {
    let v = String(value);
    if (v.substring(1) === '0') return Number(v.substring(0, 1));
    return value;
  };
  var calUnitFactor = function (params: GridValueGetterParams) {
    let diff = Number(params.getValue(params.id, 'actualQty')) * Number(params.getValue(params.id, 'baseUnit'));
    return diff;
  };

  var calProductDiff = function (params: GridValueGetterParams) {
    let diff = Number(params.getValue(params.id, 'actualQty')) * Number(params.getValue(params.id, 'baseUnit'));

    if (diff !== 0) return <label style={{ color: '#F54949', fontWeight: 700 }}> {diff} </label>;
    return diff;
  };

  const currentlySelected = () => {};

  let rows = branchTransferItems.map((item: Item, index: number) => {
    return {
      id: `${item.barcode}-${index + 1}`,
      index: index + 1,
      seqItem: item.seqItem,
      barcode: item.barcode,
      productName: item.productName,
      skuCode: item.skuCode,
      baseUnit: item.baseUnit ? item.baseUnit : 0,
      unitName: item.unitName,
      remainStock: item.remainStock ? item.remainStock : 0,
      qty: item.qty ? item.qty : 0,
      actualQty: item.actualQty ? item.actualQty : 0,
      toteCode: item.toteCode,
      isDraft: isDraft,
      boNo: item.boNo,
    };
  });

  return (
    <Box mt={2} bgcolor='background.paper'>
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

export default BranchTransferListSKU;
