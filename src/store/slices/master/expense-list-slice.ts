import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { get } from '../../../adapters/posback-adapter';
import { environment } from '../../../environment-base';
import { ExpenseMasterResponseType } from '../../../models/branch-accounting-model';
import { StockMovementMasterResponse } from '../../../models/stock-model';

type State = {
  masterExpenseList: ExpenseMasterResponseType;
  error: string;
};

const initialState: State = {
  masterExpenseList: {
    ref: '',
    code: 0,
    message: '',
    data: [],
  },
  error: '',
};

export const featchMasterExpenseeListAsync = createAsyncThunk('MasterExpenseList', async () => {
  try {
    const path = environment.master.expense.retrive.url;

    let response = await get(path).then();

    return response;
  } catch (error) {
    throw error;
  }
});

const masterExpenseListSlice = createSlice({
  name: 'MasterExpenseList',
  initialState,
  reducers: {},
  extraReducers: (builer) => {
    builer.addCase(featchMasterExpenseeListAsync.pending, () => {
      initialState;
    }),
      builer.addCase(featchMasterExpenseeListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.masterExpenseList = action.payload;
      }),
      builer.addCase(featchMasterExpenseeListAsync.rejected, () => {
        initialState;
      });
  },
});

export default masterExpenseListSlice.reducer;
