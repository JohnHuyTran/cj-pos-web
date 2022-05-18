import React, { useMemo } from 'react';
import { useAppSelector } from '../../../store/store';
import {
  DataGrid,
  GridColDef,
  GridEditCellValueParams,
  GridRenderCellParams,
  GridRowData,
  GridRowId,
  useGridApiRef,
} from '@mui/x-data-grid';
import { Box } from '@mui/system';
import { useStyles } from '../../../styles/makeTheme';
import { TextField, Typography } from '@mui/material';
import { DeleteForever } from '@mui/icons-material';

export interface DataGridProps {
  // type: string;
  // edit: boolean;
  onChangeItems: (items: Array<any>) => void;
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
    align: 'right',
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
        onChange={(e) => {
          let orderQty = Number(params.getValue(params.id, 'orderQty'));
          let orderMaxQty = Number(params.getValue(params.id, 'orderMaxQty'));

          var value = e.target.value ? parseInt(e.target.value, 10) : '';
          if (orderQty === 0) value = chkQty(value);
          if (value < 0) value = 0;
          else if (value > 0) chkOrderMaxQty(value, orderMaxQty);

          console.log('orderQty:', orderQty);
          console.log('value:', value);

          params.api.updateRows([{ ...params.row, orderQty: value }]);
        }}
        // disabled={params.getValue(params.id, 'editMode') ? false : true}
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
      // <div>
      //   {params.getValue(params.id, 'editMode') && <DeleteForever fontSize='medium' sx={{ color: '#F54949' }} />}
      // </div>
      <div>
        <DeleteForever fontSize='medium' sx={{ color: '#F54949' }} />
      </div>
    ),
  },
];

const chkQty = (value: any) => {
  let v = String(value);
  if (v.substring(1) === '0') return Number(v.substring(0, 1));
  return value;
};

const chkOrderMaxQty = (value: any, orderMaxQty: any) => {
  if (value > orderMaxQty) {
    console.log('chkOrderMaxQty value:', value);
    console.log('chkOrderMaxQty orderMaxQty:', orderMaxQty);
    return orderMaxQty;
  }
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

function PurchaseBranchListItem({ onChangeItems }: DataGridProps) {
  const classes = useStyles();

  let rows: any = [];
  const [pageSize, setPageSize] = React.useState<number>(10);

  const payloadAddItem = useAppSelector((state) => state.addItems.state);
  // console.log('payloadAddItem xx:', JSON.stringify(payloadAddItem));

  if (Object.keys(payloadAddItem).length !== 0) {
    rows = payloadAddItem.map((item: any, index: number) => {
      return {
        id: index,
        index: index + 1,
        barcode: item.barcode,
        barcodeName: item.barcodeName,
        orderQty: item.qty ? item.qty : 1,
        orderMaxQty: item.stockMax,
        unitName: item.unitName,
      };
    });
  }

  const { apiRef, columns } = useApiRef();
  const handleEditItems = async (params: GridEditCellValueParams) => {
    if (params.field === 'orderQty') {
      const itemsList: any = [];
      if (rows.length > 0) {
        const rows: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
        await rows.forEach((data: GridRowData) => {
          itemsList.push(data);
        });

        console.log('rows:', JSON.stringify(rows));
      }

      console.log('itemsList:', JSON.stringify(itemsList));

      return onChangeItems(itemsList ? itemsList : []);
    }
  };

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
        onCellFocusOut={handleEditItems}
        // onCellOut={handleEditItems}
        onCellKeyDown={handleEditItems}
      />
    </div>
  );
}

export default PurchaseBranchListItem;
