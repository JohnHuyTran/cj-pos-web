import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { environment } from '../../environment-base';
import { get } from '../../adapters/posback-adapter';
import { AuditPlanDetailResponse } from '../../models/audit-plan';

type State = {
  auditPlanDetail: AuditPlanDetailResponse;
  error: string;
};

const initialState: State = {
  auditPlanDetail: {
    ref: '',
    code: 0,
    message: '',
    data: {
      id: '',
      branchCode: '',
      branchName: '',
      createdBy: '',
      documentNumber: '',
      status: '',
      createdDate: '',
      countingDate: '',
      product: [],
    },
  },
  error: '',
};

export const getAuditPlanDetail = createAsyncThunk('getAuditPlanDetail', async (id: string) => {
  try {
    const apiRootPath = `${environment.checkStock.auditPlan.detail.url}/${id}`;
    let response: AuditPlanDetailResponse = {
      ref: '',
      code: 0,
      message: '',
      data: {
        id: '',
        branchCode: '',
        branchName: '',
        createdBy: '',
        documentNumber: '',
        status: '',
        createdDate: '',
        countingDate: '',
        product: [],
      },
    };
    response = await get(apiRootPath).then();
    return response;
  } catch (error) {
    throw error;
  }
});

const auditPlanDetailSlice = createSlice({
  name: 'auditPlanDetailSlice',
  initialState,
  reducers: {
    clearDataFilter: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getAuditPlanDetail.pending, () => {
      initialState;
    }),
      builder.addCase(getAuditPlanDetail.fulfilled, (state, action: PayloadAction<any>) => {
        state.auditPlanDetail = action.payload;
      }),
      builder.addCase(getAuditPlanDetail.rejected, () => {
        initialState;
      });
  },
});

export const { clearDataFilter } = auditPlanDetailSlice.actions;
export default auditPlanDetailSlice.reducer;
