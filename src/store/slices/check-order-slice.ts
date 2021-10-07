import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getOrderList } from '../../mockdata/order-shipment';
import { CheckOrderRequest, Order, CheckOrderResponse, ShipmentResponse } from '../../models/order-model';

type State = {
    orderList: ShipmentResponse;
    error: string;
}

const inti: ShipmentResponse = {
    ref: "",
    code: 0,
    message: "",
    data: [],
    total: 0,
    page: 0,
    perPage: 0,
    prev: 0,
    next: 0,
    totalPage: 0
}

const initialState: State = {
    orderList: inti,
    error: "",
};

export const featchOrderListAsync = createAsyncThunk(
    "orderList",
    async (payload: CheckOrderRequest, store) => {
        try {
            const response: ShipmentResponse = await getOrderList().then();
            return response;
        } catch (error) {
            throw error;
        }
    }
);

const checkOrderSlice = createSlice({
    name: "checkOrder",
    initialState,
    reducers: {
        clearDataFilter: (state) => {
            state.orderList = inti
        }
    },
    extraReducers: (builer) => {
        builer.addCase(featchOrderListAsync.pending, (state) => {
            initialState;
        }),
            builer.addCase(featchOrderListAsync.fulfilled, (state, action: PayloadAction<any>) => {
                state.orderList = action.payload;
            }),
            builer.addCase(featchOrderListAsync.rejected, (state) => {
                initialState;
            })

    }
});

export const { clearDataFilter } = checkOrderSlice.actions;
export default checkOrderSlice.reducer;