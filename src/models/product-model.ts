export type ItemProduct = {
  id: number;
  barcode: number;
  name: string;
  price: number;
};

export type ItemProductRequest = {
  barcode: string;
  name: string;
  price: number;
};

export type FindProductProps = {
  search: string;
  payload: FindProductRequest;
};

export type FindProductRequest = {
  skuCodes: string[];
};
