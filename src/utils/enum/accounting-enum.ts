import { PERMISSION_GROUP } from './permission-enum';

export enum STATUS {
  DRAFT = 'DRAFT', // บันทึก
  SEND_BACK_EDIT = 'SEND_BACK_EDIT', // ส่งกลับแก้ไข
  WAITTING_EDIT_ATTACH_FILE = 'WAITTING_EDIT_ATTACH_FILE', // รอแก้ไขเอกสาร
  WAITTING_APPROVAL1 = 'WAITTING_APPROVAL1', // รออนุมัติ1
  WAITTING_APPROVAL2 = 'WAITTING_APPROVAL2', // รออนุมัติ2
  WAITTING_ACCOUNTING = 'WAITTING_ACCOUNTING', // รอบัญชีตรวจสอบ
  WAITTING_APPROVAL3 = 'WAITTING_APPROVAL3', // รออนุมัติ3
  APPROVED = 'APPROVED', // อนุมัติ
}

export enum EXPENSE_TYPE {
  COFFEE = 'COFFEE',
  STOREFRONT = 'STOREFRONT',
}

export const expenseTypes = [
  { key: 'COFFEE', text: 'ค่าใช้จ่ายร้านกาแฟ' },
  { key: 'STOREFRONT', text: 'ค่าใช้จ่ายหน้าร้าน' },
];

export const expenseStatusList = [
  { key: 'ALL', text: 'ทั้งหมด', stepperGrp: 1 },
  { key: 'DRAFT', text: 'บันทึก', stepperGrp: 1, groupAllow: PERMISSION_GROUP.BRANCH, allowShowSummary: false },
  {
    key: 'SEND_BACK_EDIT',
    text: 'ส่งกลับแก้ไข',
    stepperGrp: 1,
    groupAllow: PERMISSION_GROUP.BRANCH,
    allowShowSummary: false,
  },
  {
    key: 'WAITTING_EDIT_ATTACH_FILE',
    text: 'รอแก้ไขเอกสาร',
    stepperGrp: 1,
    groupAllow: PERMISSION_GROUP.BRANCH,
    allowShowSummary: false,
  },
  {
    key: 'WAITTING_APPROVAL1',
    text: 'รออนุมัติ1',
    stepperGrp: 2,
    groupAllow: PERMISSION_GROUP.AREA_MANAGER,
    allowShowSummary: false,
  },
  {
    key: 'WAITTING_APPROVAL2',
    text: 'รออนุมัติ2',
    stepperGrp: 2,
    groupAllow: PERMISSION_GROUP.OC,
    allowShowSummary: false,
  },
  {
    key: 'WAITTING_ACCOUNTING',
    text: 'รอบัญชีตรวจสอบ',
    stepperGrp: 3,
    groupAllow: PERMISSION_GROUP.ACCOUNTING,
    allowShowSummary: true,
  },
  {
    key: 'WAITTING_APPROVAL3',
    text: 'รออนุมัติ3',
    stepperGrp: 3,
    groupAllow: PERMISSION_GROUP.ACCOUNT_MANAGER,
    allowShowSummary: true,
  },
  { key: 'APPROVED', text: 'อนุมัติ', stepperGrp: 4 },
];

export const getExpenseStatus = (key: string) => expenseStatusList.find((item) => item.key === key);

// export const getExpenseTypes = (key: string) => expenseTypes.find((item) => item.key === key)?.text;
// expenseStatusList.find((item) => item.key === key)?.text;
// return stockTransferStatus.filter((item) => item.type === type || item.type === 'ALL');
