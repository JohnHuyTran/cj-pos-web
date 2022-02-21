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
  totalBranches: 0,
  payloadBranches: {
    isAllBranches: true,
    appliedBranches: {
      province: [],
      branchList: [],
    },
    saved: false,
  },
  error: '',
};

export const fetchProvinceListAsync = createAsyncThunk('ProvinceList', async () => {
  try {
    const path = environment.branch.province.url;

    let response = await get(path).then();

    return response;
  } catch (error) {
    throw error;
  }
});

export const fetchBranchProvinceListAsync = createAsyncThunk('BranchList', async (params: string) => {
  try {
    const path = `${environment.branch.branch.url}?${params}`;

    let response = await get(path).then();

    return response;
  } catch (error) {
    throw error;
  }
});

export const fetchTotalBranch = createAsyncThunk('TotalBranch', async () => {
  try {
    const path = environment.branch.branchTotal.url;

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
    builer.addCase(fetchProvinceListAsync.pending, () => {
      initialState;
    }),
      builer.addCase(fetchProvinceListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.provinceList = action.payload;
      }),
      builer.addCase(fetchProvinceListAsync.rejected, () => {
        initialState;
      }),
      builer.addCase(fetchBranchProvinceListAsync.pending, () => {
        initialState;
      }),
      builer.addCase(fetchBranchProvinceListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.branchList = action.payload;
      }),
      builer.addCase(fetchBranchProvinceListAsync.rejected, () => {
        initialState;
      }),
      builer.addCase(fetchTotalBranch.pending, () => {
        initialState;
      }),
      builer.addCase(fetchTotalBranch.fulfilled, (state, action: PayloadAction<any>) => {
        state.totalBranches = action.payload.data;
      }),
      builer.addCase(fetchTotalBranch.rejected, () => {
        initialState;
      });
  },
});
export const { updatePayloadBranches } = searchBranchSlice.actions;
export default searchBranchSlice.reducer;
