import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridRowData } from '@mui/x-data-grid';
import React from 'react';
import { useAppDispatch } from '../../../store/store';
import { useStyles } from '../../../styles/makeTheme';
import ExpenseDetailTransaction from './expense-detail-transaction';

function ExpenseDetailSummary() {
  const classes = useStyles();
  const _ = require('lodash');
  const dispatch = useAppDispatch();

  const rows: string | any[] = [];
  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: ' ',
      minWidth: 70,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <Box component='div' sx={{ paddingLeft: '20px' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'expenseIce',
      headerName: 'ค่าน้ำแข็ง',
      minWidth: 70,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <Box component='div' sx={{ paddingLeft: '20px' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'expenseCoffee',
      headerName: 'ค่ากาแฟ',
      minWidth: 70,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <Box component='div' sx={{ paddingLeft: '20px' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'expenseEgg',
      headerName: 'ค่าไข่ไก่',
      minWidth: 70,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <Box component='div' sx={{ paddingLeft: '20px' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'expenseMilk',
      headerName: 'ค่านม',
      minWidth: 70,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <Box component='div' sx={{ paddingLeft: '20px' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'expenseWage',
      headerName: 'ค่าจ้างรายวัน',
      minWidth: 70,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <Box component='div' sx={{ paddingLeft: '20px' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'expenseOther',
      headerName: 'อื่นๆ',
      minWidth: 70,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <Box component='div' sx={{ paddingLeft: '20px' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'sum',
      headerName: 'รวม',
      minWidth: 70,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <Box component='div' sx={{ paddingLeft: '20px' }}>
          {params.value}
        </Box>
      ),
    },
  ];
  const [pageSize, setPageSize] = React.useState<number>(10);
  return (
    <React.Fragment>
      <Box mt={2} bgcolor='background.paper'>
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
          />
        </div>
        <ExpenseDetailTransaction />
      </Box>
    </React.Fragment>
  );
}

export default ExpenseDetailSummary;
