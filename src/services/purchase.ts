import { put } from '../adapters/posback-adapter';
import { environment } from '../environment-base';
import { getPathUrl } from './base-service';
import { ApiError } from '../models/api-error-model';
import { SavePurchasePIRequest, SavePurchaseRequest } from '../models/supplier-check-order-model';
import { PurchaseCreditNoteType } from '../models/purchase-credit-note';
import { ContentType } from '../utils/enum/common-enum';

// export async function saveSupplierOrder(payload: SavePurchaseRequest, piNo: string) {
//   try {
//     const response = await put(getPathSaveDraft(piNo), payload).then((result: any) => result);
//     return response;
//   } catch (error) {
//     console.log('error = ', error);
//     throw error;
//   }
// }

export async function saveSupplierOrder(payload: SavePurchaseRequest, piNo: string, fileList: File[]) {
  const bodyFormData = new FormData();
  bodyFormData.append('requestBody', JSON.stringify(payload));

  fileList.map((data: File) => {
    return bodyFormData.append('file[]', data);
  });

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

export async function draftPurchaseCreditNote(payload: PurchaseCreditNoteType) {
  const response = await put(environment.purchase.supplierOrder.approvePI.url, payload)
    .then((result: any) => result)
    .catch((error: ApiError) => {
      throw error;
    });
  return response;
}

export async function approvePurchaseCreditNote2(payload: any, fileList: File[]) {
  const bodyFormData = new FormData();
  // bodyFormData.append('requestBody', JSON.stringify(payload));
  bodyFormData.append(
    'requestBody',

    '{"piNo":"","SupplierCode":"0000402671","billNo":"22222","docNo":"","flagPO":1,"comment":"","items":[{"barcode":"8859333830578","actualQty":1}]}'
  );

  // bodyFormData.append('file[]', fileList[0], 'filename.pdf');

  fileList.map((data: File) => {
    return bodyFormData.append('file[]', data);
  });

  const response = await put(environment.purchase.supplierOrder.approvePI.url, bodyFormData, ContentType.MULTIPART)
    .then((result: any) => result)
    .catch((error: ApiError) => {
      throw error;
    });
  return response;
}

export async function approvePurchaseCreditNote(payload: PurchaseCreditNoteType, fileList: any) {
  const bodyFormData = new FormData();
  bodyFormData.append('requestBody', JSON.stringify(payload));
  const response = await put(environment.purchase.supplierOrder.approvePI.url, bodyFormData, ContentType.MULTIPART)
    .then((result: any) => result)
    .catch((error: ApiError) => {
      throw error;
    });
  return response;
}
