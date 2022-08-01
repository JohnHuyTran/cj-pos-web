export interface SACalculateRequest {
  perPage: number;
  page: number;
  id: string;
  filterDifference: any;
}

export interface SABarcodeCalculateResponse {
  ref: string;
  code: number;
  message: string;
  data: BarcodeCalculate[];
  total: number;
  page: number;
  perPage: number;
  totalPage: number;
}

export interface BarcodeCalculate {
  barcode: string;
  productName: string;
  sku: string;
  saleCounting: number;
  stockMovement: number;
  storeFrontCount: number;
  storeBackCount: number;
  availableStock: number;
  difference: number;
  tempStock: number;
  unitName: string;
}

export interface SASkuCalculateResponse {
  ref: string;
  code: number;
  message: string;
  data: SkuCalculate[];
  total: number;
  page: number;
  perPage: number;
  totalPage: number;
}

export interface SkuCalculate {
  barcode: string;
  skuName: string;
  sku: string;
  saleCounting: number;
  stockMovement: number;
  storeFrontCount: number;
  storeBackCount: number;
  availableStock: number;
  difference: number;
  tempStock: number;
  unitName: string;
  adjustedPrice: number;
  remark: string,
}

export interface StockAdjustmentDetailResponse {
  ref: string;
  code: number;
  message: string;
  data: any;
}
