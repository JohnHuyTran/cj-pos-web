import { Box, setRef, TextField } from '@mui/material';
import { DataGrid, GridCellParams, GridColDef, GridRenderCellParams, GridRowData } from '@mui/x-data-grid';
import React, { useEffect } from 'react';
import {
  AccountAccountExpenses,
  ExpenseInfo,
  ExpensePeriod,
  payLoadAdd,
  SumItems,
  SumItemsItem,
} from '../../../models/branch-accounting-model';
import { updateSummaryRows } from '../../../store/slices/accounting/accounting-slice';
import store, { useAppDispatch, useAppSelector } from '../../../store/store';
import { useStyles } from '../../../styles/makeTheme';
import { STATUS } from '../../../utils/enum/accounting-enum';
import { isFilterFieldInExpense } from '../../../utils/utils';
import ExpenseDetailTransaction from './expense-detail-transaction';
import ModalUpdateExpenseSummary from './modal-update-expense-sumary';

interface Props {
  type: string;
  periodProps: ExpensePeriod;
}

function ExpenseDetailSummary({ type, periodProps }: Props) {
  const classes = useStyles();
  const _ = require('lodash');
  const dispatch = useAppDispatch();

  const [expenseType, setExpenseType] = React.useState(type);
  const [period, setPeriod] = React.useState<ExpensePeriod>({
    period: 0,
    startDate: '',
    endDate: '',
  });
  const [pageSize, setPageSize] = React.useState<number>(10);
  const expenseAccountDetail = useAppSelector((state) => state.expenseAccountDetailSlice.expenseAccountDetail);
  const expenseData: any = expenseAccountDetail.data ? expenseAccountDetail.data : null;
  const status = expenseData && expenseData.status ? expenseData.status : '';
  const expenseMasterList = useAppSelector((state) => state.masterExpenseListSlice.masterExpenseList.data);
  const summaryRows = useAppSelector((state) => state.expenseAccountDetailSlice.summaryRows);
  const payloadAddSummaryItem = useAppSelector((state) => state.expenseAccountDetailSlice.addSummaryItem);
  const [newExpenseAllList, setNewExpenseAllList] = React.useState<ExpenseInfo[]>([]);
  const [openModalUpdatedExpenseSummary, setOpenModalUpdateExpenseSummary] = React.useState(false);
  const [payloadAdd, setPayloadAdd] = React.useState<payLoadAdd[]>();
  const getMasterExpenInto = (key: any) => expenseMasterList.find((e: ExpenseInfo) => e.expenseNo === key);
  const columns: GridColDef[] = newExpenseAllList.map((i: ExpenseInfo) => {
    const master = getMasterExpenInto(i.expenseNo);
    const hideColumn = master ? master.isOtherExpense : false;
    return {
      field: i.expenseNo,
      headerName: i.accountNameTh,
      minWidth: 70,
      flex: 1,
      headerAlign: 'center',
      sortable: false,
      hide: hideColumn,
      renderCell: (params: GridRenderCellParams) => {
        if (isFilterFieldInExpense(params.field)) {
          return (
            <Box component='div' sx={{ paddingLeft: '20px' }}>
              {params.value}
            </Box>
          );
        } else {
          return (
            <TextField
              variant='outlined'
              name={`txb${i.expenseNo}`}
              inputProps={{ style: { textAlign: 'right' } }}
              sx={{
                '.MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: '#000',
                  color: '#000',
                },
              }}
              value={params.value}
              disabled={true}
              autoComplete='off'
            />
          );
        }
      },
    };
  });
  useEffect(() => {
    setExpenseType(type);
    let _newExpenseAllList: ExpenseInfo[] = [];
    const headerDescription: ExpenseInfo = {
      accountNameTh: ' ',
      skuCode: '',
      approvalLimit1: 0,
      approvalLimit2: 0,
      isActive: true,
      requiredDocumentTh: '',
      expenseNo: 'description',
      isOtherExpense: false,
      typeCode: '',
      accountCode: '',
      typeNameTh: '',
    };
    const headerOtherSum: ExpenseInfo = {
      accountNameTh: 'อื่นๆ',
      skuCode: '',
      approvalLimit1: 0,
      approvalLimit2: 0,
      isActive: true,
      requiredDocumentTh: '',
      expenseNo: 'SUMOTHER',
      isOtherExpense: false,
      typeCode: '',
      accountCode: '',
      typeNameTh: '',
    };
    const headerSum: ExpenseInfo = {
      accountNameTh: 'รวม',
      skuCode: '',
      approvalLimit1: 0,
      approvalLimit2: 0,
      isActive: true,
      requiredDocumentTh: '',
      expenseNo: 'total',
      isOtherExpense: false,
      typeCode: '',
      accountCode: '',
      typeNameTh: '',
    };
    _newExpenseAllList.push(headerDescription);

    expenseMasterList
      .filter((i: ExpenseInfo) => i.isActive && i.typeCode === expenseType)
      .map((i: ExpenseInfo) => {
        _newExpenseAllList.push(i);
      });
    _newExpenseAllList.push(headerOtherSum);
    _newExpenseAllList.push(headerSum);
    setNewExpenseAllList(_newExpenseAllList);
  }, [expenseType, type]);

  React.useEffect(() => {
    setPeriod(periodProps);
    setExpenseType(type);
  }, [periodProps]);

  const currentlySelected = async (params: GridCellParams) => {
    if (params.id === 2 && status === STATUS.WAITTING_ACCOUNTING) {
      let listPayload: payLoadAdd[] = [];
      const arr = Object.entries(params.row);
      await arr.forEach((element: any, index: number) => {
        const master = getMasterExpenInto(element[0]);
        const _title = master?.accountNameTh || 'Field';
        const _isOtherExpense = master?.isOtherExpense || false;
        const _expenseType = master?.typeCode;
        if (_expenseType !== expenseType) {
          return;
        }
        const item: payLoadAdd = {
          id: index,
          key: element[0],
          value: element[1],
          title: _title,
          isOtherExpense: _isOtherExpense,
        };
        listPayload.push(item);
      });
      await setPayloadAdd(listPayload);
      setOpenModalUpdateExpenseSummary(true);
    }
  };

  const storeSummaryItem = async (_item: any) => {
    if (_item) {
      let infosWithDraw: any;
      let infosApprove: any;
      let totalWithDraw: number = 0;
      let totalApprove: number = 0;
      let rows: any[] = [];
      const expenseAccountDetail = store.getState().expenseAccountDetailSlice.expenseAccountDetail;
      const expenseData: any = expenseAccountDetail.data ? expenseAccountDetail.data : null;
      const summary: SumItems = expenseData ? expenseData.sumItems : null;
      const entries: SumItemsItem[] = summary && summary.items ? summary.items : [];
      entries.map((entrie: SumItemsItem, i: number) => {
        infosWithDraw = {
          ...infosWithDraw,

          [entrie.expenseNo]: entrie.withdrawAmount,
        };
        totalWithDraw += Number(entrie?.withdrawAmount);
      });
      const arr = Object.entries(_item);
      await arr.forEach((element: any, index: number) => {
        const key = element[0];
        if (key === 'total') {
          totalApprove = element[1];
        }
        infosApprove = {
          ...infosApprove,
          [key]: element[1],
        };
      });
      let infoDiff: any;
      let totalDiff: number = 0;
      arr.map((element: any, i: number) => {
        const key = element[0];
        const value = element[1];
        const withDraw = entries.find((entrie: SumItemsItem, i: number) => entrie.expenseNo === key);
        infoDiff = {
          ...infoDiff,
          [key]: Number(withDraw?.withdrawAmount) - Number(value),
        };
      });

      infoDiff = {
        ...infoDiff,
        id: 3,
        description: 'ผลต่าง',
      };

      rows = [
        { ...infosWithDraw, id: 1, description: 'ยอดเงินเบิก', total: totalWithDraw },
        { ...infosApprove, id: 2, description: 'ยอดเงินอนุมัติ', infosApprove },
        { ...infoDiff, total: Number(totalWithDraw) - Number(totalApprove) },
      ];
      dispatch(updateSummaryRows(rows));
    }
  };

  let rows: [] = summaryRows ? summaryRows : [];
  useEffect(() => {
    storeSummaryItem(payloadAddSummaryItem);
  }, [payloadAddSummaryItem]);

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
            onCellClick={currentlySelected}
          />
        </div>
        <ExpenseDetailTransaction type={expenseType} periodProps={period} />
        <ModalUpdateExpenseSummary
          open={openModalUpdatedExpenseSummary}
          onClose={() => setOpenModalUpdateExpenseSummary(false)}
          payload={payloadAdd}
        />
      </Box>
    </React.Fragment>
  );
}

export default ExpenseDetailSummary;
