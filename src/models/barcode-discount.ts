export interface Payload {
  id?: string;
  documentNumber?: string;
  requestID?: string;
  percentDiscount: boolean;
  requestorNote: string;
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
  productName: string;
  unit: string;
  price: number;
  discount: number;
  expiryDate: string | any;
  cashDiscount: number;
  priceAfterDicount: number;
  numberOfDiscounted: number;
  approvedDiscount: number;
  errorDiscount: string;
  errorExpiryDate: string;
  errorNumberOfDiscounted: string;
}
