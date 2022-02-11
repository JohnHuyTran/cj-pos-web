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

export interface ProductTypeResponse {
  timestamp: string;
  ref: string;
  code: number;
  message: string;
  error_details: string;
  data: ProductTypeInfo[];
}

export interface ProductTypeInfo {
  productTypeCode: string;
  productTypeName: string;
}

export interface PayloadSearchProduct {
  search: string;
  productTypeCodes: any[];
}
