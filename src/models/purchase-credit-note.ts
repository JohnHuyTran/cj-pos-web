export interface PurchaseCreditNoteType {
  pnNo?: string;
  comment: string;
  items: ItemsType[];
}

export interface ItemsType {
  barcode: string;
  qtyReturn: number;
}
