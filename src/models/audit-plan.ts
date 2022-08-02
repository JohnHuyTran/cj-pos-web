export interface Payload {
  id?: string;
  branchCode: string | any;
  branchName: string | any;
  countingDate: string;
  stockCounter: number;
  product: Object[];
}

export interface PayloadCounting {
  auditPlanning: {
    id: string;
    product: AuditPlanProductDetail[];
    documentNumber: string;
    branchCode: string | any;
    branchName: string | any;
  };
  storeType: number;
}
export interface AuditPlanSearchRequest {
  perPage: string;
  page: string;
  docNo: string;
  branch: string;
  status: string;
  creationDateFrom: string;
  creationDateTo: string;
  clearSearch?: boolean;
}

export interface AuditPlanSearchResponse {
  ref: string;
  code: number;
  message: string;
  data: AuditPlan[];
  total: number;
  page: number;
  perPage: number;
  totalPage: number;
}

export interface AuditPlan {
  id: string;
  branchCode: string;
  branchName: string;
  createdBy: string;
  documentNumber: string;
  status: string;
  createdDate: string;
  countingDate: string;
  stockCounter: number;
  product: AuditPlanProductDetail[];
  relatedDocuments: RelatedDocument[];
}

export interface AuditPlanProductDetail {
  name: string;
  sku: string;
}

export interface AuditPlanDetailResponse {
  ref: string;
  code: number;
  message: string;
  data: AuditPlan;
}

export interface RelatedDocument {
  countingTime: number;
  documentNumber: string;
  id: string;
}
