import { environment } from '../environment-base';
import { getPathUrl } from './base-service';
import { get, put } from '../adapters/posback-adapter';
import { ContentType } from '../utils/enum/common-enum';
import { SaveInvoiceRequest } from '../models/tax-invoice-model';

export const getPathInvoiceDetail = (billNo: string) => {
  return getPathUrl(`${environment.sale.taxInvoice.detail.url}`, {
    billNo: billNo,
  });
};

export async function saveInvoice(payload: SaveInvoiceRequest) {
  const response = await put(environment.sale.taxInvoice.saveInvoice.url, payload, ContentType.JSON)
    .then((result: any) => result)
    .catch((error) => {
      throw error;
    });
  return response;
}

export const getPathSearchMemberInformation = (memberNo: string) => {
  return getPathUrl(`${environment.sale.member.searchMemberInformation.url}`, {
    memberNo: memberNo,
  });
};

export async function searchMemberInformation(memberNo: string) {
  const response = await get(getPathSearchMemberInformation(memberNo), ContentType.JSON)
    .then((result: any) => result)
    .catch((error) => {
      throw error;
    });
  return response;
}