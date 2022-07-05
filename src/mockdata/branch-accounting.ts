import { ExpenseInfo } from '../models/branch-accoounting-model';

export const mockExpenseInfo: ExpenseInfo = {
  accountName: 'ค่าน้ำแข็ง',
  skuCode: '000000700000007',
  maxLimitArea: 2000,
  maxLimitOC: 0,
  active: true,
  docReferance: 'ใบเสร็จ',
};
export const mockExpenseInfoNoActive: ExpenseInfo = {
  accountName: 'ค่านม',
  skuCode: '000000700000007',
  maxLimitArea: 2000,
  maxLimitOC: 0,
  active: true,
  docReferance: 'ใบเสร็จ',
};
