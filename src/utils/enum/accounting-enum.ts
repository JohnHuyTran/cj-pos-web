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

