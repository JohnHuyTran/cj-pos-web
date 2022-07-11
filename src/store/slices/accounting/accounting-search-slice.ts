import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BranchAccountingSearch } from '../../../mockdata/branch-accounting-search';

type State = {
  branchAccountingList: any;
  error: string;
};

const initialState: State = {
  branchAccountingList: {
    ref: '',
    code: 0,
    message: '',
    data: [],
  },
  error: '',
};

export const featchBranchAccountingListAsync = createAsyncThunk('BranchAccountingList', async () => {
  try {
    return BranchAccountingSearch;
  } catch (error) {
    throw error;
  }
});

const searchBranchAccountingSlice = createSlice({
  name: 'searchBranchAccounting',
  initialState,
  reducers: {},
  extraReducers: (builer) => {
    builer.addCase(featchBranchAccountingListAsync.pending, () => {
      initialState;
    }),
      builer.addCase(featchBranchAccountingListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.branchAccountingList = action.payload;
      }),
      builer.addCase(featchBranchAccountingListAsync.rejected, () => {
        initialState;
      });
  },
});

// export const { clearDataFilter } = dcCheckOrderSlice.actions;
export default searchBranchAccountingSlice.reducer;
