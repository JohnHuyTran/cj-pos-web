import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BranchResponse } from '../../models/search-branch-model';
import { environment } from '../../environment-base';
import { get } from '../../adapters/posback-adapter';

type State = {
  provinceList: BranchResponse;
  branchList: BranchResponse;
  error: string;
};

const initialState: State = {
  provinceList: {
    ref: '',
    code: 0,
    message: '',
    data: [],
  },
  branchList: {
    ref: '',
    code: 0,
    message: '',
    data: [],
  },
  error: '',
};

export const featchProvinceListAsync = createAsyncThunk('ProvinceList', async () => {
  try {
    const path = environment.test.province.url;

    let response = await get(path).then();

    return response;
  } catch (error) {
    throw error;
  }
});

export const featchBranchProvinceListAsync = createAsyncThunk('BranchList', async () => {
  try {
    const path = environment.test.province.url;

    let response = await get(path).then();

    return response;
  } catch (error) {
    throw error;
  }
});

const searchBranchSlice = createSlice({
  name: 'searchBranchProvince',
  initialState,
  reducers: {},
  extraReducers: (builer) => {
    builer.addCase(featchProvinceListAsync.pending, () => {
      initialState;
    }),
      builer.addCase(featchProvinceListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.provinceList = action.payload;
      }),
      builer.addCase(featchProvinceListAsync.rejected, () => {
        initialState;
      }),
      builer.addCase(featchBranchProvinceListAsync.pending, () => {
        initialState;
      }),
      builer.addCase(featchBranchProvinceListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.branchList = action.payload;
      }),
      builer.addCase(featchBranchProvinceListAsync.rejected, () => {
        initialState;
      });
  },
});

export default searchBranchSlice.reducer;
