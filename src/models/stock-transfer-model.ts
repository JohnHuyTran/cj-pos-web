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
  rtNo: string;
  sdNo: string;
  startDate: string;
  endDate: string;
  branchFrom: string;
  branchFromName: string;
  branchTo: string;
  branchToName: string;
  transferReason: string;
  createdBy: string;
  lastModifiedBy: string;
  createdDate: string;
  lastModifiedDate: string;
  status: string;
}
export interface SaveStockTransferRequest {
  rtNo: string;
  // sdNo: string;
  startDate: string;
  endDate: string;
  branchFrom: string;
  branchTo: string;
  transferReason: string;
  items: StockTransferItems[];
}

export interface StockTransferItems {
  barcode?: string;
  skuCode?: string;
  productName?: string;
  baseUnit?: string;
  unitCode?: string;
  unitName?: string;
  orderQty?: number;
  orderAllQty?: number;
  toleNo?: string;
}

export interface BranchTransferRequest {
  btNo?: string;
  sdNo?: string;
  startDate?: string;
  endDate?: string;
  comment?: string;
  items?: Item[];
}

export interface BranchTransferResponse {
  ref: string;
  code: number;
  message: string;
  data: BranchTransferInfo | null;
}
export interface BranchTransferInfo {
  id: string;
  btNo: string;
  rtNo: string;
  branchCode: string;
  startDate: string;
  endDate: string;
  branchFrom: string;
  branchTo: string;
  transferReason: string;
  status: string;
  comment: string;
  items: Item[];
  auditLogs: AuditLog[];
  createdBy: string;
  lastModifiedBy: string;
  createdDate: string;
  lastModifiedDate: string;
}

export interface AuditLog {
  activity: string;
  editBy: string;
  editByName: string;
  editDate: string;
}

export interface Item {
  seqItem?: number;
  skuCode?: string;
  barcode?: string;
  productName?: string;
  baseUnit?: number;
  unitCode?: string;
  unitName?: string;
  remainStock?: number;
  qty?: number;
  allQty?: number;
  actualQty?: number;
  actualAllQty?: number;
  toteCode?: string;
  orderQty?: number;
  orderAllQty?: number;
  isDraft?: boolean;
}

export interface BranchTransferResponse {
  ref: string;
  code: number;
  message: string;
  data: BranchTransferInfo | null;
}
export interface BranchTransferInfo {
  id: string;
  btNo: string;
  rtNo: string;
  branchCode: string;
  startDate: string;
  endDate: string;
  branchFrom: string;
  branchTo: string;
  transferReason: string;
  status: string;
  comment: string;
  items: Item[];
  auditLogs: AuditLog[];
  createdBy: string;
  lastModifiedBy: string;
  createdDate: string;
  lastModifiedDate: string;
}

export interface AuditLog {
  activity: string;
  editBy: string;
  editByName: string;
  editDate: string;
}

export interface Item {
  seqItem?: number;
  skuCode?: string;
  barcode?: string;
  productName?: string;
  baseUnit?: number;
  unitCode?: string;
  unitName?: string;
  remainStock?: number;
  qty?: number;
  allQty?: number;
  actualQty?: number;
  actualAllQty?: number;
  toteCode?: string;
  orderQty?: number;
  orderAllQty?: number;
}

export interface StockRequestResponse {
  ref: string;
  code: number;
  message: string;
  data: StockRequestInfo | null;
}

export interface StockRequestInfo {
  id: string;
  rtNo: string;
  startDate?: Date;
  endDate?: Date;
  branchCode?: string;
  branchFrom: string;
  branchTo: string;
  transferReason?: string;
  status?: string;
  items?: Item[];
  auditLogs?: AuditLog[];
  createdBy?: string;
  createdDate: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
}
