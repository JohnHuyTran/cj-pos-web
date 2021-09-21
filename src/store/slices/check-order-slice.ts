import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getOrderList } from '../../mockdata/orders';
import { CheckOrderType, Order } from '../../models/order';

type State = {
    orderList: Order | null,
    error: string | null,
}



const initialState: State = {
    orderList: null,
    error: '',
};

export const featchOrderListAsync = createAsyncThunk(
    "orderList",
    async (payload: CheckOrderType, store) => {
        try {
            const response: Order = await getOrderList(payload).then();
            console.log(`res: ${response}`);
            return response;
        } catch (error) {
            throw error;
        }
    }
);

const checkOrderSlice = createSlice({
    name: "checkOrder",
    initialState,
    reducers: {},
    extraReducers: (builer) => {
        builer.addCase(featchOrderListAsync.pending, (state) => {
            initialState;
        }),
            builer.addCase(featchOrderListAsync.fulfilled, (state, action: PayloadAction<Order>) => {
                state.orderList = action.payload;
            }),
            builer.addCase(featchOrderListAsync.rejected, (state) => {
                initialState;
            })

    }
});

export default checkOrderSlice.reducer;