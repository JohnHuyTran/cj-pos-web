import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ItemsState = {
  state: any;
};

const initialState: ItemsState = {
  state: {},
};

export const AddItemsSlice = createSlice({
  name: 'addItems',
  initialState,
  reducers: {
    updateAddItemsState: (state, action: PayloadAction<any>) => {
      state.state = action.payload;
    },
  },
});

export const { updateAddItemsState } = AddItemsSlice.actions;

export default AddItemsSlice.reducer;
