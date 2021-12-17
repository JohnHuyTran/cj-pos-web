export interface PurchaseCreditNoteType {
  pnNo: string;
  items: ItemsType[];
}

export interface ItemsType {
  barcode: string;
  returnQry: number;
}
