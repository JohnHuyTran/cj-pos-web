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
    clearItemsState: () => {
      initialState;
    },
  },
});

export const { updateItemsState, clearItemsState } = SupplierItemsSlice.actions;

export default SupplierItemsSlice.reducer;
