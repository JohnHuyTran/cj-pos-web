import { ExpenseInfo } from '../models/branch-accounting-model';

export const mockExpenseInfo: ExpenseInfo = {
  accountName: 'ค่าน้ำแข็ง',
  skuCode: '000000700000007',
  approveLimit1: 2000,
  approveLimt2: 0,
  active: true,
  requiredDocument: 'ใบเสร็จ',
  expenseNo: '2',
};
export const mockExpenseInfoNoActive: ExpenseInfo = {
  accountName: 'ค่านม',
  skuCode: '000000700000007',
  approveLimit1: 2000,
  approveLimt2: 0,
  active: true,
  requiredDocument: 'ใบเสร็จ',
  expenseNo: '1',
};

const fetchMasterExpense = {
  timestamp: '2022-05-10T04:30:57.797+0000',
  ref: '6279ea81972d0d933de2ab9f',
  code: 20000,
  message: 'success',
  data: [mockExpenseInfoNoActive, mockExpenseInfo],
};

export function featchMasterExpenseListAsyncMockup() {
  return new Promise((resolve, reject) => {
    resolve(fetchMasterExpense);
  });
}
