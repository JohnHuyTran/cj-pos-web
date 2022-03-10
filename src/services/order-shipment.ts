import { get, post, put } from '../adapters/posback-adapter';
import { environment } from '../environment-base';
import { SaveDraftSDRequest, GenerateBORequest, ItemsApprove } from '../models/order-model';
import { getPathUrl } from './base-service';
import { env } from '../adapters/environmentConfigs';
import { ApiError } from '../models/api-error-model';
import { OrderReceiveApproveRequest } from '../models/dc-check-order-model';
import { ContentType } from '../utils/enum/common-enum';

export async function saveOrderShipments(payload: SaveDraftSDRequest, sdNo: string) {
  try {
    const response = await put(getPathSaveDraft(sdNo), payload).then((result: any) => result);
    return response;
  } catch (error) {
    console.log('error = ', error);
    throw error;
  }
}

export async function approveOrderShipments(sdNo: string, payload: any) {
  const response = await put(getPathApprove(sdNo), payload)
    .then((result: any) => result)
    .catch((error: ApiError) => {
      throw error;
    });
  return response;
}

export async function closeOrderShipments(sdNo: string, fileList: File[]) {
  const bodyFormData = new FormData();
  bodyFormData.append('requestBody', JSON.stringify({}));

  fileList.map((file: File) => {
    return bodyFormData.append('file[]', file);
  });

  try {
    const response = await put(getPathClose(sdNo), bodyFormData, ContentType.MULTIPART).then((result: any) => result);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function fetchShipmentDeliverlyPDF(sdNo: string) {
  try {
    const path = getPathUrl(environment.orders.shipment.printFormShipmentDeliverly.url, { sdNo: sdNo });
    const response = await get(path).then((result: any) => result);
    return response;
  } catch (error) {
    console.log('error = ', error);
    throw error;
  }
}

export async function generateBO(sdNo: string, payload: GenerateBORequest) {
  const response = await put(getPathGenerateBO(sdNo), payload)
    .then((result: any) => result)
    .catch((error: ApiError) => {
      throw error;
    });
  return response;
}

export const getPathReportSD = (sdNo: string) => {
  return getPathUrl(`${env.backEnd.url}${environment.orders.shipment.printFormShipmentDeliverly.url}`, { sdNo: sdNo });
};

export const getPathSaveDraft = (sdNo: string) => {
  return getPathUrl(`${environment.orders.shipment.saveDraft.url}`, {
    sdNo: sdNo,
  });
};

// export async function approve(sdNo: string, payload: ItemsApprove) {
//   const response = await put(getPathApprove(sdNo), payload)
//     .then((result: any) => result)
//     .catch((error: ApiError) => {
//       throw error;
//     });
//   return response;
// }

export const getPathApprove = (sdNo: string) => {
  return getPathUrl(`${environment.orders.shipment.approve.url}`, {
    sdNo: sdNo,
  });
};

export const getPathClose = (sdNo: string) => {
  return getPathUrl(`${environment.orders.shipment.closejob.url}`, {
    sdNo: sdNo,
  });
};

export const getPathGenerateBO = (sdNo: string) => {
  return getPathUrl(`${environment.orders.shipment.approve.url}`, {
    sdNo: sdNo,
  });
};

export async function approveDCOrderShipments(idDC: string, payload: any) {
  const response = await put(getPathDCApprove(idDC), payload)
    .then((result: any) => result)
    .catch((error: ApiError) => {
      throw error;
    });
  return response;
}

export const getPathDCApprove = (idDC: string) => {
  return getPathUrl(`${environment.orders.dcCheckOrder.approve.url}`, {
    idDC: idDC,
  });
};

export async function searchOrderReceive(docNo: string) {
  try {
    const apiRootPath = `${environment.orders.shipment.search.url}/${docNo}`;
    const response = await get(apiRootPath).then((result: any) => result);
    // const response = orders;
    return response;
  } catch (error) {
    throw error;
  }
}

export async function approveOrderReceive(payload: OrderReceiveApproveRequest) {
  try {
    const apiRootPath = `${environment.orders.shipment.approveOrderReceive.url}`;
    const response = await put(apiRootPath, payload).then((result: any) => result);
    return response;
  } catch (error) {
    throw error;
  }
}
