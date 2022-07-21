import { FileType } from './common-model';

//master Expense
export interface ExpenseInfo {
  typeCode: string;
  typeNameTh: string;
  expenseNo: string;
  accountCode: string;
  accountNameTh: string;
  skuCode: string;
  approvalLimit1: number;
  approvalLimit2: number;
  isActive: boolean;
  isOtherExpense: boolean;
  requiredDocumentTh: string;
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

export interface ExpenseSaveRequest {
  id?: string;
  branchCode?: string;
  docNo?: string;
  type?: string;
  month?: number;
  year?: number;
  expensePeriod?: ExpensePeriod | null;
  status?: string;
  attachFiles?: FileType[];
  editAttachFiles?: FileType[];
  approvalAttachFiles?: FileType[];
  sumItems?: SumItemsItem[];
  items?: DataItem[];
  comment?: string;
  expenseDate?: string;
  approvedDate?: string;
  nextApprover?: string;
  auditLogs?: AuditLog[];
  createdBy?: string;
  lastModifiedBy?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  today?: string;
  route?: string;
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
  totalAmount?: number;
}

export interface ItemItem {
  expenseNo: string;
  amount: number;
  isOtherExpense: boolean;
}

export interface SumItems {
  items: SumItemsItem[];
  sumWithdrawAmount?: number;
  sumApprovalAmount?: number;
}

export interface SumItemsItem {
  expenseNo: string;
  withdrawAmount?: number;
  approvedAmount?: number;
  isOtherExpense: boolean;
}
export interface Comment {
  username: string;
  status: string;
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
  value: string | number;
  title: string;
  isOtherExpense?: boolean;
}
export interface ExpensePeriodTypeResponse {
  ref: string;
  code: number;
  message: string;
  data: PeriodInfo | null | [];
}

export interface PeriodInfo {
  period: number;
  startDate: string;
  endDate: string;
}

// Search request
export interface ExpenseSearchRequest {
  limit: string;
  page: string;
  sortBy?: string;
  sortDirection?: string;
  type: string;
  branchCode: string;
  status: string;
  month: number;
  year: number;
  period?: number;
}

export interface ExpenseSearch {
  limit: string;
  page: string;
  type: string;
  status: string;
  branchCode: string;
  month: number;
  year: number;
  period: number;
}

// Search response
export interface ExpenseSearchResponse {
  timestamp: string;
  ref: string;
  code: number;
  message: string;
  data: ExpenseSearchInfo[];
  total: number;
  page: number;
  perPage: number;
  prev: number;
  next: number;
  totalPage: number;
}

export interface ExpenseSearchInfo {
  branchCode: string;
  branchName: string;
  docNo: string;
  type: string;
  expensePeriod: ExpensePeriod[];
  status: string;
  sumWithdrawAmount: number;
  sumApprovalAmount: number;
  expenseDate: string;
  approvedDate: string;
}

export interface ExpensePeriod {
  period: number;
  startDate: string;
  endDate: string;
}
