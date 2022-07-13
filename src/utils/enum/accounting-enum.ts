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
  { key: 'ALL', text: 'ทั้งหมด' },
  { key: 'DRAFT', text: 'บันทึก' },
  { key: 'WAITTING_APPROVAL1', text: 'รออนุมัติ1' },
  { key: 'WAITTING_APPROVAL2', text: 'รออนุมัติ2' },
  { key: 'WAITTING_ACCOUNTING', text: 'รอบัญชีตรวจสอบ' },
  { key: 'WAITTING_APPROVAL3', text: 'รออนุมัติ3' },
  { key: 'APPROVED', text: 'อนุมัติ' },
  { key: 'SEND_BACK_EDIT', text: 'ส่งกลับแก้ไข' },
  { key: 'WAITTING_EDIT_ATTACH_FILE', text: 'รอแก้ไขเอกสาร' },
];

// export const getExpenseTypes = (key: string) => expenseTypes.find((item) => item.key === key)?.text;
// expenseStatusList.find((item) => item.key === key)?.text;
// return stockTransferStatus.filter((item) => item.type === type || item.type === 'ALL');
