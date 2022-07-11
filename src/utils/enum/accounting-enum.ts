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
