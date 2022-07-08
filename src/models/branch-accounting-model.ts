import { FileType } from './common-model';

//master Expense
export interface ExpenseInfo {
  accountName: string;
  skuCode: string;
  approveLimit1: number;
  approveLimt2: number;
  active: boolean;
  requiredDocument: string;
  expenseNo: string;
  isOtherExpense: boolean;
}

export interface ExpenseMasterResponseType {
  data: ExpenseInfo[];
  ref: string;
  code: number;
  message: string;
}

// response inq

export interface ExpenseDetailResponseType {
  data: AccountAccountExpenses | null | [];
  ref: string;
  code: number;
  message: string;
}
export interface AccountAccountExpenses {
  id?: string;
  branchCode?: string;
  docNo?: string;
  type: string;
  month?: number;
  year?: number;
  expensePeriod?: ExpensePeriod;
  status?: string;
  attachFiles?: FileType[];
  editAttachFiles?: FileType[];
  approvalAttachFiles?: FileType[];
  sumItems?: SumItems;
  items?: DataItem[];
  comments?: Comment[];
  expenseDate?: string;
  approvedDate?: string;
  nextApprover?: string;
  auditLogs?: AuditLog[];
  createdBy?: string;
  lastModifiedBy?: string;
  createdDate?: string;
  lastModifiedDate?: string;
}
export interface ExpensePeriod {
  period: number; //งวด 1,2
  startDate: string;
  endDate: string;
}

export interface DataItem {
  expenseDate: string;
  items: ItemItem[];
  totalAmount: number;
}

export interface ItemItem {
  expenseNo: string;
  amount: number;
  isOtherExpense: boolean;
}

export interface SumItems {
  items: SumItemsItem[];
  sumWithdrawAmount: number;
  sumApprovalAmount: number;
}

export interface SumItemsItem {
  expenseNo: string;
  withdrawAmount: number;
  approvedAmount?: number;
}
export interface Comment {
  username: string;
  statusDesc: string;
  commentDate: string;
  comment: string;
}
export interface Differ {
  type: string;
  path: any[];
  from: string;
  to: string;
}

export interface AuditLog {
  activity: string;
  comment?: string;
  editBy: string;
  editByName: string;
  editDate: string;
  differ?: Differ[];
}
export interface payLoadAdd {
  id: number;
  key: string;
  value: string;
  title: string;
}
