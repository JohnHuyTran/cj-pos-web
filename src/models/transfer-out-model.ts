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
  branchId: string;
  regionId: string;
  requester: string;
  requesterId: string;
  documentNumber: string;
  status: string;
  branchCode: string;
  branchName: string;
  createdDate: string;
  approvedDate: string;
  requesterNote: string;
  products: TransferOutProductDetail[];
}

export interface TransferOutProductDetail {
  productObjectId: string;
  requestedDiscount: number;
  expiredDate: string;
  price: number;
}

export interface TransferOutDetailResponse {
  ref: string;
  code: number;
  message: string;
  data: any;
}
