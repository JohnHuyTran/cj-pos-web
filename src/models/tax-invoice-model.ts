export interface TaxInvoiceResponse {
  ref: string;
  code: number;
  message: string;
  data: TaxInvoiceInfo[];
}

export interface TaxInvoiceInfo {
  billNo: string;
  taxInvoiceNo: string;
  b: string;
}

export interface TaxInvoiceDetailResponse {
  ref: string;
  code: number;
  message: string;
  data: TaxInvoiceInfo | null;
}
