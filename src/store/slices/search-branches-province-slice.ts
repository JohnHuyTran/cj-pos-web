import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BranchResponse, ProvinceResponse } from '../../models/search-branch-province-model';
import { environment } from '../../environment-base';
import { get } from '../../adapters/posback-adapter';

type State = {
  provinceList: ProvinceResponse;
  branchList: BranchResponse;
  totalBranches: number;
  payloadBranches: any;
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
  totalBranches: 620,
  payloadBranches: {
    isAllBranches: false,
  },
  error: '',
};

export const featchProvinceListAsync = createAsyncThunk('ProvinceList', async () => {
  try {
    const path = environment.branch.province.url;

    let response = await get(path).then();

    return response;
  } catch (error) {
    throw error;
  }
});

export const featchBranchProvinceListAsync = createAsyncThunk('BranchList', async (params: string) => {
  try {
    const path = `${environment.branch.branch.url}?${params}`;

    let response = await get(path).then();

    return response;
  } catch (error) {
    throw error;
  }
});

const searchBranchSlice = createSlice({
  name: 'searchBranchProvince',
  initialState,
  reducers: {
    updatePayloadBranches: (state, action: PayloadAction<any>) => {
      state.payloadBranches = action.payload;
    },
  },
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
export const { updatePayloadBranches } = searchBranchSlice.actions;
export default searchBranchSlice.reducer;
