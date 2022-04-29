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
  locationCode: string;
  locationName: string;
  availableQty: number;
  unitCode: string;
  unitName: string;
  barFactor?: number;
  positions?: positionInfo[];
}

export interface positionInfo {
  code: string;
  name: string;
  minBeauty: number;
  maxBeauty: number;
}

export interface StockMovementResponse {
  ref: string;
  code: number;
  message: string;
  data: StockMomentInfoType[];
  total: number;
  page: number;
  perPage: number;
  prev: number;
  next: number;
  totalPage: number;
}

export interface StockMomentInfoType {
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
