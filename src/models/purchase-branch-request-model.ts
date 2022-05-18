export interface PurchaseBRRequest {
  docNo?: string;
  remark: string;
  items: PurchaseBRItemRequest[] | [];
}

export interface PurchaseBRItemRequest {
  barcode: string;
  orderMaxQty: number;
  orderQty: number;
}

export interface PurchaseBRDetailResponse {
  ref: string;
  code: number;
  message: string;
  data: PurchaseBRInfo[];
}

export interface PurchaseBRInfo {
  docNo: string;
  branchCode: string;
  status: string;
  remark: string;
  createdBy: string;
  createByFullName: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  items: PurchaseBRItem[] | [];
}

export interface PurchaseBRItem {
  skuCode: string;
  barcode: string;
  barcodeName: string;
  unitCode: string;
  unitName: string;
  barFactor: number;
  orderMaxQty: number;
  orderQty: number;
}
