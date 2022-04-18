import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { get } from '../../../adapters/posback-adapter';
import { environment } from '../../../environment-base';
import { OutstandingRequest, OutstandingResponse } from '../../../models/stock-model';

type State = {
  stockList: OutstandingResponse;
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
};

export const featchStockBalanceLocationSearchAsync = createAsyncThunk(
  'stockBalanceLocationList',
  async (payload: OutstandingRequest) => {
    try {
      const apiRootPath = environment.stock.outStanding.stockBalance.searchByLocation.url;
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

      let response: OutstandingResponse = {
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
      };

      response = await get(path).then();

      return response;
    } catch (error) {
      throw error;
    }
  }
);

const stockBalanceLocationSearchSlice = createSlice({
  name: 'stockBalanceSearch',
  initialState,
  reducers: {
    clearDataLocationFilter: (state) => initialState,
  },
  extraReducers: (builer) => {
    builer.addCase(featchStockBalanceLocationSearchAsync.pending, () => {
      initialState;
    }),
      builer.addCase(featchStockBalanceLocationSearchAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.stockList = action.payload;
      }),
      builer.addCase(featchStockBalanceLocationSearchAsync.rejected, () => {
        initialState;
      });
  },
});

export const { clearDataLocationFilter } = stockBalanceLocationSearchSlice.actions;
export default stockBalanceLocationSearchSlice.reducer;
