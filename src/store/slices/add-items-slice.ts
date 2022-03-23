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
      console.log('update state', action.payload);
      state.state = action.payload;
    },
  },
});

export const { updateAddItemsState } = AddItemsSlice.actions;

export default AddItemsSlice.reducer;
