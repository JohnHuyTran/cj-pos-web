import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { stat } from 'fs';
import { environment } from '../../../environment-base';
import { featchExpenseDetailAsyncMockup } from '../../../mockdata/branch-accounting';
import { ExpenseDetailResponseType, ExpenseMasterResponseType } from '../../../models/branch-accounting-model';

type State = {
  expenseAccountDetail: ExpenseDetailResponseType;
  error: string;
  summaryRows: any;
  intialRows: any;
  itemRows: any;
  addNewItem: any;
};

const initialState: State = {
  expenseAccountDetail: {
    ref: '',
    code: 0,
    message: '',
    data: null,
  },
  error: '',
  summaryRows: [],
  intialRows: [],
  itemRows: [],
  addNewItem: null,
};

export const featchExpenseDetailAsync = createAsyncThunk('ExpenseDetail', async () => {
  try {
    const path = environment.branchAccounting.expense.detail.url;
    return featchExpenseDetailAsyncMockup();
  } catch (error) {
    throw error;
  }
});

const expenseAccountDetailSlice = createSlice({
  name: 'ExpenseDetail',
  initialState,
  reducers: {
    updateToInitialState: () => {
      initialState;
    },
    initialItems: (state, action: PayloadAction<any>) => {
      state.intialRows = action.payload;
    },
    addNewItem: (state, action: PayloadAction<any>) => {
      state.addNewItem = action.payload;
    },
    updateSummaryRows: (state, action: PayloadAction<any>) => {
      state.summaryRows = action.payload;
    },
    updateItemRows: (state, action: PayloadAction<any>) => {
      state.itemRows = action.payload;
    },
  },
  extraReducers: (builer) => {
    builer.addCase(featchExpenseDetailAsync.pending, () => {
      initialState;
    }),
      builer.addCase(featchExpenseDetailAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.expenseAccountDetail = action.payload;
      }),
      builer.addCase(featchExpenseDetailAsync.rejected, () => {
        initialState;
      });
  },
});

export const { updateSummaryRows, updateItemRows, updateToInitialState, addNewItem, initialItems } =
  expenseAccountDetailSlice.actions;
export default expenseAccountDetailSlice.reducer;
