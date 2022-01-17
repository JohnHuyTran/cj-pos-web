export interface StockTransferRequest {
  limit: string;
  page: string;
  docNo?: string;
  branchFrom: string;
  branchTo: string;
  dateFrom?: string;
  dateTo?: string;
  statuses?: string;
  transferReason?: string;
  clearSearch?: boolean;
}
export interface StockTransferResponse {
  ref: string;
  code: number;
  message: string;
  data: StockTransferInfo[];
  total: number;
  page: number;
  perPage: number;
  prev: number;
  next: number;
  totalPage: number;
}

export interface StockTransferInfo {
  id: string;
  btNo: string;
  sdNo: string;
  startDate: string;
  endDate: string;
  branchFrom: string;
  branchTo: string;
  transferReason: string;
  createdBy: string;
  lastModifiedBy: string;
  createdDate: string;
  lastModifiedDate: string;
  status: number;
}
export interface SaveStockTransferRequest {
  btNo: string;
  sdNo: string;
  startDate: string;
  endDate: string;
  branchFrom: string;
  branchTo: string;
  transferReason: string;
  items: StockTransferItems[];
}

export interface StockTransferItems {
  barcode: string;
  orderQty: number;
}
