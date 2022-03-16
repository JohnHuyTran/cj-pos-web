import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { environment } from '../../environment-base';
import { get } from '../../adapters/posback-adapter';
import { TaxInvoiceResponse } from '../../models/tax-invoice-model';

type State = {
  taxInvoiceList: TaxInvoiceResponse;
  error: string;
};

const initialState: State = {
  taxInvoiceList: {
    ref: '',
    code: 0,
    message: '',
    data: [],
  },
  error: '',
};

export const featchTaxInvoiceListAsync = createAsyncThunk('TaxInvoiceList', async () => {
  try {
    const path = environment.sale.taxInvoice.search.url;
    let response = await get(path).then();

    return response;
  } catch (error) {
    throw error;
  }
});

const taxInvoiceListSlice = createSlice({
  name: 'taxInvoiceList',
  initialState,
  reducers: {},
  extraReducers: (builer) => {
    builer.addCase(featchTaxInvoiceListAsync.pending, () => {
      initialState;
    }),
      builer.addCase(featchTaxInvoiceListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.taxInvoiceList = action.payload;
      }),
      builer.addCase(featchTaxInvoiceListAsync.rejected, () => {
        initialState;
      });
  },
});

export default taxInvoiceListSlice.reducer;
