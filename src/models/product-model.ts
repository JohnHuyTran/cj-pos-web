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
