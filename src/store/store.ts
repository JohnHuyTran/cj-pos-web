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
import stockTransferRtSlice from './slices/stock-transfer-rt-slice';
import saveSearchStock from './slices/save-search-stock-transfer-slice';
import saveSearchStockRt from './slices/save-search-stock-transfer-rt-slice';
import barcodeDiscountSearchSlice from './slices/barcode-discount-search-slice';
import barcodeDiscountCriteriaSearchSlice from './slices/barcode-discount-criteria-search-slice';
import barcodeDiscount from './slices/barcode-discount-slice';
import barcodeDiscountDetailSlice from './slices/barcode-discount-detail-slice';
import stockRequestDetail from './slices/stock-request-detail-slice';
import branchTransferDetailSlice from './slices/stock-transfer-branch-request-slice';
import searchStockTransferRt from './slices/save-search-stock-transfer-rt-slice';
import searchBranchProvince from './slices/search-branches-province-slice';
import searchTypeAndProduct from './slices/search-type-product-slice';
import addTypeAndProduct from './slices/add-type-product-slice';
import saleLimitTimeSlice from './slices/sale-limit-time-search-slice';
import saleLimitTime from './slices/sale-limit-time-slice';
import barcodeDiscountPrintSlice from './slices/barcode-discount-print-slice';
import saleLimitTimeDetailSlice from './slices/sale-limit-time-detail-slice';
import transferOutSlice from './slices/transfer-out-slice';
import transferOutDetailSlice from './slices/transfer-out-detail-slice';
import transferOutDestroySlice from './slices/transfer-out-destroy-slice';
import stockBalanceCheckSlice from './slices/stock-balance-check-slice';
import updateBTSkuSlice from './slices/stock-transfer-bt-sku-slice';
import updateBTProductSlice from './slices/stock-transfer-bt-product-slice';
import stockRequestItems from './slices/stock-request-items-slice';
import authorizedhBranchSlice from './slices/authorized-branch-slice';
import orderReceiveSlice from './slices/order-receive-slice';
import transferOutSearchSlice from './slices/transfer-out-search-slice';
import transferOutCriterSearchSlice from './slices/transfer-out-criteria-search-slice';
import taxInvoiceSearchDetail from './slices/tax-invoice-search-detail-slice';
import taxInvoiceSearchList from './slices/tax-invoice-search-list-slice';
import taxInvoicePrintHistory from './slices/sale/tax-invoice-print-history-slice';
import searchProvincesSlice from './slices/master/search-provinces-slice';
import searchDistrictsSlice from './slices/master/search-districts-slice';
import searchSubDistrictsSlice from './slices/master/search-subDistricts-slice';
import searchToteSlice from './slices/search-tote-slice';
import itemsToteSlice from './slices/items-tote-slice';
import checkOrderToteSlice from './slices/check-order-detail-tote-slice';

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
    searchStockTrnasferRt: stockTransferRtSlice,
    saveSearchStock: saveSearchStock,
    saveSearchStockRt: saveSearchStockRt,
    searchStockTransferRt: searchStockTransferRt,
    barcodeDiscount: barcodeDiscount,
    barcodeDiscountSearchSlice: barcodeDiscountSearchSlice,
    barcodeDiscountCriteriaSearchSlice: barcodeDiscountCriteriaSearchSlice,
    barcodeDiscountDetailSlice: barcodeDiscountDetailSlice,
    stockRequestDetail: stockRequestDetail,
    branchTransferDetailSlice: branchTransferDetailSlice,
    searchBranchProvince: searchBranchProvince,
    searchTypeAndProduct: searchTypeAndProduct,
    addTypeAndProduct: addTypeAndProduct,
    searchSaleLimitTime: saleLimitTimeSlice,
    saleLimitTime: saleLimitTime,
    barcodeDiscountPrintSlice: barcodeDiscountPrintSlice,
    saleLimitTimeDetailSlice: saleLimitTimeDetailSlice,
    transferOutSlice: transferOutSlice,
    transferOutDetailSlice: transferOutDetailSlice,
    transferOutDestroySlice: transferOutDestroySlice,
    stockBalanceCheckSlice: stockBalanceCheckSlice,
    updateBTSkuSlice: updateBTSkuSlice,
    updateBTProductSlice: updateBTProductSlice,
    stockRequestItems: stockRequestItems,
    authorizedhBranchSlice: authorizedhBranchSlice,
    orderReceiveSlice: orderReceiveSlice,
    transferOutSearchSlice: transferOutSearchSlice,
    transferOutCriterSearchSlice: transferOutCriterSearchSlice,
    taxInvoiceSearchList: taxInvoiceSearchList,
    taxInvoiceSearchDetail: taxInvoiceSearchDetail,
    taxInvoicePrintHistory: taxInvoicePrintHistory,
    searchProvincesSlice: searchProvincesSlice,
    searchDistrictsSlice: searchDistrictsSlice,
    searchSubDistrictsSlice: searchSubDistrictsSlice,
    searchToteSlice: searchToteSlice,
    itemsToteSlice: itemsToteSlice,
    checkOrderToteSlice: checkOrderToteSlice,
  },
});

// Types of root state and dispatch
type RootState = ReturnType<typeof store.getState>;
type AppDispath = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispath>();

export default store;
