import { put, get, post } from '../adapters/posback-adapter';
import { environment } from '../environment-base';
import { getPathUrl } from './base-service';
import { ApiError } from '../models/api-error-model';
import {
  CalculatePurchasePIRequest,
  SavePurchasePIRequest,
  SavePurchaseRequest,
} from '../models/supplier-check-order-model';
import { PurchaseCreditNoteType } from '../models/purchase-credit-note';
import { ContentType } from '../utils/enum/common-enum';

export async function saveSupplierOrder(payload: SavePurchaseRequest, piNo: string) {
  const bodyFormData = new FormData();

  bodyFormData.append('requestBody', JSON.stringify(payload));

  try {
    const response = await put(getPathSaveDraft(piNo), bodyFormData, ContentType.MULTIPART).then(
      (result: any) => result
    );
    return response;
  } catch (error) {
    console.log('error = ', error);
    throw error;
  }
}

export async function approveSupplierOrder(payload: SavePurchaseRequest, piNo: string) {
  const bodyFormData = new FormData();

  bodyFormData.append('requestBody', JSON.stringify(payload));

  const response = await put(getPathApprove(piNo), bodyFormData, ContentType.MULTIPART)
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
  const bodyFormData = new FormData();

  bodyFormData.append('requestBody', JSON.stringify(payload));

  // bodyFormData.append('file[]', fileList[0]);

  try {
    const response = await put(
      environment.purchase.supplierOrder.saveDraftPI.url,
      bodyFormData,
      ContentType.MULTIPART
    ).then((result: any) => result);
    return response;
  } catch (error) {
    console.log('error = ', error);
    throw error;
  }
}

export async function approveSupplierPI(payload: SavePurchasePIRequest) {
  const bodyFormData = new FormData();

  bodyFormData.append('requestBody', JSON.stringify(payload));

  const response = await put(environment.purchase.supplierOrder.approvePI.url, bodyFormData, ContentType.MULTIPART)
    .then((result: any) => result)
    .catch((error: ApiError) => {
      throw error;
    });
  return response;
}

export async function draftPurchaseCreditNote(payload: PurchaseCreditNoteType) {
  const response = await put(environment.purchase.supplierOrder.approvePI.url, payload)
    .then((result: any) => result)
    .catch((error: ApiError) => {
      throw error;
    });
  return response;
}

export async function approvePurchaseCreditNote(payload: PurchaseCreditNoteType, fileList: any) {
  const bodyFormData = new FormData();
  bodyFormData.append('requestBody', JSON.stringify(payload));
  bodyFormData.append('file', fileList);
  const response = await put(environment.purchase.supplierOrder.approvePI.url, bodyFormData, ContentType.MULTIPART)
    .then((result: any) => result)
    .catch((error: ApiError) => {
      throw error;
    });
  return response;
}

export async function calculateSupplierPI(payload: CalculatePurchasePIRequest) {
  try {
    const response = await post(environment.purchase.supplierOrder.calculatePI.url, payload).then(
      (result: any) => result
    );
    return response;
  } catch (error) {
    console.log('error = ', error);
    throw error;
  }
}
export async function getFileUrlHuawei(filekey: string) {
  const response = await get(environment.purchase.supplierOrder.supplierFile.url + `/${filekey}`)
    .then((result: any) => result)
    .catch((error: ApiError) => {
      throw error;
    });
  return response;
}
