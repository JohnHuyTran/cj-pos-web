import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { MoreVertOutlined } from '@mui/icons-material';

import { useAppSelector, useAppDispatch } from '../../../store/store';
import { useStyles } from '../../../styles/makeTheme';
import { SearchOff } from '@mui/icons-material';
import { OutstandingRequest, StockInfo } from '../../../models/stock-model';
import {
  featchStockMovementeSearchAsync,
  savePayloadSearch,
} from '../../../store/slices/stock/stock-movement-search-slice';
import StockMovementTransaction from './stock-movement-transaction';

function StockMovementSearchList() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const savePayLoadSearch = useAppSelector((state) => state.stockMovementSearchSlice.savePayloadSearch);
  const items = useAppSelector((state) => state.stockMovementSearchSlice.stockList);
  const cuurentPage = useAppSelector((state) => state.stockMovementSearchSlice.stockList.page);
  const limit = useAppSelector((state) => state.stockMovementSearchSlice.stockList.perPage);
  const [pageSize, setPageSize] = React.useState(limit);

  const [openModalTransaction, setOpenModalTransaction] = React.useState(false);
  const handleModelAction = (params: GridRenderCellParams) => {
    return (
      <>
        <Button onClick={handleOpenModalTransaction}>
          <MoreVertOutlined sx={{ color: '#263238' }} />
        </Button>
      </>
    );
  };

  const handleOpenModalTransaction = () => {
    setOpenModalTransaction(true);
  };

  const handleCloseModalTransaction = () => {
    setOpenModalTransaction(false);
  };

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
      minWidth: 150,
      flex: 0.5,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'docNo',
      headerClassName: 'columnHeaderTitle',
      headerName: 'เลขที่เอกสาร',
      headerAlign: 'center',
      flex: 0.5,
      minWidth: 100,
      sortable: false,
    },
    {
      field: 'docRef',
      headerClassName: 'columnHeaderTitle',
      headerName: 'เลขที่เอกสารอ้างอิง',
      minWidth: 100,
      flex: 0.5,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'storeName',
      headerClassName: 'columnHeaderTitle',
      headerName: 'คลัง',
      minWidth: 85,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'transactionType',
      headerClassName: 'columnHeaderTitle',
      headerName: 'ประเภท',
      minWidth: 150,
      flex: 1,
      headerAlign: 'center',
      align: 'left',
      sortable: false,
    },
    {
      field: 'qty',
      headerClassName: 'columnHeaderTitle',
      headerName: 'จำนวนที่ทำรายการ',
      width: 100,
      headerAlign: 'center',
      align: 'right',
      sortable: false,
    },
    {
      field: 'availableQty',
      headerClassName: 'columnHeaderTitle-BG',
      cellClassName: 'columnFilled-BG',
      headerName: 'สินค้าคงเหลือ',
      minWidth: 100,
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
    {
      field: 'action',
      headerName: ' ',
      width: 40,
      align: 'center',
      sortable: false,
      renderCell: (params) => handleModelAction(params),
    },
  ];

  const rows = items.data.map((data: StockInfo, indexs: number) => {
    return {
      id: indexs,
      index: (cuurentPage - 1) * Number(pageSize) + indexs + 1,
      createDate: data.skuCode,
      docNo: data.barcode,
      docRef: data.skuCode,
      storeName: data.storeName,
      transactionType: data.skuName,
      qty: data.availableQty,
      availableQty: data.availableQty,
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
    <React.Fragment>
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
      <StockMovementTransaction open={openModalTransaction} onClose={handleCloseModalTransaction} />
    </React.Fragment>
  );
}

export default StockMovementSearchList;
