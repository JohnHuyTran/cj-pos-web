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

export interface CheckOrderDetailProps {
    shipment: any | undefined;
    defaultOpen: boolean;
    onClickClose: any;
}


export interface OrderSubmitRequest {
    shipmentNo: string;
    items: Item[];
}

export interface Item {
    barcode: string;
    ActualQty: number;
    comment?: string;
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