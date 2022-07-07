import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridRowData } from '@mui/x-data-grid';
import React, { useEffect } from 'react';
import { ExpenseInfo } from '../../../models/branch-accounting-model';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { useStyles } from '../../../styles/makeTheme';
import ExpenseDetailTransaction from './expense-detail-transaction';

function ExpenseDetailSummary() {
  const classes = useStyles();
  const _ = require('lodash');
  const dispatch = useAppDispatch();
  const expenseMasterList = useAppSelector((state) => state.masterExpenseListSlice.masterExpenseList.data);
  const [newExpenseAllList, setNewExpenseAllList] = React.useState<ExpenseInfo[]>([]);
  const rows: string | any[] = [];
  const columns: GridColDef[] = newExpenseAllList.map((i: ExpenseInfo) => {
    return {
      field: i.expenseNo,
      headerName: i.accountName,
      minWidth: 70,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <Box component='div' sx={{ paddingLeft: '20px' }}>
          {params.value}
        </Box>
      ),
    };
  });
  useEffect(() => {
    let _newExpenseAllList: ExpenseInfo[] = [];
    const headerDescription: ExpenseInfo = {
      accountName: ' ',
      skuCode: '',
      approveLimit1: 0,
      approveLimt2: 0,
      active: true,
      requiredDocument: '',
      expenseNo: 'description',
    };
    const headerSum: ExpenseInfo = {
      accountName: 'รวม',
      skuCode: '',
      approveLimit1: 0,
      approveLimt2: 0,
      active: true,
      requiredDocument: '',
      expenseNo: 'total',
    };
    _newExpenseAllList.push(headerDescription);

    expenseMasterList
      .filter((i: ExpenseInfo) => i.active)
      .map((i: ExpenseInfo) => {
        _newExpenseAllList.push(i);
      });

    _newExpenseAllList.push(headerSum);
    setNewExpenseAllList(_newExpenseAllList);
  }, []);
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
