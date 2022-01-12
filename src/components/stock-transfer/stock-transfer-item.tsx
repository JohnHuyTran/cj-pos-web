import React, { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  useGridApiRef,
  GridRowId,
  GridRowData,
  GridValueGetterParams,
  GridCellParams,
} from '@mui/x-data-grid';
import { GridEditCellValueParams } from '@material-ui/data-grid';
import { Box } from '@material-ui/core';
import { useStyles } from '../../styles/makeTheme';
import { TextField, Typography } from '@mui/material';
import { DeleteForever } from '@mui/icons-material';
import { updateItemsState } from '../../store/slices/supplier-add-items-slice';

export interface DataGridProps {
  id: string;
  onChangeItems: (items: Array<any>) => void;
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
      <Box component="div" sx={{ paddingLeft: '20px' }}>
        {params.value}
      </Box>
    ),
  },
  {
    field: 'barCode',
    headerName: 'บาร์โค้ด',
    minWidth: 200,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'barcodeName',
    headerName: 'รายการสินค้า',
    headerAlign: 'center',
    minWidth: 300,
    flex: 2,
    sortable: false,
    renderCell: (params) => (
      <div>
        <Typography variant="body2">{params.value}</Typography>
        <Typography color="textSecondary" sx={{ fontSize: 12 }}>
          {params.getValue(params.id, 'skuCode') || ''}
        </Typography>
      </div>
    ),
  },
  {
    field: 'qty',
    headerName: 'จำนวนที่สั่ง',
    minWidth: 150,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
    renderCell: (params: GridRenderCellParams) => (
      <TextField
        variant="outlined"
        name="txnQuantity"
        type="number"
        inputProps={{ style: { textAlign: 'right' } }}
        value={params.value}
        onChange={(e) => {
          var value = e.target.value ? parseInt(e.target.value, 10) : '';
          if (value < 0) value = 0;
          //   var qty = Number(params.getValue(params.id, 'qty'));
          //   var piType = Number(params.getValue(params.id, 'piType'));
          //   if (piType === 0 && value > qty) value = qty;
          params.api.updateRows([{ ...params.row, qty: value }]);
        }}
        // disabled={isDisable(params) ? true : false}
        autoComplete="off"
      />
    ),
  },
  {
    field: 'unitName',
    headerName: 'หน่วย',
    minWidth: 150,
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
    renderCell: () => {
      return <DeleteForever fontSize="medium" sx={{ color: '#F54949' }} />;
    },
  },
];

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

// export const StockTransferItem = (onChangeItems, props: DataGridProps) => {
// const { onChangeItems, ...other } = props;

function StockTransferItem({ onChangeItems }: DataGridProps) {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const payloadAddItem = useAppSelector((state) => state.addItems.state);

  let rows: any = [];
  if (Object.keys(payloadAddItem).length !== 0) {
    rows = payloadAddItem.map((item: any, index: number) => {
      console.log('item:', JSON.stringify(item));

      return {
        id: `${item.barcode}-${index + 1}`,
        index: index + 1,
        skuCode: item.skuCode,
        barCode: item.barcode,
        barcodeName: item.barcodeName,
        unitCode: item.unitCode,
        unitName: item.unitName,
        qty: item.qty ? item.qty : 0,
      };
    });
  }
  const [pageSize, setPageSize] = React.useState<number>(10);

  const { apiRef, columns } = useApiRef();
  const handleEditItems = async (params: GridEditCellValueParams) => {
    if (params.field === 'qty') {
      const itemsList: any = [];
      if (rows.length > 0) {
        const rows: Map<GridRowId, GridRowData> = apiRef.current.getRowModels();
        await rows.forEach((data: GridRowData) => {
          itemsList.push(data);
        });
      }

      console.log('itemsList:', JSON.stringify(itemsList));
      return onChangeItems(itemsList ? itemsList : []);
    }
    // const updateStateRows = async (items: any) => {
    //   await dispatch(updateItemsState(items));
    // };
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
      />
    </div>
  );
}

export default StockTransferItem;
