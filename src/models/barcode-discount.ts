export interface Payload {
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
  empiryDate: string | any;
  cashDiscount: number;
  priceAffterDicount: number;
  numberOfDiscounted: number;
}
