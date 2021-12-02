import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SupplierSelectionState = {
  state: any;
};

const initialState: SupplierSelectionState = {
  state: {},
};

export const supplierSelectionSlice = createSlice({
  name: "supplierSelection",
  initialState,
  reducers: {
    changeState: (state, action: PayloadAction<any>) => {
      state.state = action.payload;
    },
  },
});

export const { changeState } = supplierSelectionSlice.actions;

export default supplierSelectionSlice.reducer;
