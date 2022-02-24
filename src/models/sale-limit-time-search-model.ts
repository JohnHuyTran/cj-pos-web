export interface BranchResponse {
  ref: string;
  code: number;
  message: string;
  data: DataResponse[];
  total: number;
  page: number;
  perPage: number;
  totalPage: number;
}

export interface PayloadST {
  perPage: string;
  page: string;
  query: string;
  branch: string;
  status: string;
  startDate: string;
  endDate: string;
  clearSearch?: boolean;
}

export interface DataResponse {
  _id: string;
  documentNumber: string;
  status: string;
  description: string;
  branch: string;
  creationDate: string;
  startDate: string;
  endDate: string;
  remark: string;
}
