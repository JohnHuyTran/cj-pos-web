export interface CheckOrderRequest {
  limit: string;
  page: string;
  docNo?: string;
  shipBranchFrom?: string;
  shipBranchTo?: string;
  branchCode?: string;
  verifyDCStatus?: string;
  orderType?: string;
  dateFrom?: string;
  dateTo?: string;
  sdType?: string;
  sortBy?: string;
  clearSearch?: boolean;
}

export interface CheckOrderResponse {
  ref: string;
  code: number;
  message: string;
  data: CheckOrderInfo[];
  total: number;
  page: number;
  perPage: number;
  prev: number;
  next: number;
  totalPage: number;
}

export interface CheckOrderInfo {
  id: string;
  shipmentNo: string;
  sdNo: string;
  branchOutNo: string;
  branchDesc: string;
  sdStatus: string;
  sdType: number;
  verifyDCStatus: number;
  hasOver: boolean;
  hasBelow: boolean;
  receivedDate: string;
  docRefNo: string;
  shipBranchFrom: ShipBranch;
  shipBranchTo: ShipBranch;
}
export interface ShipBranch {
  code: string;
  name: string;
}
export interface CheckOrderDetailResponse {
  ref: string;
  code: number;
  message: string;
  data: CheckOrderDetailInfo | null;
}

export interface CheckOrderDetailInfo {
  id: string;
  shipmentNo: string;
  sdNo: string;
  sdType: string;
  dcComment: string;
  items: CheckOrderDetailItims[] | [];
  verifyDCStatus: number;
  receivedDate: string;
  sdImageFilename: string;
  sdImageFile: string;
}

export interface CheckOrderDetailItims {
  skuCode: string;
  skuType: string;
  barcode: string;
  productName: string;
  unitCode: string;
  unitName: string;
  unitFactor: number;
  qty: number;
  actualQty: number;
  qtyDiff: number;
  comment: string;
  id?: string;
  toteCode?: string;
  sdNo?: string;
  sdID?: string;
  isTote?: boolean;
}

export interface ItemsState {
  itemId: string;
}

export interface DCOrderApproveRequest {
  dcComment: string;
}

export interface ShipBranchInfo {
  code: string;
  name: string;
}

export interface OrderReceiveApproveRequest {
  docRefNo: string;
  items: ItemsInfo[];
}

export interface ItemsInfo {
  barcode: string;
  actualQty: number;
  comment: string;
}
