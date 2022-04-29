export interface OutstandingRequest {
  storeCode?: string;
  skuCodes?: string[];
  branchCode?: string;
  dateFrom?: string;
  limit?: number;
  page?: number;
  dateTo?: string;
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

export interface StockInfo {
  barcode?: string;
  barcodeName?: string;
  skuCode: string;
  skuName: string;
  locationCode: string;
  locationName: string;
  availableQty: number;
  unitCode: string;
  unitName: string;
  barFactor?: number;
  positions?: positionInfo[];
}

export interface positionInfo {
  name: string;
  code: string;
  minBeauty: number;
  maxBeauty: number;
}
