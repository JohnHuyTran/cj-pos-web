import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { useAppSelector, useAppDispatch } from '../../../store/store';
import { useStyles } from '../../../styles/makeTheme';
import { SearchOff } from '@mui/icons-material';
import { OutstandingRequest, StockInfo } from '../../../models/stock-model';
import {
  featchStockMovementeSearchAsync,
  savePayloadSearch,
} from '../../../store/slices/stock/stock-movement-search-slice';

function StockMovementSearchList() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const savePayLoadSearch = useAppSelector((state) => state.stockMovementSearchSlice.savePayloadSearch);
  const items = useAppSelector((state) => state.stockMovementSearchSlice.stockList);
  const cuurentPage = useAppSelector((state) => state.stockMovementSearchSlice.stockList.page);
  const limit = useAppSelector((state) => state.stockMovementSearchSlice.stockList.perPage);
  const [pageSize, setPageSize] = React.useState(limit);

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerClassName: 'columnHeaderTitle',
      headerName: 'ลำดับ',
      width: 70,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <Box component='div' sx={{ paddingLeft: '20px' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'createDate',
      headerClassName: 'columnHeaderTitle',
      headerName: 'วันที่ทำรายการ',
      minWidth: 122,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'docNo',
      headerClassName: 'columnHeaderTitle',
      headerName: 'เลขที่เอกสาร',
      headerAlign: 'center',
      minWidth: 235,
      sortable: false,
    },
    {
      field: 'docRef',
      headerClassName: 'columnHeaderTitle',
      headerName: 'เลขที่เอกสารอ้างอิง',
      width: 75,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'store',
      headerClassName: 'columnHeaderTitle',
      headerName: 'คลัง',
      minWidth: 85,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'transactionType',
      headerClassName: 'columnHeaderTitle-BG',
      cellClassName: 'columnFilled-BG',
      headerName: 'ประเภท',
      width: 111,
      headerAlign: 'center',
      align: 'right',
      sortable: false,
    },
    {
      field: 'qty',
      headerClassName: 'columnHeaderTitle',
      headerName: 'จำนวนที่ทำรายการ',
      width: 75,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'availableQty',
      headerClassName: 'columnHeaderTitle-BG',
      cellClassName: 'columnFilled-BG',
      headerName: 'สินค้าคงเหลือ',
      minWidth: 150,
      headerAlign: 'center',
      align: 'right',
      sortable: false,
    },
    {
      field: 'unitName',
      headerClassName: 'columnHeaderTitle',
      headerName: 'หน่วย',
      width: 75,
      headerAlign: 'center',
      sortable: false,
    },
  ];

  const rows = items.data.map((data: StockInfo, indexs: number) => {
    return {
      id: indexs,
      index: (cuurentPage - 1) * Number(pageSize) + indexs + 1,
      skuCode: data.skuCode,
      skuName: data.skuName,
      storeCode: data.storeCode,
      storeName: data.storeName,
      availableQty: data.availableQty,
      unitCode: data.unitCode,
      unitName: data.unitName,
    };
  });

  const [loading, setLoading] = React.useState<boolean>(false);
  const handlePageChange = async (newPage: number) => {
    setLoading(true);

    let page: number = newPage + 1;

    const payloadNewpage: OutstandingRequest = {
      limit: pageSize,
      page: page,
      branchCode: savePayLoadSearch.branchCode,
      dateFrom: savePayLoadSearch.dateFrom,
      skuCodes: savePayLoadSearch.skuCodes,
      storeCode: savePayLoadSearch.storeCode,
    };

    await dispatch(featchStockMovementeSearchAsync(payloadNewpage));
    await dispatch(savePayloadSearch(payloadNewpage));
    setLoading(false);
  };

  const handlePageSizeChange = async (pageSize: number) => {
    setPageSize(pageSize);
    setLoading(true);

    const payloadNewpage: OutstandingRequest = {
      limit: pageSize,
      page: 1,
      branchCode: savePayLoadSearch.branchCode,
      dateFrom: savePayLoadSearch.dateFrom,
      skuCodes: savePayLoadSearch.skuCodes,
      storeCode: savePayLoadSearch.storeCode,
    };

    await dispatch(featchStockMovementeSearchAsync(payloadNewpage));
    await dispatch(savePayloadSearch(payloadNewpage));

    setLoading(false);
  };
  return (
    <div>
      <Box
        mt={2}
        bgcolor='background.paper'
        sx={{
          '& .columnHeaderTitle-BG': {
            backgroundColor: '#20AE79',
            color: '#FFFFFF !important',
          },
          '& .columnHeaderTitle': {
            color: '#20AE79 !important',
          },
          '& .columnFilled-BG': {
            backgroundColor: '#E7FFE9',
          },
        }}>
        <div className={classes.MdataGridPaginationTopStock} style={{ height: rows.length >= 10 ? '80vh' : 'auto' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            disableColumnMenu
            autoHeight={rows.length >= 10 ? false : true}
            scrollbarSize={10}
            pagination
            page={cuurentPage - 1}
            pageSize={pageSize}
            rowsPerPageOptions={[10, 20, 50, 100]}
            rowCount={items.total}
            paginationMode='server'
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            loading={loading}
            rowHeight={65}
          />
        </div>
      </Box>
    </div>
  );
}

export default StockMovementSearchList;
