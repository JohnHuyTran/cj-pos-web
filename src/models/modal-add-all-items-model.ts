export interface ItemsResponse {
  timestamp: string;
  ref: string;
  code: number;
  message: string;
  error_details: string;
  data: ItemInfo[];
}

export interface ItemInfo {
  barcode: string;
  barcodeName: string;
  skuCode?: string;
  skuName?: string;
  unitCode?: string;
  unitName?: string;
  unitPrice?: number;
  unitText?: string;
  baseUnit?: number;
  qty?: number;
}
