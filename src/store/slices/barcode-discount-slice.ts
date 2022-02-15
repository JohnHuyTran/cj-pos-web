import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';

type ItemsState = {
  createDraft: any;
  validate: boolean;
  dataDetail: any;
  approveReject: any;
  errorList: any;
  checkStock: any;
  checkEdit: boolean;
};
const initialState: ItemsState = {
  createDraft: {
    branchId: '61dffd619bfc3701dce4eda4',
    regionId: '61de9ddab10bfe85dfab22e9',
    requesterId: '61de9ddab10bfe85dfab22e9',
    percentDiscount: true,
    requesterNote: '',
    products: [],
  },
  validate: false,
  dataDetail: {
    id: '',
    documentNumber: '',
    status: 0,
    createdDate: moment(new Date()).toISOString(),
    percentDiscount: true,
  },
  approveReject: {
    branchId: '61dffd619bfc3701dce4eda4',
    regionId: '61de9ddab10bfe85dfab22e9',
    requesterId: '61de9ddab10bfe85dfab22e9',
    id: '',
    products: [],
    approvalNote: '',
    reason: '',
  },
  errorList: [],
  checkStock: [],
  checkEdit: false,
};

const barcodeDiscountSlice = createSlice({
  name: 'barcode',
  initialState,
  reducers: {
    saveBarcodeDiscount: (state, action: PayloadAction<any>) => {
      state.createDraft = action.payload;
    },
    updateValidate: (state, action: any) => {
      state.validate = action.payload;
    },
    updateDataDetail: (state, action: any) => {
      state.dataDetail = action.payload;
    },
    updateErrorList: (state, action: any) => {
      state.errorList = action.payload;
    },
    updateCheckStock: (state, action: any) => {
      state.checkStock = action.payload;
    },
    updateCheckEdit: (state, action: any) => {
      state.checkEdit = action.payload;
    },
    updateApproveEdit: (state, action: any) => {
      state.approveReject = action.payload;
    },
  },
});
export const {
  saveBarcodeDiscount,
  updateValidate,
  updateDataDetail,
  updateErrorList,
  updateCheckStock,
  updateCheckEdit,
  updateApproveEdit
} = barcodeDiscountSlice.actions;
export default barcodeDiscountSlice.reducer;
