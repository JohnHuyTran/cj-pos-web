export interface SACalculateRequest {
  id: string;
  perPage: number;
  page: number;
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
