import { FileType } from './supplier-check-order-model';

export interface PurchaseCreditNoteType {
  pnNo?: string;
  comment: string;
  items: ItemsType[];
}

export interface ItemsType {
  barcode: string;
  qtyReturn: number;
}

export interface PurchaseNoteDetailResponse {
  ref: string;
  code: number;
  message: string;
  data: PurchaseNoteDetailInfo[];
}

export interface PurchaseNoteDetailInfo {
  id: string;
  branchCode: string;
  dueDate: string;
  shipmentDate: string;
  createdDate: string;
  piStatus: number;
  piType: number;
  piNo: string;
  billNo?: string;
  comment: string;
  pnNo?: string;
  pnState?: number;
  pnComment?: string;
  files?: FileType[];
  entries: PurchaseNoteDetailEntries | [];
}

export interface PurchaseNoteDetailEntries {
  seqItem: number;
  produtStatus: number;
  skuCode: string;
  barcode: string;
  productName: string;
  qty: number;
  qtyAll: number;
  actualQty: number;
  actualQtyAll: number;
  isDraftStatus?: boolean;
  qtyReturn?: number;
  allQtyReturn?: number;
  pnDisplay?: number;
  unitCode: string;
  unitName: string;
}

export interface PurchaseNoteDetailResponse {
  ref: string;
  code: number;
  message: string;
  data: PurchaseNoteDetailInfo[];
}

export interface PurchaseNoteDetailInfo {
  id: string;
  branchCode: string;
  dueDate: string;
  shipmentDate: string;
  createdDate: string;
  piStatus: number;
  piType: number;
  piNo: string;
  billNo?: string;
  comment: string;
  pnNo?: string;
  pnState?: number;
  pnComment?: string;
  files?: FileType[];
  entries: PurchaseNoteDetailEntries | [];
}

export interface PurchaseNoteDetailEntries {
  seqItem: number;
  produtStatus: number;
  skuCode: string;
  barcode: string;
  productName: string;
  qty: number;
  qtyAll: number;
  actualQty: number;
  actualQtyAll: number;
  isDraftStatus?: boolean;
  qtyReturn?: number;
  allQtyReturn?: number;
  pnDisplay?: number;
}
