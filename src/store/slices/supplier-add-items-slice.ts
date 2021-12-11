import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SupplierItemsState = {
  state: any;
};

const initialState: SupplierItemsState = {
  state: {},
};

export const SupplierItemsSlice = createSlice({
  name: 'supplierSelection',
  initialState,
  reducers: {
    updateItemsState: (state, action: PayloadAction<any>) => {
      state.state = action.payload;
    },
  },
});

export const { updateItemsState } = SupplierItemsSlice.actions;

export default SupplierItemsSlice.reducer;
