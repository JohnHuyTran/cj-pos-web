import { environment } from '../environment-base';
import { getPathUrl } from './base-service';
import { put } from '../adapters/posback-adapter';
import { ContentType } from '../utils/enum/common-enum';
import { SaveInvoiceRequest } from '../models/tax-invoice-model';

export const getPathInvoiceDetail = (billNo: string) => {
  return getPathUrl(`${environment.sale.taxInvoice.detail}`, {
    billNo: billNo,
  });
};

export async function saveInvoice(payload: SaveInvoiceRequest) {
  const response = await put(environment.sale.taxInvoice.detail.url, payload, ContentType.JSON)
    .then((result: any) => result)
    .catch((error) => {
      throw error;
    });
  return response;
}
