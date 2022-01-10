import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { environment } from '../../environment-base';
import { get } from '../../adapters/posback-adapter';
import { ItemsResponse } from '../../models/modal-add-all-items-model';

type State = {
  itemList: ItemsResponse;
  error: string;
};

const initialState: State = {
  itemList: {
    timestamp: '',
    ref: '',
    code: 0,
    message: '',
    error_details: '',
    data: [],
  },
  error: '',
};

export const featchAllItemsListAsync = createAsyncThunk('AllItemsList', async () => {
  try {
    const path = environment.products.addItem.allitemsList.url;
    let response = await get(path).then();

    if (response === 204) {
      let responseCode: any = {
        ref: '',
        code: response,
        message: '',
        data: [],
      };

      return responseCode;
    }

    return response;
  } catch (error) {
    throw error;
  }
});

const searchItemBySupSlice = createSlice({
  name: 'allItemList',
  initialState,
  reducers: {},
  extraReducers: (builer) => {
    builer.addCase(featchAllItemsListAsync.pending, () => {
      initialState;
    }),
      builer.addCase(featchAllItemsListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.itemList = action.payload;
      }),
      builer.addCase(featchAllItemsListAsync.rejected, () => {
        initialState;
      });
  },
});

export default searchItemBySupSlice.reducer;
