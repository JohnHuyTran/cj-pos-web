import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';
import { useStyles } from '../../styles/makeTheme';
import { StockInfo } from '../../models/stock-model';
import { useAppSelector, useAppDispatch } from '../../store/store';

function StockBalanceLocation() {
  const classes = useStyles();
  const items = useAppSelector((state) => state.stockBalanceLocationSearchSlice.stockList);
  console.log('igtems: ', items);

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: 'ลำดับ',
      // minWidth: 75,
      flex: 0.65,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <Box component="div" sx={{ paddingLeft: '20px' }}>
          {params.value}
        </Box>
      ),
    },
  ];

  const rows = items.data.map((data: StockInfo, indexs: number) => {
    return {
      id: indexs,
      index: indexs + 1,
      barcode: data.barcode,
      barcodeName: data.barcodeName,
      skuCode: data.skuCode,
      skuName: data.skuName,
      storeCode: data.storeCode,
      storeName: data.storeName,
      locationCode: data.locationCode,
      locationName: data.locationName,
      availableQty: data.availableQty,
      unitCode: data.unitCode,
      unitName: data.unitName,
      minBeauty: data.minBeauty,
      maxBeauty: data.maxBeauty,
      barFactor: data.barFactor,
      // index: (cuurentPages - 1) * parseInt(pageSize) + indexs + 1,
    };
  });

  console.log('row: ', rows);
  return (
    <div>
      <Box mt={2} bgcolor="background.paper">
        <div className={classes.MdataGridPaginationTop} style={{ height: rows.length >= 10 ? '80vh' : 'auto' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            disableColumnMenu
            // onCellClick={currentlySelected}
            autoHeight={rows.length >= 10 ? false : true}
            scrollbarSize={10}
            pagination
            // page={cuurentPage - 1}
            // pageSize={parseInt(pageSize)}
            rowsPerPageOptions={[10, 20, 50, 100]}
            rowCount={items.total}
            paginationMode="server"
            // onPageChange={handlePageChange}
            // onPageSizeChange={handlePageSizeChange}
            // loading={loading}
            rowHeight={65}
          />
        </div>
      </Box>
    </div>
  );
}

export default StockBalanceLocation;
