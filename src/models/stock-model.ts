export interface OutstandingRequest {
  stockId?: string;
  locationId?: string;
  productList?: string[];
  branchId?: string;
  dateFrom?: string;
  limit?: string;
  page?: string;
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
  id?: string;
  btNo?: string;
  rtNo: string;
  startDate: string;
  endDate: string;
  branchFrom: string;
  branchFromName: string;
  branchTo: string;
  branchToName: string;
  transferReason: string;
  status: string;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
}
