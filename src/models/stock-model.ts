export interface OutstandingRequest {
  locationCode?: string;
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
  storeCode: string;
  storeName: string;
  locationCode?: string;
  locationName?: string;
  availableQty: number;
  unitCode: string;
  unitName: string;
  minBeauty?: number;
  maxBeauty?: number;
  barFactor?: number;
}

export interface StockMovementResponse {
  timestamp: string;
  ref: string;
  code: number;
  message: string;
  data: StocmMomentInfoType[];
  total: number;
  page: number;
  perPage: number;
  totalPage: number;
}

export interface StocmMomentInfoType {
  id: string;
  movementDate: string;
  movementTypeCode: string;
  movementTypeName: string;
  branchCode: string;
  locationCode: string;
  skuCode: string;
  barcodes: Barcode[];
  unitCode: string;
  unitName: string;
  priorQty: number;
  movementQty: number;
  balanceQty: number;
}

export interface Barcode {
  barcode: string;
  qty: number;
  unitCode: string;
  unitName: string;
  barFactor: number;
  baseUnitQty: number;
}
