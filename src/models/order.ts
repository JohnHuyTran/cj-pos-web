import { GridRowId } from '@mui/x-data-grid';
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

export interface OrderProductListProps {
    // shipment: GridRowId | undefined;
    shipment: string | undefined;
    defaultOpen: boolean;
}