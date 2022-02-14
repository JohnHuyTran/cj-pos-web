import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
export class POSError {
  code: any;
  httpStatus: number;
  message: string;

  constructor(httpStatus: number, code: any, message: string) {
    this.code = code;
    this.httpStatus = httpStatus;
    this.message = getErrorMessage(httpStatus, code, message);
  }
}

export function getErrorMessage(httpCode: number, errorCode: any, message: string) {
  const { t } = useTranslation('error');
  const err = errorCode ? errorCode : String(httpCode);
  const err_msg = t(err);
  return err_msg ? err_msg : t('default');
}
