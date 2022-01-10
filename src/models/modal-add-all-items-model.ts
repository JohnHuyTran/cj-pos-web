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
  skuCode?: string;
  unitCode?: string;
  unitName?: string;
  barcodeName: string;
  qty?: number;
}
