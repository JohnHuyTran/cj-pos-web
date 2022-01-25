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
  unit: string;
  price: number;
  discount: any;
  expiryDate: string | any;
  cashDiscount: number | any;
  priceAfterDicount: number | any;
  numberOfDiscounted: number;
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
