export interface CheckOrderRequest {
  shipmentNo: string;
  sdNo: string;
  sdStatus: number;
  sdType: number;
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

export interface Shipment {
  shipmentNo: string;
  shipmentDate: string;
  status: string;
  sapDocType: string;
  sdNo: string;
  sdStatus: number;
  sdType: number;
  toteCnt: number;
  boxCnt: number;
  entries: DeliveryOrder[];
}

export interface DeliveryOrder {
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
  unit: {
    code: string;
    name: string;
  };
  quantity: {
    qty: number;
    qtyAll: number;
    qtyAllBefore: string;
    actualQty: number;
    qtyDiff: number;
  };
  comment: string;
}

export interface OrderProductListProps {
  // shipment: GridRowId | undefined;
  shipment: any | undefined;
  defaultOpen: boolean;
  onClickClose: any;
}
