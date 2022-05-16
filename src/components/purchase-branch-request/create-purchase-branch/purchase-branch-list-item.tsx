import React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box } from '@mui/system';
import { useStyles } from '../../../styles/makeTheme';
import { Checkbox, FormControlLabel, FormGroup, Grid, TextField, Typography } from '@mui/material';
import { DeleteForever } from '@mui/icons-material';

export interface DataGridProps {
  // type: string;
  // edit: boolean;
  // onChangeItems: (items: Array<any>) => void;
  // // changeItems: (chang: Boolean) => void;
  // update: boolean;
  // status: string;
  // skuCode: string;
  // skuName: string;
}

const columns: GridColDef[] = [
  {
    field: 'index',
    headerName: 'ลำดับ',
    width: 80,
    headerAlign: 'center',
    disableColumnMenu: true,
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
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'barcodeName',
    headerName: 'รายละเอียดสินค้า',
    headerAlign: 'center',
    minWidth: 300,
    flex: 2,
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
    field: 'orderMaxQty',
    headerName: 'จำนวนสั่งมากที่สุด',
    headerAlign: 'center',
    minWidth: 300,
    flex: 2,
    sortable: false,
  },
  {
    field: 'orderQty',
    headerName: 'จำนวน',
    minWidth: 150,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
    renderCell: (params: GridRenderCellParams) => (
      <TextField
        variant='outlined'
        name='txnQuantity'
        type='number'
        inputProps={{ style: { textAlign: 'right' } }}
        value={params.value}
        // onChange={(e) => {
        //   let qty = Number(params.getValue(params.id, 'qty'));
        //   var value = e.target.value ? parseInt(e.target.value, 10) : '';
        //   if (qty === 0) value = chkQty(value);
        //   if (value < 0) value = 0;
        //   params.api.updateRows([{ ...params.row, qty: value }]);
        // }}
        disabled={params.getValue(params.id, 'editMode') ? false : true}
        autoComplete='off'
      />
    ),
  },
  {
    field: 'unitName',
    headerName: 'หน่วย',
    minWidth: 120,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'delete',
    headerName: ' ',
    width: 40,
    minWidth: 0,
    align: 'right',
    sortable: false,
    renderCell: (params: GridRenderCellParams) => (
      <div>
        {params.getValue(params.id, 'editMode') && <DeleteForever fontSize='medium' sx={{ color: '#F54949' }} />}
      </div>
    ),
  },
];

function PurchaseBranchListItem({}: DataGridProps) {
  const classes = useStyles();

  let rows: any = [];
  const [pageSize, setPageSize] = React.useState<number>(10);

  return (
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
        // onCellClick={currentlySelected}
        // onCellFocusOut={handleEditItems}
        // onCellOut={handleEditItems}
        // onCellKeyDown={handleEditItems}
      />
    </div>
  );
}

export default PurchaseBranchListItem;
