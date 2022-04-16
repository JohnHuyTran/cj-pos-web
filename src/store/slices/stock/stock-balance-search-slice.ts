import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { get } from '../../../adapters/posback-adapter';
import { environment } from '../../../environment-base';
import { OutstandingRequest, OutstandingResponse } from '../../../models/stock-model';

type State = {
  stockList: OutstandingResponse;
  savePayloadSearch: OutstandingRequest;
  error: string;
};

const initialState: State = {
  stockList: {
    ref: '',
    code: 0,
    message: '',
    data: [],
    total: 0,
    page: 0,
    perPage: 0,
    prev: 0,
    next: 0,
    totalPage: 0,
  },
  error: '',
  savePayloadSearch: {},
};

export const featchStockBalanceSearchAsync = createAsyncThunk(
  'stockBalanceList',
  async (payload: OutstandingRequest) => {
    try {
      const apiRootPath = environment.stock.outStanding.stockBalance.search;
      let path = `${apiRootPath}?limit=${payload.limit}&page=${payload.page}`;
      if (payload.stockId) {
        path = path + `&stockId=${payload.stockId}`;
      }
      if (payload.productList) {
        path = path + `&product=${payload.productList}`;
      }
      if (payload.locationId) {
        path = path + `&location=${payload.locationId}`;
      }
      if (payload.dateFrom) {
        path = path + `&dateFrom=${payload.dateFrom}`;
      }
      if (payload.branchId) {
        path = path + `&branch=${payload.branchId}`;
      }
      const response = await get(path).then();

      return response;
    } catch (error) {
      throw error;
    }
  }
);

const stockBalanceSearchSlice = createSlice({
  name: 'stockBalanceSearch',
  initialState,
  reducers: {
    clearDataFilter: (state) => initialState,
    savePayloadSearch: (state, action: PayloadAction<any>) => {
      state.savePayloadSearch = action.payload;
    },
  },
  extraReducers: (builer) => {
    builer.addCase(featchStockBalanceSearchAsync.pending, () => {
      initialState;
    }),
      builer.addCase(featchStockBalanceSearchAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.stockList = action.payload;
      }),
      builer.addCase(featchStockBalanceSearchAsync.rejected, () => {
        initialState;
      });
  },
});

export const { clearDataFilter, savePayloadSearch } = stockBalanceSearchSlice.actions;
export default stockBalanceSearchSlice.reducer;
