export interface PurchaseInvoiceSearchCriteriaRequest {
  limit: string;
  page: string;
  paramQuery: string;
  piStatus: string;
  piType: string;
  dateFrom: string;
  dateTo: string;
  clearSearch?: boolean;
}

export interface PurchaseInvoiceSearchCriteriaResponse {
  ref: string;
  code: number;
  message: string;
  data: PurchaseInfo[];
  total: number;
  page: number;
  perPage: number;
  prev: number;
  next: number;
  totalPage: number;
}

export interface PurchaseInfo {
  id: string;
  docNo: string;
  docDate: string;
  branchCode: string;
  vatType: number;
  supplierCode: string;
  supplierName: string;
  supplierAddress: string;
  supplierTaxNo: string;
  creditTerm: number;
  dueDate: string;
  shipmentDate: string;
  createdDate: string;
  piStatus: number;
  piType: number;
  piNo: string;
  comment: string;
}
