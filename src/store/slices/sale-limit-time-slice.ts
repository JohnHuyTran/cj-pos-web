import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ItemsState = {
  state: any;
};

const initialState: ItemsState = {
  state: {},
};

export const saleLimitTime = createSlice({
  name: 'saleLimitTime',
  initialState,
  reducers: {
    updatesaleLimitTimeState: (state, action: PayloadAction<any>) => {
      state.state = action.payload;
    },
  },
});

export const { updatesaleLimitTimeState } = saleLimitTime.actions;

export default saleLimitTime.reducer;
