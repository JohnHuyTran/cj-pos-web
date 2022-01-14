export enum DateFormat {
  DATE_FORMAT = 'DD/MM/YYYY',
  MONTH_FORMAT = 'MM/YYYY',
  DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss',
  DATE_TIME_NONO_SEC = 'YYYY-MM-DDTHH:mm:ss.SSS',
  DATE_TIME_DISPLAY_FORMAT = 'DD/MM/YYYY HH:mm',
  DATE_ISO8601 = 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]',
}

export enum ContentType {
  JSON = 'application/json',
  MULTIPART = 'multipart/form-data',
}

export enum BDStatus {
  DRAFT = "1",
  WAIT_FOR_APPROVAL = "2",
  APPROVED = "3",
  BARCODE_PRINTED = "4",
  REJECT = "5",
}
