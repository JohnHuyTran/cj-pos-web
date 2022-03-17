import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { environment } from '../../environment-base';
import { get } from '../../adapters/posback-adapter';
import { ProvincesResponse } from '../../models/search-provinces-model';
import { Provinces } from '../../mockdata/provinces';

type State = {
  provincesList: ProvincesResponse;
  error: string;
};

const initialState: State = {
  provincesList: {
    ref: '',
    code: 0,
    message: '',
    data: [],
  },
  error: '',
};

export const featchProvincesListAsync = createAsyncThunk('ProvincesList', async () => {
  try {
    // const path = environment.master.provinces.url;
    // let response = await get(path).then();
    // return response;

    console.log('featchProvincesListAsync:', JSON.stringify(Provinces));
    return Provinces;
  } catch (error) {
    throw error;
  }
});

const searchProvincesSlice = createSlice({
  name: 'searchProvinces',
  initialState,
  reducers: {},
  extraReducers: (builer) => {
    builer.addCase(featchProvincesListAsync.pending, () => {
      initialState;
    }),
      builer.addCase(featchProvincesListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.provincesList = action.payload;
      }),
      builer.addCase(featchProvincesListAsync.rejected, () => {
        initialState;
      });
  },
});

// export const { clearDataFilter } = dcCheckOrderSlice.actions;
export default searchProvincesSlice.reducer;
