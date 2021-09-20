import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ItemProduct } from "../../models/product-model";
import { get } from "../../adapters/posback-adapter";
import { environment } from "../../environment-base";

type productListState = {
  item: ItemProduct | null;
  loading: boolean;
  error: string;
};

const initialState: productListState = {
  item: null,
  loading: false,
  error: "",
};

export const fetchGetProductList = createAsyncThunk(
  "getProductlist",
  async () => {
    try {
      const response: ItemProduct = await get(environment.products.url).then(
        (result) => result.data
      );
      return response;
    } catch (error) {
      console.log("error = ", error);
      throw error;
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchGetProductList.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(
      fetchGetProductList.fulfilled,
      (state, action: PayloadAction<ItemProduct>) => {
        state.item = action.payload;
        state.loading = false;
        state.error = "";
      }
    );
    builder.addCase(fetchGetProductList.rejected, (state, action) => {
      state.item = null;
      state.loading = false;
      state.error = action.error.message || "";
    });
  },
});

export default productSlice.reducer;
