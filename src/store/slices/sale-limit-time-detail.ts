import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ItemsState = {
  listSelect: any;
  listAppliedProducts: any;
};
const initialState: ItemsState = {
  listAppliedProducts: [
    { type: 1, categoryTypeCode: '00001', categoryName: 'PSY' },
    { type: 1, categoryTypeCode: '00002', categoryName: 'WHISKY' },
    { type: 1, categoryTypeCode: '00003', categoryName: 'BEER' },
    {
      type: 2,
      categoryTypeCode: '00001',
      barcode: '18859333833972',
      skuCode: '000000000020030515',
      unitCode: 'KAR',
      unitName: 'ลัง',
      barcodeName: 'กรรไกรตกแต่งคิ้ว (019) Carton',
      unitPrice: 0,
      unitPriceText: '0.00',
      qty: 1,
    },
    {
      type: 2,
      categoryTypeCode: '00001',
      barcode: '8859333833975',
      skuCode: '000000000020030515',
      unitCode: 'PAK',
      unitName: 'แพค',
      barcodeName: 'กรรไกรตกแต่งคิ้ว (019) Pack',
      unitPrice: 0,
      unitPriceText: '0.00',
      qty: 1,
    },
    {
      type: 2,
      categoryTypeCode: '00001',
      barcode: '8859333833968',
      skuCode: '000000000020030515',
      unitCode: 'ST',
      unitName: 'ชิ้น',
      barcodeName: 'กรรไกรตกแต่งคิ้ว (019) Piece',
      unitPrice: 0,
      unitPriceText: '0.00',
      qty: 1,
    },

    {
      type: 2,
      categoryTypeCode: '00002',
      barcode: '18859333806075',
      skuCode: '000000000020024583',
      unitCode: 'KAR',
      unitName: 'ลัง',
      barcodeName: 'กรรไกรใหญ่คละสี Carton',
      unitPrice: 0,
      unitPriceText: '0.00',
      qty: 1,
    },
    {
      type: 2,
      categoryTypeCode: '00002',
      barcode: '8859333806016',
      skuCode: '000000000020024583',
      unitCode: 'PAK',
      unitName: 'แพค',
      barcodeName: 'กรรไกรใหญ่คละสี Pack',
      unitPrice: 0,
      unitPriceText: '0.00',
      qty: 1,
    },
    {
      type: 2,
      categoryTypeCode: '00002',
      barcode: '8859333805989',
      skuCode: '000000000020024583',
      unitCode: 'ST',
      unitName: 'ชิ้น',
      barcodeName: 'กรรไกรใหญ่คละสี Piece',
      unitPrice: 0,
      unitPriceText: '0.00',
      qty: 1,
    },
    {
      type: 2,
      categoryTypeCode: '00003',
      barcode: '18859333830575',
      skuCode: '000000000020029687',
      unitCode: 'KAR',
      unitName: 'ลัง',
      barcodeName: 'กิ๊บปากเป็ด 4 ชิ้น Carton',
      unitPrice: 0,
      unitPriceText: '0.00',
      qty: 1,
    },
  ],
  listSelect: [],
};

const saleLimitTineSlice = createSlice({
  name: 'STDetail',
  initialState,
  reducers: {
    updateListAppliedProducts: (state, action: PayloadAction<any>) => {
      state.listAppliedProducts = action.payload;
    },
    updateListSelect: (state, action: PayloadAction<any>) => {
      state.listSelect = action.payload;
    },
  },
});
export const { updateListSelect, updateListAppliedProducts } = saleLimitTineSlice.actions;
export default saleLimitTineSlice.reducer;
