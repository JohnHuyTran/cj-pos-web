export interface CheckOrderRequest {
  orderNo: string;
  orderStatus: string;
  orderType: string;
}

export interface CheckOrderResponse {
  ref: number;
  total: number;
  orders?: Order[];
}

export interface Order {
  orderNo: string;
  orderStatus: string;
  orderType: string;
  orderShipment: string;
  orderTotal: number;
  orderTote: number;
  orderCreateDate: string;
  products?: Product[];
}

export interface Product {
  productId: string;
  productBarCode: string;
  productDescription: string;
  productUnit: string;
  productQuantityRef: number;
  productQuantityActual: number;
  productDifference: number;
}

export interface ShipmentRequest {
  limit: string;
  page: string;
  sortBy?: string;
  sortDirection?: string;
  shipmentNo?: string;
  sdNo?: string;
  dateFrom?: string;
  dateTo?: string;
  sdStatus?: number;
  sdType?: number;
}

export interface ShipmentResponse {
  ref: string;
  code: number;
  message: string;
  data: ShipmentInfo[];
  total: number;
  page: number;
  perPage: number;
  totalPage: number;
}

export interface ShipmentInfo {
  shipmentNo: string;
  shipmentDate: string;
  status: string;
  sapDocType: string;
  sdNo: string;
  sdStatus: number;
  sdType: number;
  toteCnt: number;
  boxCnt: number;
  entries: Entry[] | null;
}

export interface Entry {
  seqItem: number;
  itemNo: string;
  shipmentSAPRef: string;
  skuCode: string;
  skuType: string;
  productName: string;
  barcode: string;
  unitCode: string;
  unitName: string;
  unitFactor: number;
  qty: number;
  qtyAll: number;
  qtyAllBefore: number;
  actualQty: number;
  qtyDiff: number;
  price: number;
  isControlStock: number;
  toteCode: string;
  expireDate: string;
  isTote: boolean;
  comment: string;
}

export interface CheckOrderDetailProps {
  shipment: any | undefined;
  defaultOpen: boolean;
  onClickClose: any;
}

export interface SaveDraftSDRequest {
  shipmentNo: string;
  items: Entry[];
}

export interface itemsReq {
  barcode: string;
  deliveryOrderNo: string;
  actualQty: number;
  comment: string;
}

export interface OrderSubmitResponse {
  ref: string;
  code: number;
  message: string;
  sdNo: string;
}

export interface OrderApproveCloseJobRequest {
  shipmentNo: string;
  imageContent?: BinaryData;
}

export interface FeatchDataPDFRequest {
  Symbol: string;
}
