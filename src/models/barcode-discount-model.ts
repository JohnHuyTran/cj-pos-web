export interface BarcodeDiscountSearchRequest {
    limit: string;
    page: string;
    documentNumber: string;
    branch: string;
    status: string;
    fromDate: string;
    toDate: string;
}

export interface BarcodeDiscountSearchResponse {
    ref: string;
    code: number;
    message: string;
    data: BarcodeDiscount[];
    total: number;
    page: number;
    perPage: number;
    prev: number;
    next: number;
    totalPage: number;
}

export interface BarcodeDiscount {
    documentNumber: string;
    status: string;
    totalAmount: number;
    unit: string;
    sumOfPrice: number;
    sumOfCashDiscount: number;
    sumOfPriceAfterDiscount: number;
    branch: string;
    createdDate: string;
    approvedDate: string;
    requesterNote: string;
}