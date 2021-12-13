import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ItemBySupplierCodeResponse } from '../../models/modal-add-item-model';
import { environment } from '../../environment-base';
import { get } from '../../adapters/posback-adapter';
import { SupplierItem } from '../../mockdata/supplier-items';

type State = {
  itemList: ItemBySupplierCodeResponse;
  error: string;
};

const initialState: State = {
  itemList: {
    timestamp: '',
    ref: '',
    code: 0,
    message: '',
    data: [],
  },
  error: '',
};

export const featchItemBySupplierListAsync = createAsyncThunk('ItemList', async (supNo: string) => {
  try {
    const path = environment.products.addItem.itemList.url + supNo;

    // let response = await get(path).then();

    // return response;
    return SupplierItem;
  } catch (error) {
    throw error;
  }
});

const searchItemBySupSlice = createSlice({
  name: 'itemList',
  initialState,
  reducers: {},
  extraReducers: (builer) => {
    builer.addCase(featchItemBySupplierListAsync.pending, () => {
      initialState;
    }),
      builer.addCase(featchItemBySupplierListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.itemList = action.payload;
      }),
      builer.addCase(featchItemBySupplierListAsync.rejected, () => {
        initialState;
      });
  },
});

// export const { clearDataFilter } = dcCheckOrderSlice.actions;
export default searchItemBySupSlice.reducer;
