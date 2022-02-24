import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ItemsState = {
  state: any;
  checkEdit: boolean;
};

const initialState: ItemsState = {
  state: {},
  checkEdit: false
};

export const saleLimitTime = createSlice({
  name: 'saleLimitTime',
  initialState,
  reducers: {
    updatesaleLimitTimeState: (state, action: PayloadAction<any>) => {
      state.state = action.payload;
    },
    setCheckEdit: (state, action) => {
      state.checkEdit = action.payload
    }
  },
});

export const { updatesaleLimitTimeState, setCheckEdit } = saleLimitTime.actions;

export default saleLimitTime.reducer;
