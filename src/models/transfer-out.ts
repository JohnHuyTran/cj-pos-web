export interface Payload {
  id?: string;
  documentNumber?: string;
  requestID?: string;
  products: Object[];
  barcode: string;
}
export interface TransferOutDetail {
  id: string;
  index: number;
  barCode: string;
  barcodeName: string;
  skuCode: string;
  unit: string;
  numberOfDiscounted: number;
  numberOfApproved: number;
  remark: string;
}

interface Product {
  barcode: string;
  NumberOfDiscounted: number;
}
export interface CheckStockPayload {
  branchCode: string;
  products: Product[];
}
