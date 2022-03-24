export interface TransferOutSearchRequest {
  perPage: string;
  page: string;
  query: string;
  branch: string;
  status: string;
  startDate: string;
  endDate: string;
  clearSearch?: boolean;
}

export interface TransferOutSearchResponse {
  ref: string;
  code: number;
  message: string;
  data: TransferOut[];
  total: number;
  page: number;
  perPage: number;
  totalPage: number;
}

export interface TransferOut {
  id: string;
  branch: string;
  regionId: string;
  requester: string;
  requesterId: string;
  documentNumber: string;
  status: string;
  transferOutReason: string;
  store: string;
  createdDate: string;
  approvedDate: string;
  attachFiles: attachFile[];
  products: TransferOutProductDetail[];
}

export interface TransferOutProductDetail {
  barcode: string;
  productName: string;
  sku: string;
  numberOfRequested: number;
  numberOfApproved: number;
  remark: string;
  unitName: string;
}

export interface TransferOutDetailResponse {
  ref: string;
  code: number;
  message: string;
  data: any;
}

export interface attachFile {
  name: string;
  key: string;
  mimeType: string;
}
