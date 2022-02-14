export interface Payload {
  id?: string;
  documentNumber?: string;
  requestID?: string;
  percentDiscount: boolean;
  requesterNote: string;
  products: Object[];
  barcode: string;
  requestDiscount: number;
  numberOfDiscounted: number;
  expiredDate: string;
}
export interface DiscountDetail {
  id: string;
  index: number;
  barCode: string;
  barcodeName: string;
  skuCode: string;
  unit: string;
  price: number;
  discount: any;
  expiryDate: string | any;
  cashDiscount: number | any;
  priceAfterDiscount: number | any;
  numberOfDiscounted: number;
  numberOfApproved: number;
  approvedDiscount: number;
  errorDiscount: string;
  errorExpiryDate: string;
  errorNumberOfDiscounted: string;
}

interface Product {
  barcode: string;
  NumberOfDiscounted: number;
}
export interface CheckStockPayload {
  branchCode: string;
  products: Product[];
}
