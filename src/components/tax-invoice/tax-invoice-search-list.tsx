import React from 'react';
import { Chip, Grid, TextField, Typography } from '@mui/material';
import { Box } from '@mui/material';
import { useStyles } from '../../styles/makeTheme';
import { Button } from '@mui/material';
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { CheckOrderInfo, CheckOrderResponse } from '../../models/dc-check-order-model';
import { featchTaxInvoiceListAsync, savePayloadSearchList } from '../../store/slices/tax-invoice-search-list-slice';
import { TaxInvoiceRequest } from '../../models/tax-invoice-model';
import { convertUtcToBkkDate } from '../../utils/date-utill';
import { getSdType } from '../../utils/utils';
import { featchTaxInvoiceDetailAsync } from '../../store/slices/tax-invoice-search-detail-slice';
import { useTranslation } from 'react-i18next';

export default function TaxInvoiceSearchList() {
  const classes = useStyles();
  const { t } = useTranslation(['taxInvoice', 'common']);
  const dispatch = useAppDispatch();
  const payloadSearch = useAppSelector((state) => state.taxInvoiceSearchList.payloadSearchList);
  const items = useAppSelector((state) => state.dcCheckOrderList);
  const cuurentPage = useAppSelector((state) => state.dcCheckOrderList.orderList.page);
  const limit = useAppSelector((state) => state.dcCheckOrderList.orderList.perPage);

  const res: CheckOrderResponse = items.orderList;
  const [pageSize, setPageSize] = React.useState(limit.toString());
  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: 'ลำดับ',
      width: 70,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'billNo',
      headerName: 'เลขที่ใบเสร็จ(ย่อ)',
      minWidth: 200,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'billCreateDate',
      headerName: 'วันที่ออกใบเสร็จ(ย่อ)',
      minWidth: 160,
      // flex: 1.2,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'billStatusDisplay',
      headerName: 'สถานะ(ย่อ)',
      minWidth: 128,
      // flex: 1.2,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => {
        if (params.value === 0 || params.value === 1) {
          return (
            <Chip
              label={t(`status.${params.value}`)}
              size='small'
              sx={{ color: '#20AE79', backgroundColor: '#E7FFE9' }}
            />
          );
        } else if (params.value === 'COMPLETED') {
          return (
            <Chip
              label={t(`status.${params.value}`)}
              size='small'
              sx={{ color: '#FBA600', backgroundColor: '#FFF0CA' }}
            />
          );
        }
      },
    },
    {
      field: 'taxInvoiceNo',
      headerName: 'เลขที่ใบเสร็จ(เต็ม)',
      minWidth: 200,
      flex: 0.9,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'taxInvoicePrintedDate',
      headerName: 'วันที่พิมพ์ใบเสร็จ(เต็ม)',
      minWidth: 150,
      flex: 0.9,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'taxInvoicePrintedCount',
      headerName: 'พิมพ์ใบเสร็จ(เต็ม)ครั้งที่',
      minWidth: 70,
      flex: 0.75,
      headerAlign: 'center',
      align: 'left',
      sortable: false,
    },
  ];

  const rows = res.data.map((data: CheckOrderInfo, indexs: number) => {
    return {
      id: data.id,
      index: (cuurentPage - 1) * parseInt(pageSize) + indexs + 1,
      billNo: data.docRefNo,
      billCreateDate: convertUtcToBkkDate(data.receivedDate),
      billStatusDisplay: data.sdType,
      billStatus: data.sdType,
      taxInvoiceNo: data.docRefNo,
      taxInvoicePrintedDate: convertUtcToBkkDate(data.receivedDate),
      taxInvoicePrintedCount: '1',
    };
  });

  const [loading, setLoading] = React.useState<boolean>(false);

  const handlePageChange = async (newPage: number) => {
    setLoading(true);
    let page: string = (newPage + 1).toString();
    const payload: TaxInvoiceRequest = {
      limit: pageSize.toString(),
      page: page,
      docNo: payloadSearch.docNo,
    };
    await dispatch(featchTaxInvoiceListAsync(payload));
    await dispatch(savePayloadSearchList(payload));
    setLoading(false);
  };

  const handlePageSizeChange = async (pageSize: number) => {
    setLoading(true);
    setPageSize(pageSize.toString());
    const payload: TaxInvoiceRequest = {
      limit: pageSize.toString(),
      page: '1',
      docNo: payloadSearch.docNo,
    };

    await dispatch(featchTaxInvoiceListAsync(payload));
    await dispatch(savePayloadSearchList(payload));
    setLoading(false);
  };

  const currentlySelected = async (params: GridCellParams) => {
    console.log('param: ', params);
    console.log('billNo: ', params.row.billNo);
    if (params.row.billStatus === '') {
      const payload: TaxInvoiceRequest = {};
      await dispatch(featchTaxInvoiceDetailAsync(payload));
    }
  };

  return (
    <div>
      <Box mt={2} bgcolor='background.paper'>
        <div className={classes.MdataGridPaginationTop} style={{ height: rows.length >= 10 ? '80vh' : 'auto' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            disableColumnMenu
            onCellClick={currentlySelected}
            autoHeight={rows.length >= 10 ? false : true}
            scrollbarSize={10}
            pagination
            page={cuurentPage - 1}
            pageSize={parseInt(pageSize)}
            rowsPerPageOptions={[10, 20, 50, 100]}
            rowCount={res.total}
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
