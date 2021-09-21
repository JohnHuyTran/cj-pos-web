export interface CheckOrderType {
    orderNo: string | null,
    orderStatus: string | null,
    orderType: string | null,
}

export interface CheckOrderResponse {
    ref: number;
    total: number;
    orders: Order[];
}

export interface Order {
    orderNo: string;
    orderStatus: string;
    orderType: string;
    products: Product[];
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