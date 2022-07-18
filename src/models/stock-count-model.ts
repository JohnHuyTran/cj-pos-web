export interface StockCountSearchRequest {
  perPage: string;
  page: string;
  query: string;
  branch: string;
  status: string;
  startDate: string;
  endDate: string;
  clearSearch?: boolean;
  type?: string | undefined;
}

export interface StockCountSearchResponse {
  ref: string;
  code: number;
  message: string;
  data: StockCount[];
  total: number;
  page: number;
  perPage: number;
  totalPage: number;
}

export interface StockCount {
  id: string;
  branch: string;
  branchName: string;
  requester: string;
  documentNumber: string;
  status: string;
  store: string;
  createdDate: string;
  countingTimes: number;
  documentNumberAP: string;
  products: StockCountProductDetail[];
}

export interface StockCountProductDetail {
  barcode: string;
  productName: string;
  sku: string;
  numberOfRequested: number;
  numberOfApproved: number;
  remark: string;
  unitName: string;
}

export interface StockCountDetailResponse {
  ref: string;
  code: number;
  message: string;
  data: any;
}
