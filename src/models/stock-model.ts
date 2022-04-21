export interface OutstandingRequest {
  store?: string;
  skuCodes?: string[];
  branchCode?: string;
  dateFrom?: string;
  limit?: number;
  page?: number;
}

export interface OutstandingResponse {
  ref: string;
  code: number;
  message: string;
  data: StockInfo[];
  total: number;
  page: number;
  perPage: number;
  prev: number;
  next: number;
  totalPage: number;
}

// export interface StockInfo {
//   id?: string;
//   btNo?: string;
//   rtNo: string;
//   startDate: string;
//   endDate: string;
//   branchFrom: string;
//   branchFromName: string;
//   branchTo: string;
//   branchToName: string;
//   transferReason: string;
//   status: string;
//   createdBy: string;
//   createdDate: string;
//   lastModifiedBy: string;
//   lastModifiedDate: string;
// }

export interface SearchCriteriaLocationResponse {
  ref: string;
  code: number;
  message: string;
  // data: StockCriteriaInfo[];
  total: number;
  page: number;
  perPage: number;
  prev: number;
  next: number;
  totalPage: number;
}
export interface StockInfo {
  barcode: string;
  barcodeName: string;
  skuCode: string;
  skuName: string;
  storeCode: string;
  storeName: string;
  locationCode: string;
  locationName: string;
  availableQty: number;
  unitCode: string;
  unitName: string;
  minBeauty: number;
  maxBeauty: number;
  barFactor: number;
}
