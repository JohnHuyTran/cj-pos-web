import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getOrderList } from '../../mockdata/orders';
import { CheckOrderRequest, Shipment } from '../../models/order';

type State = {
  orderList: Shipment[];
  error: string;
};

const initialState: State = {
  orderList: [],
  error: '',
};

export const featchOrderListAsync = createAsyncThunk(
  'orderList',
  async (payload: CheckOrderRequest, store) => {
    try {
      const response: Shipment = await getOrderList(payload).then();
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
      state.orderList = [];
    },
  },
  extraReducers: (builer) => {
    builer.addCase(featchOrderListAsync.pending, (state) => {
      initialState;
    }),
      builer.addCase(
        featchOrderListAsync.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.orderList = action.payload;
        }
      ),
      builer.addCase(featchOrderListAsync.rejected, (state) => {
        initialState;
      });
  },
});

export const { clearDataFilter } = checkOrderSlice.actions;
export default checkOrderSlice.reducer;
