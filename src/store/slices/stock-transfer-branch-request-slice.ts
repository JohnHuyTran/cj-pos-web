import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { get } from '../../adapters/posback-adapter';
import { getStrockTransferMockup } from '../../mockdata/stock-transfer';
import { BranchTransferResponse } from '../../models/stock-transfer-model';
import { getPathBranchTransferDetail } from '../../services/stock-transfer';

type State = {
  branchTransferRs: BranchTransferResponse;
  error: string;
};

const initialState: State = {
  branchTransferRs: {
    ref: '',
    code: 0,
    message: '',
    data: null,
  },
  error: '',
};

export const featchBranchTransferDetailAsync = createAsyncThunk('branchTransfer', async (btNo: string) => {
  try {
    const apiRootPath = getPathBranchTransferDetail(btNo); //remark
    let response: BranchTransferResponse = {
      ref: '',
      code: 0,
      message: '',
      data: null,
    };

    response = await get(apiRootPath).then();
    return response;
  } catch (error) {
    throw error;
  }
});

const branchTransferDetailSlice = createSlice({
  name: 'branchTransfer',
  initialState,
  reducers: {
    clearDataFilter: (state) => initialState,
  },
  extraReducers: (builer) => {
    builer.addCase(featchBranchTransferDetailAsync.pending, () => {
      initialState;
    }),
      builer.addCase(featchBranchTransferDetailAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.branchTransferRs = action.payload;
      }),
      builer.addCase(featchBranchTransferDetailAsync.rejected, () => {
        initialState;
      });
  },
});

export const { clearDataFilter } = branchTransferDetailSlice.actions;
export default branchTransferDetailSlice.reducer;
