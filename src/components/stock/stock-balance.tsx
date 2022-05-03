import { Box, Grid, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';
import { OutstandingRequest, StockInfo } from '../../models/stock-model';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { useStyles } from '../../styles/makeTheme';
import { SearchOff } from '@mui/icons-material';
import { featchStockBalanceSearchAsync, savePayloadSearch } from '../../store/slices/stock/stock-balance-search-slice';

interface Props {
  flagSearch?: boolean;
}

function StockBalance({ flagSearch }: Props) {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const savePayLoadSearch = useAppSelector((state) => state.stockBalanceSearchSlice.savePayloadSearch);
  const items = useAppSelector((state) => state.stockBalanceSearchSlice.stockList);
  const cuurentPage = useAppSelector((state) => state.stockBalanceSearchSlice.stockList.page);
  const limit = useAppSelector((state) => state.stockBalanceSearchSlice.stockList.perPage);
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
      field: 'skuName',
      headerClassName: 'columnHeaderTitle',
      headerName: 'รายละเอียดสินค้า',
      headerAlign: 'center',
      // minWidth: 235,
      flex: 0.3,
      sortable: false,
      renderCell: (params) => (
        <div>
          <Typography variant='body2'>{params.value}</Typography>
          <Typography variant='body2' color='textSecondary'>
            {params.getValue(params.id, 'skuCode') || ''}
          </Typography>
        </div>
      ),
    },
    {
      field: 'locationName',
      headerClassName: 'columnHeaderTitle',
      headerName: 'คลัง',
      minWidth: 125,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'availableQty',
      headerClassName: 'columnHeaderTitle-BG',
      cellClassName: 'columnFilled-BG',
      headerName: 'สินค้าคงเหลือ',
      minWidth: 125,
      headerAlign: 'center',
      align: 'right',
      sortable: false,
    },
    {
      field: 'unitName',
      headerClassName: 'columnHeaderTitle',
      headerName: 'หน่วย',
      minWidth: 125,
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
      locationCode: data.locationCode,
      locationName: data.locationName,
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
      locationCode: savePayLoadSearch.locationCode,
    };

    await dispatch(featchStockBalanceSearchAsync(payloadNewpage));
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
      locationCode: savePayLoadSearch.locationCode,
    };

    await dispatch(featchStockBalanceSearchAsync(payloadNewpage));
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
        {flagSearch && items.data.length > 0 && (
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
        )}
        {flagSearch && items.data.length === 0 && (
          <Grid container xs={12} justifyContent='center'>
            <Box color='#CBD4DB' justifyContent='center'>
              <h2>
                ไม่มีข้อมูล <SearchOff fontSize='large' />
              </h2>
            </Box>
          </Grid>
        )}
      </Box>
    </div>
  );
}

export default StockBalance;