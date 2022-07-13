import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ExpenseSearchRequest, ExpenseSearchResponse } from '../../../models/branch-accounting-model';
import { environment } from '../../../environment-base';
import { get } from '../../../adapters/posback-adapter';

// import { BranchAccountingSearch } from '../../../mockdata/branch-accounting-search';

type State = {
  branchAccountingList: ExpenseSearchResponse;
  error: string;
};

const initialState: State = {
  branchAccountingList: {
    ref: '',
    timestamp: '',
    prev: 0,
    next: 0,
    code: 0,
    message: '',
    data: [],
    total: 0,
    page: 0,
    perPage: 0,
    totalPage: 0,
  },
  error: '',
};

export const featchBranchAccountingListAsync = createAsyncThunk('ExpenseSearchRequest',
async (payload: ExpenseSearchRequest) => {
  try {
    const apiRootPath = environment.branchAccounting.expense.search.url;
    let path = `${apiRootPath}?limit=${payload.limit}&page=${payload.page}&type=${payload.type}`+
    `&branchCode=${payload.branchCode}&status=${payload.status}&month=${payload.month}&year=${payload.year}`;
    
    if (payload.period !== 0) {
      path = `${path}&period=${payload.period}`;
    }
    let response: ExpenseSearchResponse = {
      ref: '',
      timestamp: '',
      prev: 0,
      next: 0,
      code: 0,
      message: '',
      data: [],
      total: 0,
      page: 0,
      perPage: 0,
      totalPage: 0,
    }
    response = await get(path).then();
    return response;
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
