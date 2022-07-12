import {
  AccountAccountExpenses,
  DataItem,
  ExpenseInfo,
  ExpensePeriod,
  ItemItem,
  SumItems,
  SumItemsItem,
} from '../models/branch-accounting-model';

export const mockExpenseInfo001: ExpenseInfo = {
  accountNameTh: 'ค่าน้ำแข็งหลอด',
  skuCode: '000000700000007',
  approvalLimit1: 2000,
  approvalLimit2: 0,
  isActive: true,
  requiredDocumentTh: 'ใบเสร็จ',
  expenseNo: '001',
  isOtherExpense: false,
  typeCode: '',
  accountCode: '',
  typeNameTh: '',
};
export const mockExpenseInfo002: ExpenseInfo = {
  accountNameTh: 'ค่าน้ำดื่มชงกาแฟ',
  skuCode: '000000700000007',
  approvalLimit1: 2000,
  approvalLimit2: 0,
  isActive: true,
  requiredDocumentTh: 'ใบเสร็จ',
  expenseNo: '002',
  isOtherExpense: false,
  typeCode: '',
  accountCode: '',
  typeNameTh: '',
};
export const mockExpenseInfo003: ExpenseInfo = {
  accountNameTh: 'ค่าไช่ไก่',
  skuCode: '000000700000007',
  approvalLimit1: 2000,
  approvalLimit2: 0,
  isActive: true,
  requiredDocumentTh: 'ใบเสร็จ',
  expenseNo: '003',
  isOtherExpense: false,
  typeCode: '',
  accountCode: '',
  typeNameTh: '',
};
export const mockExpenseInfo004: ExpenseInfo = {
  accountNameTh: 'ค่านม',
  skuCode: '000000700000007',
  approvalLimit1: 2000,
  approvalLimit2: 0,
  isActive: true,
  requiredDocumentTh: 'ใบเสร็จ',
  expenseNo: '004',
  isOtherExpense: false,
  typeCode: '',
  accountCode: '',
  typeNameTh: '',
};
export const mockExpenseInfo005: ExpenseInfo = {
  accountNameTh: 'ค่าจ่างรายวัน',
  skuCode: '000000700000007',
  approvalLimit1: 2000,
  approvalLimit2: 0,
  isActive: true,
  requiredDocumentTh: 'ใบเสร็จ',
  expenseNo: '005',
  isOtherExpense: true,
  typeCode: '',
  accountCode: '',
  typeNameTh: '',
};
export const mockExpenseInfo006: ExpenseInfo = {
  accountNameTh: 'สิ้นเปลือง',
  skuCode: '000000700000007',
  approvalLimit1: 2000,
  approvalLimit2: 0,
  isActive: true,
  requiredDocumentTh: 'ใบเสร็จ',
  expenseNo: '006',
  isOtherExpense: true,
  typeCode: '',
  accountCode: '',
  typeNameTh: '',
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

const summaryItem001: SumItemsItem = {
  expenseNo: '001',
  withdrawAmount: 100,
  approvedAmount: 100,
};

const summaryItem002: SumItemsItem = {
  expenseNo: '002',
  withdrawAmount: 200,
  approvedAmount: 200,
};
const summaryItem003: SumItemsItem = {
  expenseNo: '003',
  withdrawAmount: 300,
  approvedAmount: 300,
};
const summaryItem004: SumItemsItem = {
  expenseNo: '004',
  withdrawAmount: 400,
  approvedAmount: 400,
};
const summaryItem005: SumItemsItem = {
  expenseNo: '005',
  withdrawAmount: 500,
  approvedAmount: 500,
};

const summary: SumItems = {
  items: [summaryItem001, summaryItem002, summaryItem003, summaryItem004, summaryItem005],
  sumWithdrawAmount: 606,
  sumApprovalAmount: 900,
};

const item001: ItemItem = {
  expenseNo: '001',
  amount: 100,
  isOtherExpense: false,
};

const item002: ItemItem = {
  expenseNo: '002',
  amount: 200,
  isOtherExpense: false,
};

const item003: ItemItem = {
  expenseNo: '003',
  amount: 300,
  isOtherExpense: false,
};

const item004: ItemItem = {
  expenseNo: '004',
  amount: 400,
  isOtherExpense: false,
};

const item005: ItemItem = {
  expenseNo: '005',
  amount: 500,
  isOtherExpense: false,
};

const expenseByDay01: DataItem = {
  expenseDate: '01/07/2565',
  items: [item001, item002, item003, item004, item005],
  totalAmount: 1000,
};
const expenseByDay02: DataItem = {
  expenseDate: '02/07/2565',
  items: [item001, item002, item003, item004, item005],
  totalAmount: 200,
};
const expenseByDay03: DataItem = {
  expenseDate: '03/07/2565',
  items: [item001, item002, item003, item004, item005],
  totalAmount: 9000,
};

export const periodMockData: ExpensePeriod = {
  period: 1,
  startDate: '2022-07-01T17:00:00Z',
  endDate: '2022-07-15T23:59:59Z',
};
const accountExpense: AccountAccountExpenses = {
  id: '',
  branchCode: '0101',
  docNo: 'BA0001',
  type: 'COFFEE',
  month: 0,
  year: 0,
  expensePeriod: periodMockData,
  status: 'DRAFT',
  attachFiles: [],
  editAttachFiles: [],
  approvalAttachFiles: [],
  sumItems: summary,
  items: [expenseByDay01, expenseByDay02, expenseByDay03],
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
