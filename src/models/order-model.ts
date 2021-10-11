export interface CheckOrderRequest {
    orderNo: string;
    orderStatus: string;
    orderType: string
}

export interface CheckOrderResponse {
    ref: number;
    total: number;
    orders?: Order[]
}

export interface Order {
    orderNo: string;
    orderStatus: string;
    orderType: string;
    orderShipment: string;
    orderTotal: number;
    orderTote: number;
    orderCreateDate: string;
    products?: Product[]
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
    status?: string;
}


export interface ShipmentResponse {
    ref: string;
    code: number;
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
    entries: Entry[];
}

export interface Entry {
    deliveryOrderNo: string;
    deliveryOrderDate: string;
    items: Item[];
}

export interface Item {
    seqItem: number;
    itemNo: string;
    shipmentSAPRef: string;
    sku: Sku;
    productName: string;
    barcode: string;
    unit: Unit;
    quantity: Quantity;
    price: number;
    isControlStock: number;
    toteCode: string;
    expireDate: string;
    comment: string;
}

export interface Quantity {
    qty: number;
    qtyAll: number;
    qtyAllBefore: number;
    actualQty: number;
    qtyDiff: number;
}

export interface Sku {
    code: string;
    type: string;
}

export interface Unit {
    code: string;
    name: string;
    unitFactor: number;
}

export interface CheckOrderDetailProps {
    shipment: any | undefined;
    defaultOpen: boolean;
    onClickClose: any;
}


export interface SaveDraftSDRequest {
    shipmentNo: string;
    items: itemsReq[];
}

export interface itemsReq {
    barcode: string;
    deliveryOrderNo: string;
    quantity: Quantity;
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