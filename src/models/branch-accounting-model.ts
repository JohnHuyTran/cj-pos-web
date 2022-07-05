export interface ExpenseInfo {
  accountName: string;
  skuCode: string;
  maxLimitArea: number;
  maxLimitOC: number;
  active: boolean;
  docReferance: string;
}

export interface ExpenseMasterResponseType {
  data: ExpenseInfo[];
  ref: string;
  code: number;
  message: string;
}
