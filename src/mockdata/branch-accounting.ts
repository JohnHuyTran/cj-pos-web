import {
  AccountAccountExpenses,
  ExpenseByDay,
  ExpenseInfo,
  ExpenseItem,
  ExpensePeriod,
  ExpenseSummary,
  ExpenseSummaryItem,
} from '../models/branch-accounting-model';

export const mockExpenseInfo001: ExpenseInfo = {
  accountName: 'ค่าน้ำแข็งหลอด',
  skuCode: '000000700000007',
  approveLimit1: 2000,
  approveLimt2: 0,
  active: true,
  requiredDocument: 'ใบเสร็จ',
  expenseNo: '001',
  isOtherExpense: false,
};
export const mockExpenseInfo002: ExpenseInfo = {
  accountName: 'ค่าน้ำดื่มชงกาแฟ',
  skuCode: '000000700000007',
  approveLimit1: 2000,
  approveLimt2: 0,
  active: true,
  requiredDocument: 'ใบเสร็จ',
  expenseNo: '002',
  isOtherExpense: false,
};
export const mockExpenseInfo003: ExpenseInfo = {
  accountName: 'ค่าไช่ไก่',
  skuCode: '000000700000007',
  approveLimit1: 2000,
  approveLimt2: 0,
  active: true,
  requiredDocument: 'ใบเสร็จ',
  expenseNo: '003',
  isOtherExpense: false,
};
export const mockExpenseInfo004: ExpenseInfo = {
  accountName: 'ค่านม',
  skuCode: '000000700000007',
  approveLimit1: 2000,
  approveLimt2: 0,
  active: true,
  requiredDocument: 'ใบเสร็จ',
  expenseNo: '004',
  isOtherExpense: false,
};
export const mockExpenseInfo005: ExpenseInfo = {
  accountName: 'ค่าจ่างรายวัน',
  skuCode: '000000700000007',
  approveLimit1: 2000,
  approveLimt2: 0,
  active: true,
  requiredDocument: 'ใบเสร็จ',
  expenseNo: '005',
  isOtherExpense: true,
};
export const mockExpenseInfo006: ExpenseInfo = {
  accountName: 'สิ้นเปลือง',
  skuCode: '000000700000007',
  approveLimit1: 2000,
  approveLimt2: 0,
  active: true,
  requiredDocument: 'ใบเสร็จ',
  expenseNo: '006',
  isOtherExpense: true,
};

const fetchMasterExpense = {
  timestamp: '2022-05-10T04:30:57.797+0000',
  ref: '6279ea81972d0d933de2ab9f',
  code: 20000,
  message: 'success',
  data: [
    mockExpenseInfo001,
    mockExpenseInfo002,
    mockExpenseInfo003,
    mockExpenseInfo004,
    mockExpenseInfo005,
    mockExpenseInfo006,
  ],
};

const summaryItem001: ExpenseSummaryItem = {
  expenseNo: '001',
  withdrawAmount: 100,
  approvedAmount: 100,
};

const summaryItem002: ExpenseSummaryItem = {
  expenseNo: '002',
  withdrawAmount: 200,
  approvedAmount: 200,
};
const summaryItem003: ExpenseSummaryItem = {
  expenseNo: '003',
  withdrawAmount: 300,
  approvedAmount: 300,
};
const summaryItem004: ExpenseSummaryItem = {
  expenseNo: '004',
  withdrawAmount: 400,
  approvedAmount: 400,
};
const summaryItem005: ExpenseSummaryItem = {
  expenseNo: '005',
  withdrawAmount: 500,
  approvedAmount: 500,
};

const summary: ExpenseSummary = {
  items: [summaryItem001, summaryItem002, summaryItem003, summaryItem004, summaryItem005],
  sumWithdrawAmount: 606,
  sumApprovalAmount: 900,
};

const item001: ExpenseItem = {
  expenseNo: '001',
  amount: 100,
  isOtherExpense: false,
};

const item002: ExpenseItem = {
  expenseNo: '002',
  amount: 200,
  isOtherExpense: false,
};

const item003: ExpenseItem = {
  expenseNo: '003',
  amount: 300,
  isOtherExpense: false,
};

const item004: ExpenseItem = {
  expenseNo: '004',
  amount: 400,
  isOtherExpense: false,
};

const item005: ExpenseItem = {
  expenseNo: '005',
  amount: 500,
  isOtherExpense: false,
};

const expenseByDay01: ExpenseByDay = {
  expenseDate: '01/07/2565',
  expenseItems: [item001, item002, item003, item004, item005],
  totalAmount: 1000,
};
const expenseByDay02: ExpenseByDay = {
  expenseDate: '02/07/2565',
  expenseItems: [item001, item002, item003, item004, item005],
  totalAmount: 200,
};
const expenseByDay03: ExpenseByDay = {
  expenseDate: '03/07/2565',
  expenseItems: [item001, item002, item003, item004, item005],
  totalAmount: 9000,
};

const period: ExpensePeriod = {
  period: 1,
  startDate: '01/07/2565',
  endDate: '01/07/2565',
};
const accountExpense: AccountAccountExpenses = {
  id: '',
  branchCode: '0101',
  docNo: 'BA0001',
  type: 'COFFEE',
  expenseMonth: 0,
  expenseYear: 0,
  expensePeriod: period,
  status: 'DRAFT',
  attachFiles: [],
  editAttachFiles: [],
  approvalAttachFiles: [],
  itemSummary: summary,
  itemByDays: [expenseByDay01, expenseByDay02, expenseByDay03],
  comments: [],
  expenseDate: '',
  approvedDate: '',
  nextApprover: '',
  auditLogs: [],
  createdBy: '',
  lastModifiedBy: '',
  createdDate: '',
  lastModifiedDate: '',
};

const rsExpenseDetail = {
  timestamp: '2022-05-10T04:30:57.797+0000',
  ref: '6279ea81972d0d933de2ab9f',
  code: 20000,
  message: 'success',
  data: accountExpense,
};

export function featchMasterExpenseListAsyncMockup() {
  return new Promise((resolve, reject) => {
    resolve(fetchMasterExpense);
  });
}

export function featchExpenseDetailAsyncMockup() {
  return new Promise((resolve, reject) => {
    resolve(rsExpenseDetail);
  });
}
