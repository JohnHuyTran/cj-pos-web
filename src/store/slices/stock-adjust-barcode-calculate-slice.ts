import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { get } from '../../adapters/posback-adapter';
import { StockCountSearchResponse } from "../../models/stock-count-model";
import { SABarcodeCalculateResponse, SACalculateRequest } from "../../models/stock-adjustment-model";

type State = {
  toSearchResponse: SABarcodeCalculateResponse;
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

export const getBarcodeCalculate = createAsyncThunk(
  'getBarcodeCalculate',
  async (payload: SACalculateRequest) => {
    try {
      const apiRootPath = 'http://192.168.110.127:8000/stock-adjust/barcodes/' + payload.id;
      let path = `${apiRootPath}?limit=${payload.perPage}&page=${payload.page}`;
      let response: StockCountSearchResponse = {
        ref: '',
        code: 0,
        message: '',
        data: [],
        total: 0,
        page: 0,
        perPage: 0,
        totalPage: 0,
      };
      response = await get(path).then();
      return response;
    } catch (error) {
      throw error;
    }
  }
);

const stockAdjustBarcodeCalculateSlice = createSlice({
  name: 'stockAdjustBarcodeCalculateSlice',
  initialState,
  reducers: {
    clearDataFilter: (state) => initialState,
  },
  extraReducers: (builer) => {
    builer.addCase(getBarcodeCalculate.pending, () => {
      initialState;
    }),
      builer.addCase(getBarcodeCalculate.fulfilled, (state, action: PayloadAction<any>) => {
        state.toSearchResponse = action.payload;
      }),
      builer.addCase(getBarcodeCalculate.rejected, () => {
        initialState;
      });
  },
});

export const { clearDataFilter } = stockAdjustBarcodeCalculateSlice.actions;
export default stockAdjustBarcodeCalculateSlice.reducer;
