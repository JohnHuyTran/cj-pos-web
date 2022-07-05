import { Box, TextField } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowData } from '@mui/x-data-grid';
import React from 'react';
import { useAppDispatch } from '../../../store/store';
import { useStyles } from '../../../styles/makeTheme';

function ExpenseDetailTransaction() {
  const classes = useStyles();
  const _ = require('lodash');
  const dispatch = useAppDispatch();

  const rows: string | any[] = [
    {
      id: '1',
      expenseDate: '04/07/2565',
      expenseIce: '200',
      expenseCoffee: '200',
      expenseEgg: '200',
      expenseMilk: '200',
      expenseWage: '200',
      expenseOther: '200',
      sum: '1200',
    },
  ];
  const columns: GridColDef[] = [
    {
      field: 'expenseDate',
      headerName: 'วันที่ค่าใช้จ่าย',
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
      renderCell: (params: GridRenderCellParams) => (
        <TextField
          variant='outlined'
          name='txbToteCode'
          inputProps={{ style: { textAlign: 'right', color: 'red' } }}
          value={params.value}
          disabled={true}
          autoComplete='off'
        />
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
      field: 'otherList',
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
      </Box>
    </React.Fragment>
  );
}

export default ExpenseDetailTransaction;
