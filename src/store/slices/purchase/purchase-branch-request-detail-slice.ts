import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { environment } from '../../../environment-base';
import { get } from '../../../adapters/posback-adapter';
import { PurchaseBRDetailResponse } from '../../../models/purchase-branch-request-model';
import { getPathPurchaseBRDetail } from '../../../services/purchase';

type State = {
  purchaseBRDetail: PurchaseBRDetailResponse;
  error: string;
};

const initialState: State = {
  purchaseBRDetail: {
    ref: '',
    code: 0,
    message: '',
    data: [],
  },
  error: '',
};

export const featchPurchaseBRDetailAsync = createAsyncThunk('purchaseBRDetail', async (docNo: string) => {
  try {
    const apiRootPath = getPathPurchaseBRDetail(docNo);
    let response: PurchaseBRDetailResponse = {
      ref: '',
      code: 0,
      message: '',
      data: [],
    };

    response = await get(apiRootPath).then();
    return response;
  } catch (error) {
    throw error;
  }
});

const purchaseBRDetailSlice = createSlice({
  name: 'purchaseBRDetail',
  initialState,
  reducers: {
    clearDataFilter: (state) => initialState,
  },
  extraReducers: (builer) => {
    builer.addCase(featchPurchaseBRDetailAsync.pending, () => {
      initialState;
    }),
      builer.addCase(featchPurchaseBRDetailAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.purchaseBRDetail = action.payload;
      }),
      builer.addCase(featchPurchaseBRDetailAsync.rejected, () => {
        initialState;
      });
  },
});

export const { clearDataFilter } = purchaseBRDetailSlice.actions;
export default purchaseBRDetailSlice.reducer;
