import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ShipmentRequest } from '../../models/order-model';

type State = {
  searchCriteria: ShipmentRequest;
};

const initialState: State = {
  searchCriteria: {
    limit: '10',
    page: '1',
    sortBy: '',
    sortDirection: '',
    shipmentNo: '',
    sdNo: '',
    dateFrom: '',
    dateTo: '',
    sdStatus: -1,
    sdType: -1,
  },
};

const saveSearchOrder = createSlice({
  name: 'searchCriteria',
  initialState,
  reducers: {
    saveSearchCriteria: (state, action: PayloadAction<any>) => {
      state = action.payload;
    },
    clearSearchCriteria: () => {
      initialState;
    },
  },
});

export const { saveSearchCriteria, clearSearchCriteria } =
  saveSearchOrder.actions;
export default saveSearchOrder.reducer;
