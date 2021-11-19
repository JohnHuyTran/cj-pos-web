import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CheckOrderDetailResponse } from "../../models/dc-check-order-model";
import { environment } from "../../environment-base";
import { get } from "../../adapters/posback-adapter";

type State = {
  orderDetail: CheckOrderDetailResponse;
  error: string;
};

const initialState: State = {
  orderDetail: {
    ref: "",
    code: 0,
    message: "",
    data: null,
  },
  error: "",
};

export const featchorderDetailDCAsync = createAsyncThunk(
  "orderDetailDC",
  async (id: string) => {
    try {
      const apiRootPath = environment.orders.dcCheckOrder.detailDC.url;
      let path = `${apiRootPath}/${id}`;

      let response: CheckOrderDetailResponse = {
        ref: "",
        code: 0,
        message: "",
        data: null,
      };

      response = await get(path).then();
      return response;
    } catch (error) {
      throw error;
    }
  }
);

const dcCheckOrderDetailSlice = createSlice({
  name: "dcCheckOrder",
  initialState,
  reducers: {
    clearDataFilter: (state) => initialState,
  },
  extraReducers: (builer) => {
    builer.addCase(featchorderDetailDCAsync.pending, () => {
      initialState;
    }),
      builer.addCase(
        featchorderDetailDCAsync.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.orderDetail = action.payload;
        }
      ),
      builer.addCase(featchorderDetailDCAsync.rejected, () => {
        initialState;
      });
  },
});

export const { clearDataFilter } = dcCheckOrderDetailSlice.actions;
export default dcCheckOrderDetailSlice.reducer;
