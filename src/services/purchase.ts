import { put } from '../adapters/posback-adapter';
import { environment } from '../environment-base';
import { getPathUrl } from './base-service';
import { ApiError } from '../models/api-error-model';
import { SavePurchasePIRequest, SavePurchaseRequest } from '../models/supplier-check-order-model';
import { PurchaseCreditNoteType } from '../models/purchase-credit-note';
import { ContentType } from '../utils/enum/common-enum';

export async function saveSupplierOrder(payload: SavePurchaseRequest, piNo: string) {
  try {
    const response = await put(getPathSaveDraft(piNo), payload).then((result: any) => result);
    return response;
  } catch (error) {
    console.log('error = ', error);
    throw error;
  }
}

export async function approveSupplierOrder(payload: SavePurchaseRequest, piNo: string) {
  const response = await put(getPathApprove(piNo), payload)
    .then((result: any) => result)
    .catch((error: ApiError) => {
      throw error;
    });
  return response;
}

export const getPathSaveDraft = (piNo: string) => {
  return getPathUrl(`${environment.purchase.supplierOrder.saveDraft.url}`, {
    piNo: piNo,
  });
};

export const getPathApprove = (piNo: string) => {
  return getPathUrl(`${environment.purchase.supplierOrder.approve.url}`, {
    piNo: piNo,
  });
};

export async function saveSupplierPI(payload: SavePurchasePIRequest) {
  try {
    const response = await put(environment.purchase.supplierOrder.saveDraftPI.url, payload).then(
      (result: any) => result
    );
    return response;
  } catch (error) {
    console.log('error = ', error);
    throw error;
  }
}

export async function approveSupplierPI(payload: SavePurchasePIRequest) {
  const response = await put(environment.purchase.supplierOrder.approvePI.url, payload)
    .then((result: any) => result)
    .catch((error: ApiError) => {
      throw error;
    });
  return response;
}

export const getPathPurchaseNoteSaveDraft = (piNo: string) => {
  return getPathUrl(`${environment.purchase.purchaseNote.save.url}`, {
    piNo: piNo,
  });
};

export async function draftPurchaseCreditNote(payload: PurchaseCreditNoteType, piNo: string, files: File[]) {
  const bodyFormData = new FormData();
  bodyFormData.append('requestBody', JSON.stringify(payload));
  files.map((file: File) => {
    return bodyFormData.append('file[]', file);
  });

  const response = await put(getPathPurchaseNoteSaveDraft(piNo), bodyFormData)
    .then((result: any) => result)
    .catch((error: ApiError) => {
      throw error;
    });
  return response;
}
export async function approvePurchaseCreditNote(payload: PurchaseCreditNoteType, files: File[]) {
  const bodyFormData = new FormData();
  // bodyFormData.append(
  //   'requestBody',
  //   '{"piNo":"","SupplierCode":"0000402671","billNo":"22222","docNo":"","flagPO":1,"comment":"","items":[{"barcode":"8859333830578","actualQty":1}]}'
  // );
  bodyFormData.append('requestBody', JSON.stringify(payload));
  files.map((file: File) => {
    return bodyFormData.append('file[]', file);
  });
  // const response = await put(environment.purchase.purchaseNote.approve.url, bodyFormData, ContentType.MULTIPART)
  const response = await put(environment.purchase.supplierOrder.approve.url, bodyFormData, ContentType.MULTIPART)
    .then((result: any) => result)
    .catch((error: ApiError) => {
      throw error;
    });
  return response;
}
