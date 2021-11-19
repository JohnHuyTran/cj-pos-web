export interface PurchaseInvoiceSearchCriteriaRequest {
  limit: string;
  page: string;
  paramQuery: string;
  piStatus: string;
  piType: string;
  dateFrom: string;
  dateTo: string;
}

export interface PurchaseInvoiceSearchCriteriaResponse {
  ref: string;
}
