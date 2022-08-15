import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { get } from '../../adapters/posback-adapter';
import { stringNullOrEmpty } from '../../utils/utils';
import { environment } from "../../environment-base";
import { AuditHistorySearchRequest, AuditHistorySearchResponse } from "../../models/audit-history-model";

type State = {
  toSearchResponse: AuditHistorySearchResponse;
  error: string;
};

const initialState: State = {
  toSearchResponse: {
    ref: '',
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

export const getAuditHistorySearch = createAsyncThunk(
  'getAuditHistorySearch',
  async (payload: AuditHistorySearchRequest) => {
    try {
      const apiRootPath = environment.checkStock.auditHistory.search.url;
      let path = `${apiRootPath}?perPage=${payload.perPage}&page=${payload.page}`;
      if (!stringNullOrEmpty(payload.docNo)) {
        path = path + `&docNo=${payload.docNo}`;
      }
      if(!stringNullOrEmpty(payload.skuName)){
        path = path + `&skuName=${payload.skuName}`
      }
      if (!stringNullOrEmpty(payload.branch) && 'ALL' !== payload.branch) {
        path = path + `&branch=${payload.branch}`;
      }
      if (!stringNullOrEmpty(payload.status) && 'ALL' !== payload.status) {
        path = path + `&status=${payload.status}`;
      }
      if (!stringNullOrEmpty(payload.creationDateFrom)) {
        path = path + `&creationDateFrom=${payload.creationDateFrom}`;
      }
      if (!stringNullOrEmpty(payload.creationDateTo)) {
        path = path + `&creationDateTo=${payload.creationDateTo}`;
      }
      let response: AuditHistorySearchResponse = {
        ref: '',
        code: 0,
        message: '',
        data: [],
        total: 0,
        page: 0,
        perPage: 0,
        totalPage: 0,
      };
      if (!payload.clearSearch) {
        response = await get(path).then();
      }
      return response;
    } catch (error) {
      throw error;
    }
  }
);

const AuditHistorySearchSlice = createSlice({
  name: 'AuditHistorySearchSlice',
  initialState,
  reducers: {
    clearDataFilter: (state) => initialState,
  },
  extraReducers: (builer) => {
    builer.addCase(getAuditHistorySearch.pending, () => {
      initialState;
    }),
      builer.addCase(getAuditHistorySearch.fulfilled, (state, action: PayloadAction<any>) => {
        state.toSearchResponse = action.payload;
      }),
      builer.addCase(getAuditHistorySearch.rejected, () => {
        initialState;
      });
  },
});

export const { clearDataFilter } = AuditHistorySearchSlice.actions;
export default AuditHistorySearchSlice.reducer;
