import { put, get, post, deleteData, deleteDataBody } from '../adapters/posback-adapter';
import { environment } from '../environment-base';
import { env } from '../adapters/environmentConfigs';
import { getPathUrl } from './base-service';
import { ApiError } from '../models/api-error-model';
import {
  CalculatePurchasePIRequest,
  SavePurchasePIRequest,
  SavePurchaseRequest,
} from '../models/supplier-check-order-model';
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

export async function approveSupplierOrder(payload: SavePurchaseRequest, piNo: string, fileList: File[]) {
  const bodyFormData = new FormData();
  bodyFormData.append('requestBody', JSON.stringify(payload));

  fileList.map((data: File) => {
    return bodyFormData.append('file[]', data);
  });

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

export async function saveSupplierPI(payload: SavePurchasePIRequest, fileList: File[]) {
  const bodyFormData = new FormData();
  bodyFormData.append('requestBody', JSON.stringify(payload));

  fileList.map((data: File) => {
    return bodyFormData.append('file[]', data);
  });

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

export async function approveSupplierPI(payload: SavePurchasePIRequest, fileList: File[]) {
  const bodyFormData = new FormData();
  bodyFormData.append('requestBody', JSON.stringify(payload));

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

export const getPathPurchaseNoteSaveDraft = (piNo: string) => {
  return getPathUrl(`${environment.purchase.purchaseNote.save.url}`, {
    piNo: piNo,
  });
};

export const getPathPurchaseDetail = (piNo: string) => {
  return getPathUrl(`${environment.purchase.purchaseNote.detail.url}`, {
    piNo: piNo,
  });
};

// export const getPathPurchaseNoteInit = (pnNo: string) => {
//   return getPathUrl(`${environment.purchase.purchaseNote.initPn.url}`, {
//     pnNo: pnNo,
//   });
// };

export const getPathPurchaseNoteApprove = (pnNo: string) => {
  return getPathUrl(`${environment.purchase.purchaseNote.approve.url}`, {
    pnNo: pnNo,
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
  bodyFormData.append('requestBody', JSON.stringify(payload));
  files.map((file: File) => {
    return bodyFormData.append('file[]', file);
  });
  const response = await put(
    getPathPurchaseNoteApprove(payload.pnNo ? payload.pnNo : ''),
    bodyFormData,
    ContentType.MULTIPART
  )
    // const response = await put(environment.purchase.supplierOrder.approve.url, bodyFormData, ContentType.MULTIPART)
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

export async function delFileUrlHuawei(filekey: string, docType: string, docNo: string) {
  const pathUrl = environment.purchase.supplierOrder.delFileHuawei.url + `/${docType}/${docNo}`;
  const response = await deleteDataBody(pathUrl, { key: filekey })
    .then((result: any) => result)
    .catch((error: ApiError) => {
      throw error;
    });
  return response;
}

export const getPathReportPI = (piNo: string) => {
  return getPathUrl(`${env.backEnd.url}${environment.purchase.supplierOrder.exportFile.url}`, {
    piNo: piNo,
  });
};
