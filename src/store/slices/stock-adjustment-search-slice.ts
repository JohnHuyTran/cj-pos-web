import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { get } from '../../adapters/posback-adapter';
import { stringNullOrEmpty } from '../../utils/utils';
import { environment } from "../../environment-base";
import { StockAdjustmentSearchRequest, StockAdjustmentSearchResponse } from "../../models/stock-adjustment-model";

type State = {
  toSearchResponse: StockAdjustmentSearchResponse;
  error: string;
};

const initialState: State = {
  toSearchResponse: {
    ref: '',
    code: 0,
    message: '',
    data: [],
    total: 0,
    page: 0,
    perPage: 0,
    totalPage: 0,
  },
  error: '',
};

export const getStockAdjustmentSearch = createAsyncThunk(
  'getStockAdjustmentSearch',
  async (payload: StockAdjustmentSearchRequest) => {
    try {
      const apiRootPath = environment.checkStock.stockAdjustment.search.url;
      let path = `${apiRootPath}?limit=${payload.perPage}&page=${payload.page}`;
      if (!stringNullOrEmpty(payload.query)) {
        path = path + `&documentNumber=${payload.query}`;
      }
      if (!stringNullOrEmpty(payload.branch) && 'ALL' !== payload.branch) {
        path = path + `&branchCode=${payload.branch}`;
      }
      if (!stringNullOrEmpty(payload.status) && 'ALL' !== payload.status) {
        path = path + `&status=${payload.status}`;
      }
      if (!stringNullOrEmpty(payload.startDate)) {
        path = path + `&startDate=${payload.startDate}`;
      }
      if (!stringNullOrEmpty(payload.endDate)) {
        path = path + `&endDate=${payload.endDate}`;
      }
      let response: StockAdjustmentSearchResponse = {
        ref: '',
        code: 0,
        message: '',
        data: [],
        total: 0,
        page: 0,
        perPage: 0,
        totalPage: 0,
      };
      if (!payload.clearSearch) {
        response = await get(path).then();
      }
      return response;
    } catch (error) {
      throw error;
    }
  }
);

const StockAdjustmentSearchSlice = createSlice({
  name: 'StockAdjustmentSearchSlice',
  initialState,
  reducers: {
    clearDataFilter: (state) => initialState,
  },
  extraReducers: (builer) => {
    builer.addCase(getStockAdjustmentSearch.pending, () => {
      initialState;
    }),
      builer.addCase(getStockAdjustmentSearch.fulfilled, (state, action: PayloadAction<any>) => {
        state.toSearchResponse = action.payload;
      }),
      builer.addCase(getStockAdjustmentSearch.rejected, () => {
        initialState;
      });
  },
});

export const { clearDataFilter } = StockAdjustmentSearchSlice.actions;
export default StockAdjustmentSearchSlice.reducer;
