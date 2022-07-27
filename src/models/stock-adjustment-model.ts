export interface StockAdjustmentSearchRequest {
    perPage: string;
    page: string;
    query: string;
    branch: string;
    status: string;
    startDate: string;
    endDate: string;
    clearSearch?: boolean;
    type?: string | undefined;
  }
  
  export interface StockAdjustmentSearchResponse {
    ref: string;
    code: number;
    message: string;
    data: StockAdjustment[];
    total: number;
    page: number;
    perPage: number;
    totalPage: number;
  }
  
  export interface StockAdjustment {
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
    products: StockAdjustmentProductDetail[];
  }
  
  export interface StockAdjustmentProductDetail {
    barcode: string;
    productName: string;
    sku: string;
    numberOfRequested: number;
    numberOfApproved: number;
    remark: string;
    unitName: string;
  }
  
  export interface StockAdjustmentDetailResponse {
    ref: string;
    code: number;
    message: string;
    data: any;
  }
  