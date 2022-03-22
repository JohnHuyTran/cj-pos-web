import { environment } from '../environment-base';
import { getPathUrl } from './base-service';

export const getPathInvoiceDetail = (billNo: string) => {
  return getPathUrl(`${environment.sale.taxInvoice.detail.url}`, {
    billNo: billNo,
  });
};
