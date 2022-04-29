import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { DataGrid, GridCellParams, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { MoreVertOutlined } from '@mui/icons-material';

import { useAppSelector, useAppDispatch } from '../../../store/store';
import { useStyles } from '../../../styles/makeTheme';
import { OutstandingRequest, StockInfo, StockMomentInfoType } from '../../../models/stock-model';
import {
  featchStockMovementeSearchAsync,
  savePayloadSearch,
} from '../../../store/slices/stock/stock-movement-search-slice';
import StockMovementTransaction from './stock-movement-transaction';
import CheckOrderDetail from '../../check-orders/check-order-detail';
import { featchOrderDetailAsync } from '../../../store/slices/check-order-detail-slice';

function StockMovementSearchList() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const savePayLoadSearch = useAppSelector((state) => state.stockMovementSearchSlice.savePayloadSearch);
  const items = useAppSelector((state) => state.stockMovementSearchSlice.stockList);
  const cuurentPage = useAppSelector((state) => state.stockMovementSearchSlice.stockList.page);
  const limit = useAppSelector((state) => state.stockMovementSearchSlice.stockList.perPage);
  const [pageSize, setPageSize] = React.useState(limit);

  const [openModalTransaction, setOpenModalTransaction] = React.useState(false);
  const [mockData, setMockData] = React.useState('');
  const handleModelAction = (params: GridRenderCellParams) => {
    const printNo: any = params.getValue(params.id, 'skuName');

    const handleOpenModalTransaction = () => {
      setMockData(printNo);
      setOpenModalTransaction(true);
    };
    return (
      <>
        <Button onClick={handleOpenModalTransaction}>
          <MoreVertOutlined sx={{ color: '#263238' }} />
        </Button>
      </>
    );
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
      renderCell: (params) => {
        if (params.getValue(params.id, 'index') === 1) {
          return (
            <Typography
              color='secondary'
              variant='body2'
              sx={{ textDecoration: 'underline' }}
              onClick={() => showDocumentDetail('SD2204B005-000018')}>
              {params.value}
            </Typography>
          );
        }
      },
    },
    {
      field: 'docRefNo',
      headerClassName: 'columnHeaderTitle',
      headerName: 'เลขที่เอกสารอ้างอิง',
      minWidth: 100,
      flex: 0.5,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'locationCode',
      headerClassName: 'columnHeaderTitle',
      headerName: 'คลัง',
      minWidth: 85,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'movementTypeName',
      headerClassName: 'columnHeaderTitle',
      headerName: 'ประเภท',
      minWidth: 150,
      flex: 1,
      headerAlign: 'center',
      align: 'left',
      sortable: false,
    },
    {
      field: 'movementQty',
      headerClassName: 'columnHeaderTitle',
      headerName: 'จำนวนที่ทำรายการ',
      width: 100,
      headerAlign: 'center',
      align: 'right',
      sortable: false,
    },
    {
      field: 'balanceQty',
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

  const rows = items.data.map((data: StockMomentInfoType, indexs: number) => {
    return {
      id: indexs,
      index: (cuurentPage - 1) * Number(pageSize) + indexs + 1,
      createDate: data.movementDate,
      docNo: data.docNo,
      docRefNo: data.docRefNo,
      locationCode: data.locationCode,
      movementTypeName: data.movementTypeName,
      movementTypeCode: data.movementTypeCode,
      movementQty: data.movementQty,
      balanceQty: data.balanceQty,
      unitName: data.unitName,
      movementAction: data.skuCode,
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
      dateTo: savePayLoadSearch.dateTo,
      skuCodes: savePayLoadSearch.skuCodes,
      locationCode: savePayLoadSearch.locationCode,
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
      dateTo: savePayLoadSearch.dateTo,
      skuCodes: savePayLoadSearch.skuCodes,
      locationCode: savePayLoadSearch.locationCode,
    };

    await dispatch(featchStockMovementeSearchAsync(payloadNewpage));
    await dispatch(savePayloadSearch(payloadNewpage));

    setLoading(false);
  };

  const currentlySelected = async (params: GridCellParams) => {
    if (params.field === 'docNo') {
    }
  };

  const showDocumentDetail = async (docNo: string) => {
    await dispatch(featchOrderDetailAsync(docNo))
      .then((value) => {
        if (value) {
          handleOpenModalDocDetail();
        }
      })
      .catch((err) => {
        console.log('err : ', err);
      });
  };

  const [openModalDocDetail, setOpenModalDocDetail] = React.useState(false);
  const handleOpenModalDocDetail = () => {
    setOpenModalDocDetail(true);
  };
  const handleCloseModalDocDetail = () => {
    setOpenModalDocDetail(false);
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
            onCellClick={currentlySelected}
            loading={loading}
            rowHeight={65}
          />
        </div>
      </Box>
      <StockMovementTransaction open={openModalTransaction} onClose={handleCloseModalTransaction} mockData={mockData} />
      {openModalDocDetail && (
        <CheckOrderDetail
          sdNo={'SD2204B005-000018'}
          docRefNo={'2310220419001005'}
          docType={'LD'}
          defaultOpen={openModalDocDetail}
          onClickClose={handleCloseModalDocDetail}
        />
      )}
    </React.Fragment>
  );
}

export default StockMovementSearchList;
