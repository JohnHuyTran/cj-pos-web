import { Box, TextField, Typography } from '@mui/material';
import { DataGrid, GridCellParams, GridColDef, GridRenderCellParams, GridRowData } from '@mui/x-data-grid';
import React, { useEffect } from 'react';
import { isNullOrUndefined } from 'util';
import { DataItem, ExpenseInfo, payLoadAdd, SumItems, SumItemsItem } from '../../../models/branch-accounting-model';
import {
  initialItems,
  updateItemRows,
  addNewItem,
  updateSummaryRows,
} from '../../../store/slices/accounting/accounting-slice';
import store, { useAppDispatch, useAppSelector } from '../../../store/store';
import { useStyles } from '../../../styles/makeTheme';
import { stringNullOrEmpty } from '../../../utils/utils';
import ModalAddExpense from './modal-add-expense';
interface Props {
  onClickAddNewBtn?: () => void;
  type: string;
}

function ExpenseDetailTransaction({ onClickAddNewBtn, type }: Props) {
  const classes = useStyles();
  const _ = require('lodash');
  const dispatch = useAppDispatch();
  const [openModalAddExpense, setOpenModalAddExpense] = React.useState(false);

  const expenseMasterList = useAppSelector((state) => state.masterExpenseListSlice.masterExpenseList.data);

  const expenseAccountDetail = useAppSelector((state) => state.expenseAccountDetailSlice.expenseAccountDetail);
  const expenseData: any = expenseAccountDetail.data ? expenseAccountDetail.data : null;
  const summary: SumItems = expenseData ? expenseData.sumItems : null;
  const initItems: DataItem[] = expenseData ? expenseData.items : [];

  const [newExpenseAllList, setNewExpenseAllList] = React.useState<ExpenseInfo[]>([]);
  const _initialItems = useAppSelector((state) => state.expenseAccountDetailSlice.intialRows);
  const [items, setItems] = React.useState<any>(_initialItems && _initialItems.length > 0 ? _initialItems : []);
  const [actionEdit, setActionEdit] = React.useState(false);
  const payloadNewItem = useAppSelector((state) => state.expenseAccountDetailSlice.addNewItem);
  const [expenseType, setExpenseType] = React.useState('');
  const columns: GridColDef[] = newExpenseAllList.map((i: ExpenseInfo) => {
    return {
      field: i.expenseNo,
      headerName: i.accountNameTh,
      minWidth: 70,
      flex: 1,
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
    setExpenseType(type);
    let _newExpenseAllList: ExpenseInfo[] = [];
    const headerDescription: ExpenseInfo = {
      accountNameTh: 'วันที่ค่าใช่จ่าย',
      skuCode: '',
      approveLimit1: 0,
      approveLimt2: 0,
      isActive: true,
      requiredDocument: '',
      expenseNo: 'date',
      isOtherExpense: false,
      typeCode: '',
      accountCode: '',
    };
    const headerOtherDetail: ExpenseInfo = {
      accountNameTh: ' ',
      skuCode: '',
      approveLimit1: 0,
      approveLimt2: 0,
      isActive: true,
      requiredDocument: '',
      expenseNo: 'otherDetail',
      isOtherExpense: false,
      typeCode: '',
      accountCode: '',
    };

    const headerSum: ExpenseInfo = {
      skuCode: '',
      approveLimit1: 0,
      approveLimt2: 0,
      requiredDocument: '',
      expenseNo: 'total',
      isOtherExpense: false,
      typeCode: '',
      accountCode: '',
      accountNameTh: 'รวม',
      isActive: false,
    };
    _newExpenseAllList.push(headerDescription);

    expenseMasterList
      .filter((i: ExpenseInfo) => i.isActive)
      .map((i: ExpenseInfo) => {
        _newExpenseAllList.push(i);
      });

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
  }, []);
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

      console.log('_item: ', _item);
      console.log(_.sumBy(_item, '001'));
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
    const expenseAccountDetail = store.getState().expenseAccountDetailSlice.expenseAccountDetail;
    const expenseData: any = expenseAccountDetail.data ? expenseAccountDetail.data : null;
    const summary: SumItems = expenseData ? expenseData.sumItems : null;
    const entries: SumItemsItem[] = summary && summary.items ? summary.items : [];
    if (entries && entries.length > 0) {
      entries.map((entrie: SumItemsItem, i: number) => {
        infosWithDraw = {
          ...infosWithDraw,
          id: 1,
          description: 'ยอดเงินเบิก',
          [entrie.expenseNo]: _.sumBy(_item, entrie.expenseNo),
        };
        totalWithDraw += _.sumBy(_item, entrie.expenseNo);
        infosApprove = {
          ...infosApprove,
          id: 2,
          description: 'ยอดเงินอนุมัติ',
          [entrie.expenseNo]: _.sumBy(_item, entrie.expenseNo),
        };
        totalApprove += _.sumBy(_item, entrie.expenseNo);
      });
      rows = [
        { ...infosWithDraw, total: totalWithDraw },
        { ...infosApprove, total: totalApprove },
      ];
      dispatch(updateSummaryRows(rows));
    } else {
      totalWithDraw = 0;
      totalApprove = 0;
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
        });
      rows = [
        { ...infosWithDraw, total: _.sumBy(_item, 'total') },
        { ...infosApprove, total: _.sumBy(_item, 'total') },
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
  const getMasterExpenInto = (key: any) => expenseMasterList.find((e: ExpenseInfo) => e.expenseNo === key);
  useEffect(() => {
    storeItemAddItem(payloadNewItem);
  }, [payloadNewItem]);
  const [payloadAdd, setPayloadAdd] = React.useState<payLoadAdd[]>();
  const currentlySelected = async (params: GridCellParams) => {
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
      />
    </React.Fragment>
  );
}

export default ExpenseDetailTransaction;
