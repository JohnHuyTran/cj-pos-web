import { configureStore } from "@reduxjs/toolkit";
import { useSelector, useDispatch, TypedUseSelectorHook } from "react-redux";

import authSlice from "./slices/authSlice";
import checkOrderSlice from "./slices/check-order-slice";
import dcCheckOrderSlice from "./slices/dc-check-order-slice";
import navSlice from "./slices/nav-slice";
import productSlice from "./slices/productSlice";
import saveSearchOrder from "./slices/save-search-order";
import saveSearchOrderDc from "./slices/save-search-order-dc-slice";
import searchBranchSlice from "./slices/search-branches-slice";
import checkOrderSDSlice from "./slices/check-order-sd-slice";
import dcCheckOrderDetailSlice from "./slices/dc-check-order-detail-slice";
import supplierCheckOrderSlice from "./slices/supplier-check-order-slice";
import saveSearchOrderSup from "./slices/save-search-order-supplier-slice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    checkOrderList: checkOrderSlice,
    checkOrderSDList: checkOrderSDSlice,
    dcCheckOrderList: dcCheckOrderSlice,
    dcCheckOrderDetail: dcCheckOrderDetailSlice,
    navigator: navSlice,
    product: productSlice,
    saveSearchOrder: saveSearchOrder,
    saveSearchOrderDc: saveSearchOrderDc,
    searchBranchSlice: searchBranchSlice,
    supplierCheckOrderSlice: supplierCheckOrderSlice,
    saveSearchOrderSup: saveSearchOrderSup,
  },
});

// Types of root state and dispatch
type RootState = ReturnType<typeof store.getState>;
type AppDispath = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispath>();

export default store;
