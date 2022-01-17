import { configureStore } from '@reduxjs/toolkit';
import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux';

import authSlice from './slices/authSlice';
import checkOrderSlice from './slices/check-order-slice';
import checkOrderDetailSlice from './slices/check-order-detail-slice';
import dcCheckOrderSlice from './slices/dc-check-order-slice';
import navSlice from './slices/nav-slice';
import productSlice from './slices/productSlice';
import saveSearchOrder from './slices/save-search-order';
import saveSearchOrderDc from './slices/save-search-order-dc-slice';
import searchBranchSlice from './slices/search-branches-slice';
import checkOrderSDSlice from './slices/check-order-sd-slice';
import dcCheckOrderDetailSlice from './slices/dc-check-order-detail-slice';
import supplierCheckOrderSlice from './slices/supplier-check-order-slice';
import saveSearchOrderSup from './slices/save-search-order-supplier-slice';
import supplierOrderDetail from './slices/supplier-order-detail-slice';
import SupplierOrderReturn from './slices/supplier-order-return-slice';
import searchItemBySupSlice from './slices/search-item-by-sup-slice';
import supplierOrderPIDetail from './slices/supplier-order-pi-detail-slice';
import supplierSelectionSlice from './slices/supplier-selection-slice';
import searchSupplierSelectionSlice from './slices/search-supplier-selection-slice';
import searchSupplierSelectionPOSlice from './slices/search-supplier-selection-po-slice';
import supplierAddItems from './slices/supplier-add-items-slice';
import SupplierSearchAddItemsSlice from './slices/supplier-search-add-items-slice';
import UploadFileSlice from './slices/upload-file-slice';
import searchAllItemsList from './slices/search-all-items';
import addItems from './slices/add-items-slice';
import transferReasonsList from './slices/transfer-reasons-slice';
import stockTransferSlice from './slices/stock-transfer-slice';
import saveSearchStock from './slices/save-search-stock-transfer-slice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    checkOrderList: checkOrderSlice,
    checkOrderDetail: checkOrderDetailSlice,
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
    supplierOrderDetail: supplierOrderDetail,
    SupplierOrderReturn: SupplierOrderReturn,
    searchItemListBySup: searchItemBySupSlice,
    supplierOrderPIDetail: supplierOrderPIDetail,
    supplierSelectionSlice: supplierSelectionSlice,
    searchSupplierSelectionSlice: searchSupplierSelectionSlice,
    searchSupplierSelectionPOSlice: searchSupplierSelectionPOSlice,
    supplierAddItems: supplierAddItems,
    supplierSearchAddItems: SupplierSearchAddItemsSlice,
    uploadFileSlice: UploadFileSlice,
    searchAllItemsList: searchAllItemsList,
    addItems: addItems,
    transferReasonsList: transferReasonsList,
    searchStockTransfer: stockTransferSlice,
    saveSearchStock: saveSearchStock,
  },
});

// Types of root state and dispatch
type RootState = ReturnType<typeof store.getState>;
type AppDispath = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispath>();

export default store;
