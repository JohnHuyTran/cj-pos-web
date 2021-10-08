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
  code: string;
  message: string;
  data: ShipmentInfo[];
  total: number;
  page: number;
  perPage: number;
  prev: number;
  next: number;
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
  comment: string;
  entries: Entry[];
}

export interface Entry {
  deliveryOrderNo: string;
  deliveryOrderDate: string;
  items: Item[];
}

export interface Item {
  productName: string;
  ItemRefNo: string;
  barcode: string;
  skuCode: string;
  outOfStockStatus: string;
  toteCode: string;
  expireDate: string;
  unitFactor: number;
  unit: Unit;
  quantity: Quantity;
  comment: string;
}

export interface Quantity {
  qty: number;
  qtyAll: number;
  qtyAllBefore: string;
  actualQty: number;
  qtyDiff: number;
}

export interface Unit {
  code: string;
  name: string;
}

export interface CheckOrderDetailProps {
  shipment: any | undefined;
  defaultOpen: boolean;
  onClickClose: any;
}

export interface OrderSubmitRequest {
  shipmentNo: string;
  items: Item[];
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
