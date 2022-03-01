export interface CheckOrderRequest {
  limit: string;
  page: string;
  docNo?: string;
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
  sdStatus: number;
  sdType: number;
  verifyDCStatus: number;
  hasOver: boolean;
  hasBelow: boolean;
  receivedDate: string;
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
}

export interface DCOrderApproveRequest {
  dcComment: string;
}

export interface OrderReceiveDetailResponse {
  ref: string;
  code: number;
  message: string;
  data: OrderReceiveDetailInfo | null;
}
export interface OrderReceiveDetailInfo {
  shipmentNo: string;
  shipmentDate: string;
  status: string;
  sapDocType: string;
  sdNo: string;
  sdStatus: number;
  sdType: number;
  toteCnt: number;
  boxCnt: number;
  comment: string;
  ItemRefNo: number;
  entries: Entries[];
  shipBranchFrom: ShipBranchInfo;
  shipBranchTo: ShipBranchInfo;
}
export interface Entries {
  deliveryOrderNo: string;
  productName: string;
  ItemRefNo: number;
  barcode: string;
  skuCode: string;
  skuType: string;
  outOfStockStatus: number;
  toteCode: string;
  expireDate: string;
  unitCode: string;
  unitName: string;
  unitFactor: number;
  qty: number;
  qtyAll: number;
  qtyAllBefore: number;
  actualQty: number;
  qtyDiff: number;
  comment: string;
  isTote: boolean;
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
