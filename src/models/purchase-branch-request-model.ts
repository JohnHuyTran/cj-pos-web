export interface PurchaseBranchSearchRequest {
  limit: string;
  page: string;
  docNo?: string;
  branchCode?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  clearSearch?: boolean;
}
export interface PurchaseBranchSearchrResponse {
  ref: string;
  code: number;
  message: string;
  data: PurChaseBranchInfo[];
  total: number;
  page: number;
  perPage: number;
  prev: number;
  next: number;
  totalPage: number;
}

export interface PurChaseBranchInfo {
  docNo: string;
  branchCode: string;
  branchName: string;
  status: string;
  createdBy: string;
  createByFullName: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
}
// export interface SaveStockTransferRequest {
//   rtNo: string;
//   startDate: string;
//   endDate: string;
//   branchFrom: string;
//   branchTo: string;
//   transferReason: string;
//   itemGroups: StockTransferitemGroupsRequest[];
//   items: StockTransferItemsRequest[];
// }

// export interface StockTransferitemGroupsRequest {
//   skuCode?: string;
//   remainingQty?: number;
// }

// export interface StockTransferItemsRequest {
//   barcode?: string;
//   orderQty?: number;
// }

// export interface SubmitStockTransferRequest {
//   startDate: string;
//   endDate: string;
//   branchFrom: string;
//   branchTo: string;
//   transferReason: string;
//   itemGroups: ItemGroups[];
//   items: Item[];
// }

// export interface StockTransferItems {
//   barcode?: string;
//   skuCode?: string;
//   productName?: string;
//   baseUnit?: string;
//   unitCode?: string;
//   unitName?: string;
//   orderQty?: number;
//   orderAllQty?: number;
//   toleNo?: string;
// }

// export interface BranchTransferRequest {
//   btNo?: string;
//   sdNo?: string;
//   delivery?: Delivery;
//   comment?: string;
//   items?: Item[];
//   itemGroups?: ItemGroups[];
//   docNo?: string;
// }

// export interface BranchTransferResponse {
//   ref: string;
//   code: number;
//   message: string;
//   data: BranchTransferInfo | null;
// }
// export interface BranchTransferInfo {
//   id: string;
//   btNo: string;
//   rtNo: string;
//   branchCode: string;
//   startDate: string;
//   endDate: string;
//   branchFrom: string;
//   branchTo: string;
//   transferReason: string;
//   status: string;
//   comment: string;
//   items: Item[];
//   auditLogs: AuditLog[];
//   createdBy: string;
//   lastModifiedBy: string;
//   createdDate: string;
//   lastModifiedDate: string;
// }

// export interface AuditLog {
//   activity: string;
//   editBy: string;
//   editByName: string;
//   editDate: string;
//   comment: AuditLogComment | '';
// }

// export interface AuditLogComment {
//   by: string;
//   detail: string;
// }

// export interface itemGroups {
//   skuCode?: string;
//   productName?: string;
//   orderAllQty?: number;
//   remainingQty?: number;
// }

// export interface Item {
//   seqItem?: number;
//   skuCode?: string;
//   barcode?: string;
//   productName?: string;
//   barcodeName?: string;
//   barFactor?: number;
//   unitCode?: string;
//   unitName?: string;
//   orderQty?: number;
//   actualQty?: number;
//   toteCode?: string;
//   boNo?: boolean;
//   isDisable?: boolean;

//   orderAllQty?: number;
//   remainingQty?: number;
//   actualAllQty?: number;
//   edit?: boolean;
// }

// export interface ItemGroups {
//   skuCode: string;
//   productName?: string;
//   orderAllQty?: number;
//   actualAllQty?: number;
//   remainingQty?: number;
// }

// export interface BranchTransferResponse {
//   ref: string;
//   code: number;
//   message: string;
//   data: BranchTransferInfo | null;
// }
// export interface BranchTransferInfo {
//   id: string;
//   btNo: string;
//   rtNo: string;
//   branchCode: string;
//   startDate: string;
//   endDate: string;
//   branchFrom: string;
//   branchTo: string;
//   transferReason: string;
//   status: string;
//   comment: string;
//   items: Item[];
//   // itemsNew: Item_[];
//   itemGroups: ItemGroups[];
//   auditLogs: AuditLog[];
//   createdBy: string;
//   lastModifiedBy: string;
//   createdDate: string;
//   lastModifiedDate: string;
//   delivery: Delivery;
// }

// export interface StockRequestResponse {
//   ref: string;
//   code: number;
//   message: string;
//   data: StockRequestInfo | null;
//   auditLogs?: AuditLog[];
// }

// export interface StockRequestInfo {
//   id: string;
//   rtNo: string;
//   startDate?: Date;
//   endDate?: Date;
//   branchCode?: string;
//   branchFrom: string;
//   branchTo: string;
//   transferReason: string;
//   status: string;
//   itemGroups: itemGroups[];
//   items?: Item[];
//   auditLogs?: AuditLog[];
//   createdBy?: string;
//   createdDate: Date;
//   lastModifiedBy?: string;
//   lastModifiedDate?: string;
// }

// export interface Approve1StockTransferRequest {
//   comment: ApproveComment;
// }

// export interface Approve2StockTransferRequest {
//   branchTo: string;
//   comment: ApproveComment;
// }

// export interface ApproveComment {
//   by: string;
//   detail: string;
// }

// export interface Delivery {
//   fromDate: string;
//   toDate: string;
// }

// export interface StockBalanceType {
//   skuCodes?: string[];
//   branchCode?: string;
//   skuCode?: string;
//   stockRemain?: number;
//   baseUnitFactor?: string;
// }

// export interface skuType {
//   seqItem?: number;
//   skuCode?: string;
//   skuName: string;
//   remainStock?: number;
//   orderQty?: number;
//   actualQty?: number;
// }

// export interface StockBalanceResponseType {
//   data: StockBalanceType[];
// }

// export interface ImportStockRequest {
//   file?: File;
//   startDate: string;
//   endDate: string;
//   transferReason: string;
// }

// export interface Approve2MultipleStockRequest {
//   rtNos: string[];
// }

// export interface Approve2BySCMStockRequest {
//   startDate: string;
//   endDate: string;
//   branchFrom: string;
//   branchTo: string;
//   transferReason: string;
//   itemGroups: ItemGroups[];
//   items: Item[];
// }
