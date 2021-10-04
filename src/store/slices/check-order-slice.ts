import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getOrderList } from '../../mockdata/orders';
import { CheckOrderRequest, Order, CheckOrderResponse } from '../../models/order-model';

type State = {
    orderList: Order[];
    error: string;
}



const initialState: State = {
    orderList: [],
    error: "",
};

export const featchOrderListAsync = createAsyncThunk(
    "orderList",
    async (payload: CheckOrderRequest, store) => {
        try {
            const response: Order = await getOrderList(payload).then();
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
            state.orderList = []
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