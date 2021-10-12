import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getOrderList } from '../../mockdata/orders';
import { ShipmentRequest, ShipmentResponse } from '../../models/order-model';

type State = {
  orderList: ShipmentResponse;
  error: string;
};

const initialState: State = {
  orderList: {
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

export const featchOrderListAsync = createAsyncThunk(
  'orderList',
  async (payload: ShipmentRequest) => {
    try {
      const response: ShipmentResponse = await getOrderList(payload).then();
      return response;
    } catch (error) {
      throw error;
    }
  }
);

const checkOrderSlice = createSlice({
  name: 'checkOrder',
  initialState,
  reducers: {
    clearDataFilter: (state) => {
      state.orderList;
    },
  },
  extraReducers: (builer) => {
    builer.addCase(featchOrderListAsync.pending, () => {
      initialState;
    }),
      builer.addCase(
        featchOrderListAsync.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.orderList = action.payload;
        }
      ),
      builer.addCase(featchOrderListAsync.rejected, () => {
        initialState;
      });
  },
});

export const { clearDataFilter } = checkOrderSlice.actions;
export default checkOrderSlice.reducer;
