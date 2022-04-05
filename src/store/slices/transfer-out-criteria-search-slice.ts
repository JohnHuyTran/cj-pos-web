import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TransferOutSearchRequest } from '../../models/transfer-out-model';

type State = {
  searchCriteria: TransferOutSearchRequest;
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

const transferOutCriteriaSearchSlice = createSlice({
  name: 'searchCriteriaBD',
  initialState,
  reducers: {
    saveSearchCriteriaTO: (state, action: PayloadAction<any>) => {
      state.searchCriteria = action.payload;
    },
    clearSearchCriteriaBD: () => {
      initialState;
    },
  },
});

export const { saveSearchCriteriaTO, clearSearchCriteriaBD } = transferOutCriteriaSearchSlice.actions;
export default transferOutCriteriaSearchSlice.reducer;
