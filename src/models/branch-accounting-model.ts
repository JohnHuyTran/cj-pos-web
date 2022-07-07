import { AuditLog, FileType } from './common-model';

//master Expense
export interface ExpenseInfo {
  accountName: string;
  skuCode: string;
  approveLimit1: number;
  approveLimt2: number;
  active: boolean;
  requiredDocument: string;
  expenseNo: string;
}

export interface ExpenseMasterResponseType {
  data: ExpenseInfo[];
  ref: string;
  code: number;
  message: string;
}

// response inq
export interface AccountAccountExpenses {
  id: string;
  branchCode: string;
  docNo: string;
  type: string;
  expenseMonth: number;
  expenseYear: number;
  expensePeriod: ExpensePeriod;
  status: string;
  attachFiles: FileType[];
  editAttachFiles: FileType[];
  approvalAttachFiles: FileType[];
  itemSummary: ExpenseSummary;
  itemByDays: ExpenseByDay[];
  comments: ExpenseComment[];
  expenseDate: string;
  approvedDate: string;
  nextApprover: string;
  auditLogs: AuditLog[];
  createdBy: string;
  lastModifiedBy: string;
  createdDate: string;
  lastModifiedDate: string;
}
export interface ExpensePeriod {
  period: number; //งวด 1,2
  startDate: string;
  endDate: string;
}

export interface ExpenseSummary {
  items: ExpenseSummaryItem[];
  sumWithdrawAmount: number;
  sumApprovalAmount: number;
}
export interface ExpenseSummaryItem {
  expenseNo: string; // case other จะ fix เป็น "SUMOTHER"
  withdrawAmount: number;
  approvedAmount: number;
}

export interface ExpenseByDay {
  expenseDate: string;
  expenseItems: ExpenseItem[];
  totalAmount: number;
}

export interface ExpenseItem {
  expenseNo: string;
  amount: number;
  isOtherExpense: boolean;
}
export interface ExpenseComment {
  username: string;
  statusDesc: string;
  commentDate: string;
  comment: string;
}
