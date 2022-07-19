import { Box, TextField, Typography } from '@mui/material';
import { DataGrid, GridCellParams, GridColDef, GridRenderCellParams, GridRowData } from '@mui/x-data-grid';
import React, { useEffect } from 'react';
import { isNullOrUndefined } from 'util';
import {
  DataItem,
  ExpenseInfo,
  ExpensePeriod,
  payLoadAdd,
  SumItems,
  SumItemsItem,
} from '../../../models/branch-accounting-model';
import {
  initialItems,
  updateItemRows,
  addNewItem,
  updateSummaryRows,
} from '../../../store/slices/accounting/accounting-slice';
import store, { useAppDispatch, useAppSelector } from '../../../store/store';
import { useStyles } from '../../../styles/makeTheme';
import { STATUS } from '../../../utils/enum/accounting-enum';
import { isFilterFieldInExpense, stringNullOrEmpty } from '../../../utils/utils';
import HtmlTooltip from '../../commons/ui/html-tooltip';
import ModalAddExpense from './modal-add-expense';
interface Props {
  onClickAddNewBtn?: () => void;
  type: string;
  periodProps: ExpensePeriod;
}

function ExpenseDetailTransaction({ onClickAddNewBtn, type, periodProps }: Props) {
  const classes = useStyles();
  const _ = require('lodash');
  const dispatch = useAppDispatch();
  const [openModalAddExpense, setOpenModalAddExpense] = React.useState(false);

  const expenseMasterList = useAppSelector((state) => state.masterExpenseListSlice.masterExpenseList.data);

  const expenseAccountDetail = useAppSelector((state) => state.expenseAccountDetailSlice.expenseAccountDetail);
  const expenseData: any = expenseAccountDetail.data ? expenseAccountDetail.data : null;
  const status = expenseData && expenseData.status ? expenseData.status : 'NEW';

  const [newExpenseAllList, setNewExpenseAllList] = React.useState<ExpenseInfo[]>([]);
  const _initialItems = useAppSelector((state) => state.expenseAccountDetailSlice.intialRows);
  const [items, setItems] = React.useState<any>(_initialItems && _initialItems.length > 0 ? _initialItems : []);
  const [actionEdit, setActionEdit] = React.useState(false);
  const payloadNewItem = useAppSelector((state) => state.expenseAccountDetailSlice.addNewItem);
  const getMasterExpenInto = (key: any) => expenseMasterList.find((e: ExpenseInfo) => e.expenseNo === key);
  const [expenseType, setExpenseType] = React.useState('');
  const [period, setPeriod] = React.useState<ExpensePeriod>();
  const columns: GridColDef[] = newExpenseAllList.map((i: ExpenseInfo) => {
    const master = getMasterExpenInto(i.expenseNo);
    const hideColumn = master ? master.isOtherExpense : false;
    if (i.expenseNo === 'date') {
      return {
        field: i.expenseNo,
        headerName: i.accountNameTh,
        minWidth: 70,
        flex: 0.6,
        headerAlign: 'center',
        sortable: false,
        hide: hideColumn,
        renderCell: (params: GridRenderCellParams) => {
          if (isFilterFieldInExpense(params.field)) {
            return (
              <Box component='div' sx={{ paddingLeft: '5px' }}>
                {params.value}
              </Box>
            );
          }
        },
      };
    } else if (i.expenseNo === 'otherDetail') {
      return {
        field: i.expenseNo,
        headerName: i.accountNameTh,
        // minWidth: 70,
        flex: 1,
        headerAlign: 'center',
        sortable: false,
        hide: hideColumn,
        renderCell: (params: GridRenderCellParams) => {
          return (
            <>
              <HtmlTooltip title={<React.Fragment>{params.value}</React.Fragment>}>
                <TextField
                  variant='outlined'
                  name={`txb${i.expenseNo}`}
                  inputProps={{ style: { textAlign: 'right', color: '#000000' } }}
                  sx={{
                    '.MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000',
                      background: '',
                    },
                  }}
                  value={params.value}
                  disabled={true}
                  autoComplete='off'
                />
              </HtmlTooltip>
            </>
          );
        },
      };
    } else {
      return {
        field: i.expenseNo,
        headerName: i.accountNameTh,
        // minWidth: 70,
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
            const master = getMasterExpenInto(params.field);

            const value = params.value || 0;
            const condition =
              value > Number(master?.approvalLimit2)
                ? 'overLimit2'
                : value > Number(master?.approvalLimit1)
                ? 'overLimit1'
                : 'normal';
            return (
              <TextField
                variant='outlined'
                name={`txb${i.expenseNo}`}
                inputProps={{ style: { textAlign: 'right', color: '#000000' } }}
                sx={{
                  '.MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: condition === 'overLimit1' ? '#F54949' : '#000',
                    background: condition === 'overLimit2' ? '#F54949' : '',
                    borderRadius: 'inherit',
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
    }
  });
  useEffect(() => {
    setExpenseType(type);
    let _newExpenseAllList: ExpenseInfo[] = [];
    const headerDescription: ExpenseInfo = {
      accountNameTh: 'วันที่ค่าใช่จ่าย',
      skuCode: '',
      approvalLimit1: 0,
      approvalLimit2: 0,
      isActive: true,
      requiredDocumentTh: '',
      expenseNo: 'date',
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
    const headerOtherDetail: ExpenseInfo = {
      accountNameTh: ' ',
      skuCode: '',
      approvalLimit1: 0,
      approvalLimit2: 0,
      isActive: true,
      requiredDocumentTh: '',
      expenseNo: 'otherDetail',
      isOtherExpense: false,
      typeCode: '',
      accountCode: '',
      typeNameTh: '',
    };

    const headerSum: ExpenseInfo = {
      skuCode: '',
      approvalLimit1: 0,
      approvalLimit2: 0,
      requiredDocumentTh: '',
      expenseNo: 'total',
      isOtherExpense: false,
      typeCode: '',
      accountCode: '',
      accountNameTh: 'รวม',
      isActive: false,
      typeNameTh: '',
    };

    _newExpenseAllList.push(headerDescription);

    expenseMasterList
      .filter((i: ExpenseInfo) => i.isActive && i.typeCode === expenseType)
      .map((i: ExpenseInfo) => {
        _newExpenseAllList.push(i);
      });
    _newExpenseAllList.push(headerOtherSum);
    _newExpenseAllList.push(headerOtherDetail);
    _newExpenseAllList.push(headerSum);
    setNewExpenseAllList(_newExpenseAllList);
    // if (initItems && initItems.length > 0) {
    //   const itemRows = items.map((item: ExpenseByDay, index: number) => {
    //     const list: ExpenseItem[] = item.expenseItems;
    //     let newItem: any;
    //     list.map((data: ExpenseItem) => {
    //       newItem = {
    //         ...newItem,
    //         [data.expenseNo]: data.amount,
    //       };
    //     });
    //     return {
    //       id: index,
    //       date: item.expenseDate,
    //       total: item.totalAmount,
    //       ...newItem,
    //     };
    //   });
    //   setItems(itemRows);
    // }
  }, [expenseType]);

  React.useEffect(() => {
    setPeriod(periodProps);
    setExpenseType(type);
  }, [periodProps]);

  const [pageSize, setPageSize] = React.useState<number>(10);
  const storeItemAddItem = async (_newItem: any) => {
    const isNewItem = sessionStorage.getItem('ADD_NEW_ITEM') === 'Y';
    if (!stringNullOrEmpty(_newItem)) {
      let _item = [...items];

      if (_item) {
        if (isNewItem) {
          setItems([...items, _newItem]);
          _item = [..._item, _newItem];
        } else {
          _.remove(_item, function (item: any) {
            return item.id === _newItem.id;
          });
          _item = [..._item, _newItem];
          setItems(_item);
        }
      } else {
        setItems([_newItem]);
        _item = [..._item, _newItem];
      }
      await dispatch(updateItemRows(_item));
      await dispatch(addNewItem(null));
      summaryRow(_item);
      // await dispatch(updateSummaryRows([]));
    }
  };

  const summaryRow = (_item: any) => {
    let infosWithDraw: any;
    let infosApprove: any;
    let totalWithDraw: number = 0;
    let totalApprove: number = 0;
    let rows: any[] = [];
    let _otherSum: number = 0;
    const expenseAccountDetail = store.getState().expenseAccountDetailSlice.expenseAccountDetail;
    const expenseData: any = expenseAccountDetail.data ? expenseAccountDetail.data : null;
    const summary: SumItems = expenseData ? expenseData.sumItems : null;
    const entries: SumItemsItem[] = summary && summary.items ? summary.items : [];
    if (entries && entries.length > 0) {
      entries.map((entrie: SumItemsItem, i: number) => {
        infosWithDraw = {
          ...infosWithDraw,
          [entrie.expenseNo]: _.sumBy(_item, entrie.expenseNo),
        };
        const sum = _.sumBy(_item, entrie.expenseNo);
        totalWithDraw += stringNullOrEmpty(sum) ? 0 : sum;
        // infosApprove = {
        //   ...infosApprove,
        //   id: 2,
        //   description: 'ยอดเงินอนุมัติ',
        //   [entrie.expenseNo]: _.sumBy(_item, entrie.expenseNo),
        // };
        // totalApprove += _.sumBy(_item, (o: any) => {
        //   return 1;
        // });
        const master = getMasterExpenInto(entrie.expenseNo);
        const _isOtherExpense = master ? master.isOtherExpense : false;
        if (_isOtherExpense) {
          _otherSum += stringNullOrEmpty(sum) ? 0 : sum;
        }
      });
      rows = [
        { ...infosWithDraw, id: 1, description: 'ยอดเงินเบิก', total: totalWithDraw, SUMOTHER: _otherSum },
        // { ...infosApprove, total: totalApprove },
      ];
      dispatch(updateSummaryRows(rows));
    } else {
      totalWithDraw = 0;
      totalApprove = 0;
      _otherSum = 0;
      expenseMasterList
        .filter((i: ExpenseInfo) => i.isActive)
        .map((entrie: ExpenseInfo) => {
          infosWithDraw = {
            ...infosWithDraw,
            id: 1,
            description: 'ยอดเงินเบิก',
            [entrie.expenseNo]: _.sumBy(_item, entrie.expenseNo),
          };

          infosApprove = {
            ...infosApprove,
            id: 2,
            description: 'ยอดเงินอนุมัติ',
            [entrie.expenseNo]: _.sumBy(_item, entrie.expenseNo),
          };

          const master = getMasterExpenInto(entrie.expenseNo);
          const _isOtherExpense = master ? master.isOtherExpense : false;
          if (_isOtherExpense) {
            const sum = _.sumBy(_item, entrie.expenseNo);
            _otherSum += stringNullOrEmpty(sum) ? 0 : sum;
          }
        });
      rows = [
        { ...infosWithDraw, total: _.sumBy(_item, 'total'), SUMOTHER: _otherSum },
        // { ...infosApprove, total: _.sumBy(_item, 'total') },
      ];
      dispatch(updateSummaryRows(rows));
    }
  };

  const sum = (item: any) => {
    const result = item.reduce(function (s: any, o: any) {
      return o ? s : s + o;
    }, 0);

    return result;
  };

  useEffect(() => {
    storeItemAddItem(payloadNewItem);
  }, [payloadNewItem]);

  const [payloadAdd, setPayloadAdd] = React.useState<payLoadAdd[]>();
  const currentlySelected = async (params: GridCellParams) => {
    //handle inside btn
    // if (status === STATUS.DRAFT || status === STATUS.SEND_BACK_EDIT || status === 'NEW') {
    const value = params;
    let listPayload: payLoadAdd[] = [];
    const arr = Object.entries(params.row);
    await arr.forEach((element: any, index: number) => {
      const _title = getMasterExpenInto(element[0])?.accountNameTh || 'Field';
      const item: payLoadAdd = {
        id: index,
        key: element[0],
        value: element[1],
        title: _title,
      };
      listPayload.push(item);
    });
    sessionStorage.setItem('ADD_NEW_ITEM', 'F');
    await setActionEdit(true);
    await setPayloadAdd(listPayload);
    setOpenModalAddExpense(true);
    // }
  };
  const OnCloseAddExpense = () => {
    setOpenModalAddExpense(false);
  };
  return (
    <React.Fragment>
      <Box mt={2} bgcolor='background.paper'>
        <div style={{ width: '100%', height: items.length >= 8 ? '70vh' : 'auto' }} className={classes.MdataGridDetail}>
          <Box>
            <Typography variant='body2'>รายการจ่ายตามวัน</Typography>
          </Box>
          <DataGrid
            rows={items}
            columns={columns}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[10, 20, 50, 100]}
            pagination
            disableColumnMenu
            autoHeight={items.length >= 8 ? false : true}
            scrollbarSize={10}
            rowHeight={65}
            onCellClick={currentlySelected}
          />
        </div>
      </Box>
      <ModalAddExpense
        open={openModalAddExpense}
        onClose={OnCloseAddExpense}
        edit={actionEdit}
        payload={payloadAdd}
        type={expenseType}
        periodProps={period}
      />
    </React.Fragment>
  );
}

export default ExpenseDetailTransaction;
