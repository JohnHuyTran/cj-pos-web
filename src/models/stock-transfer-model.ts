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
