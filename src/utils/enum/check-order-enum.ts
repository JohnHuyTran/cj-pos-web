export enum ShipmentDeliveryStatusCodeEnum {
  STATUS_APPROVE = 1,
  STATUS_DRAFT = 0,
  STATUS_CLOSEJOB = 2,
}

export const shipmentStatus = [
  { key: 'DRAFT', text: 'บันทึก' },
  { key: 'WAIT_FOR_APPROVE_1', text: 'รออนุมัติ1' },
  { key: 'APPROVED', text: 'อนุมัติ' },
  { key: 'CLOSED', text: 'ปิดงาน' },
];

const shipmentEnStatus = [
  { key: 'DRAFT', text: 'Draft' },
  { key: 'WAIT_FOR_APPROVE_1', text: 'WaitForApprove1' },
  { key: 'APPROVED', text: 'Approved' },
  { key: 'CLOSED', text: 'Close' },
];

const shipmentType = [
  { key: 0, text: 'ลังกระดาษ /Tote' },
  { key: 1, text: 'สินค้าภายในTote' },
  { key: 2, text: 'โอนลอย' },
];

export const getShipmentStatusText = (key: string) => shipmentStatus.find((item) => item.key === key)?.text;

export const getShipmentTypeText = (key: number) => shipmentType.find((item) => item.key === key)?.text;

export const getShipmentStatusTextEn = (key: string) => shipmentEnStatus.find((item) => item.key === key)?.text;

export const formatFileNam = (sdNo: string, sdStatus: string) => {
  return `${sdNo}-${getShipmentStatusTextEn(sdStatus)}.pdf`;
};
