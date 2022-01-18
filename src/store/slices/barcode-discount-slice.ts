import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DiscountDetail } from "../../models/barcode-discount";

type ItemsState = {
  createDraft: any;
  validate: boolean;
};
const initialState: ItemsState = {
  createDraft: {
    branchId: "61de9ddab10bfe85dfab22e9",
    regionId: "61de9ddab10bfe85dfab22e9",
    requesterId: "61de9ddab10bfe85dfab22e9",
    percentDiscount: true,
    requestorNote: "",
    products: [],
  },
  validate: false,
};

const barcodeDiscountSlice = createSlice({
  name: "barcode",
  initialState,
  reducers: {
    saveBarcodeDiscount: (state, action: PayloadAction<any>) => {
      state.createDraft = action.payload;
    },
    updateValidate: (state, action: any) => {
      state.validate = action.payload;
    },
  },
});
export const { saveBarcodeDiscount } = barcodeDiscountSlice.actions;
export default barcodeDiscountSlice.reducer;
