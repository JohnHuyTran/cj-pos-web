export interface AuditHistorySearchRequest {
    perPage: string;
    page: string;
    docNo: string;
    skuName: string;
    branch: string;
    status: string;
    creationDateFrom: string;
    creationDateTo: string;
    clearSearch?: boolean;
    type?: string | undefined;
  }
  
  export interface AuditHistorySearchResponse {
    ref: string;
    code: number;
    message: string;
    data: AuditHistory[];
    total: number;
    page: number;
    perPage: number;
    totalPage: number;
  }
  
  export interface AuditHistory {
    id: string;
    branchCode: string;
    branchName: string;
    requester: string;
    documentNumber: string;
    status: string;
    storeType: number;
    createdDate: string;
    countingTime: number;
    documentNumberAP: string;
    createdBy: string;
    APId: string;
    APDocumentNumber: string;
    products: AuditHistoryProductDetail[];
  }
  
  export interface AuditHistoryProductDetail {
    barcode: string;
    productName: string;
    sku: string;
    numberOfRequested: number;
    numberOfApproved: number;
    remark: string;
    unitName: string;
  }
  
  export interface AuditHistoryDetailResponse {
    ref: string;
    code: number;
    message: string;
    data: any;
  }
  