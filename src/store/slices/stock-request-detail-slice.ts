import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { environment } from '../../environment-base';
import { get } from '../../adapters/posback-adapter';
import { StockRequestResponse } from '../../models/stock-transfer-model';

type State = {
  stockRequestDetail: StockRequestResponse;
  error: string;
};

const initialState: State = {
  stockRequestDetail: {
    ref: '',
    code: 0,
    message: '',
    data: null,
  },
  error: '',
};

export const featchStockRequestDetailAsync = createAsyncThunk('stockRequestDetail', async (rtNo: string) => {
  try {
    const apiRootPath = `${environment.stock.StockRequestDetail.url}/${rtNo}`;
    let response: StockRequestResponse = {
      ref: '',
      code: 0,
      message: '',
      data: null,
    };

    response = await get(apiRootPath).then();
    return response;
  } catch (error) {
    throw error;
  }
});

const stockRequestDetailSlice = createSlice({
  name: 'stockRequestDetail',
  initialState,
  reducers: {
    clearDataFilter: (state) => initialState,
  },
  extraReducers: (builer) => {
    builer.addCase(featchStockRequestDetailAsync.pending, () => {
      initialState;
    }),
      builer.addCase(featchStockRequestDetailAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.stockRequestDetail = action.payload;
      }),
      builer.addCase(featchStockRequestDetailAsync.rejected, () => {
        initialState;
      });
  },
});

export const { clearDataFilter } = stockRequestDetailSlice.actions;
export default stockRequestDetailSlice.reducer;
