import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StockAdjustmentSearchRequest } from "../../models/stock-adjustment-model";

type State = {
  searchCriteria: StockAdjustmentSearchRequest;
};

const initialState: State = {
  searchCriteria: {
    perPage: '10',
    page: '1',
    query: '',
    branch: '',
    status: '',
    startDate: '',
    endDate: '',
  },
};

const stockAdjustmentCriteriaSearchSlice = createSlice({
  name: 'stockAdjustmentCriteriaSearchSlice',
  initialState,
  reducers: {
    saveSearchCriteriaSA: (state, action: PayloadAction<any>) => {
      state.searchCriteria = action.payload;
    },
  },
});

export const { saveSearchCriteriaSA } = stockAdjustmentCriteriaSearchSlice.actions;
export default stockAdjustmentCriteriaSearchSlice.reducer;
