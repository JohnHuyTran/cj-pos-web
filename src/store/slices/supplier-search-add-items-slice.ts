import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SupplierItemsState = {
  state: any;
};

const initialState: SupplierItemsState = {
  state: {},
};

export const SupplierSearchAddItemsSlice = createSlice({
  name: 'supplierSearchAddItems',
  initialState,
  reducers: {
    updateSearchItemsState: (state, action: PayloadAction<any>) => {
      state.state = action.payload;
    },
  },
});

export const { updateSearchItemsState } = SupplierSearchAddItemsSlice.actions;

export default SupplierSearchAddItemsSlice.reducer;
