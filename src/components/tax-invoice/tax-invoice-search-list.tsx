import React from 'react';
import { Grid, TextField, Typography } from '@mui/material';
import { Box } from '@mui/material';
import { useStyles } from '../../styles/makeTheme';
import { Button } from '@mui/material';
import { DataGrid, GridColDef, GridRowData } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { CheckOrderResponse } from '../../models/dc-check-order-model';

export default function TaxInvoiceSearchList() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
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
      minWidth: 140,
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
      field: 'billStatus',
      headerName: 'สถานะ(ย่อ)',
      minWidth: 128,
      // flex: 1.2,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'taxInvoiceNo',
      headerName: 'เลขที่ใบเสร็จ(เต็ม)',
      minWidth: 150,
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

  const rows: [] = [];

  const [loading, setLoading] = React.useState<boolean>(false);
  const handlePageChange = async (newPage: number) => {
    setLoading(true);
  };
  const handlePageSizeChange = async (pageSize: number) => {};

  const currentlySelected = () => {};

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
