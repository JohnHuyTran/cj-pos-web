import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { environment } from '../../environment-base';
import { get } from '../../adapters/posback-adapter';
import { TaxInvoiceDetailResponse } from '../../models/tax-invoice-model';

type State = {
  detail: TaxInvoiceDetailResponse;
  error: string;
};

const initialState: State = {
  detail: {
    ref: '',
    code: 0,
    message: '',
    data: null,
  },
  error: '',
};

export const featchTaxInvoiceDetailAsync = createAsyncThunk('TaxInvoiceDetail', async () => {
  try {
    const path = environment.sale.taxInvoice.detail.url;
    let response = await get(path).then();

    return response;
  } catch (error) {
    throw error;
  }
});

const taxInvoiceDetailSlice = createSlice({
  name: 'taxInvoiceDetail',
  initialState,
  reducers: {},
  extraReducers: (builer) => {
    builer.addCase(featchTaxInvoiceDetailAsync.pending, () => {
      initialState;
    }),
      builer.addCase(featchTaxInvoiceDetailAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.detail = action.payload;
      }),
      builer.addCase(featchTaxInvoiceDetailAsync.rejected, () => {
        initialState;
      });
  },
});

export default taxInvoiceDetailSlice.reducer;
