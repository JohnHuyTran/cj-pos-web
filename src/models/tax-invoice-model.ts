export interface TaxInvoiceRequest {
  limit?: string;
  page?: string;
  docNo?: string;
  sortBy?: string;
  billNo?: string;
}
export interface TaxInvoiceResponse {
  ref: string;
  code: number;
  message: string;
  data: TaxInvoiceInfo[];
  total: number;
  perPage: number;
  page: number;
}

export interface TaxInvoiceInfo {
  billNo: string;
  docDate: string;
  status?: string;
  invoiceNo?: string;
  totalPrint?: number;
  lastPrintedDate?: string;
}

export interface TaxInvoiceDetailResponse {
  ref: string;
  code: number;
  message: string;
  data: TaxInvoiceDetail | null;
}
export interface TaxInvoiceDetail {
  invoiceNo: string;
  billNo: string;
  status: string;
  customer: Customer;
}

export interface Customer {
  memberNo: string;
  taxNo: string;
  firstName: string;
  lastName: string;
  address: Address;
}

export interface Address {
  houseNo: string;
  building: string;
  moo: string;
  subDistrictCode: number;
  districtCode: number;
  provinceCode: number;
  postcode: string;
}

export interface SaveInvoiceRequest {
  billNo: string;
  customer: Customer;
}
