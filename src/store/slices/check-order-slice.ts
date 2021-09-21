import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getOrderList } from '../../mockdata/orders';
import { CheckOrderType } from '../../models/order';

type State = {
    orderList: Array<string> | null,
    error: string | null,
}



const initialState: State = {
    orderList: [],
    error: '',
};

export const featchOrderListAsync = createAsyncThunk(
    "orderList",
    async (payload: CheckOrderType, store) => {
        try {
            const response = await getOrderList(payload);
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
            builer.addCase(featchOrderListAsync.fulfilled, (state, action: PayloadAction<any>) => {
                state.orderList = action.payload;
            }),
            builer.addCase(featchOrderListAsync.rejected, (state) => {
                initialState;
            })

    }
});

export default checkOrderSlice.reducer;