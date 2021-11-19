import { get, post, put } from "../adapters/posback-adapter";
import { environment } from "../environment-base";
import {
  SaveDraftSDRequest,
  GenerateBORequest,
  ItemsApprove,
} from "../models/order-model";
import { getPathUrl } from "./base-service";
import { env } from "../adapters/environmentConfigs";
import { ApiError } from "../models/api-error-model";

export async function saveOrderShipments(
  payload: SaveDraftSDRequest,
  sdNo: string
) {
  try {
    const response = await put(getPathSaveDraft(sdNo), payload).then(
      (result: any) => result
    );
    return response;
  } catch (error) {
    console.log("error = ", error);
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

export async function closeOrderShipments(sdNo: string, payload: any) {
  try {
    const response = await put(getPathClose(sdNo), payload).then(
      (result: any) => result
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function fetchShipmentDeliverlyPDF(sdNo: string) {
  try {
    const path = getPathUrl(
      environment.orders.shipment.printFormShipmentDeliverly.url,
      { sdNo: sdNo }
    );
    const response = await get(path).then((result: any) => result);
    return response;
  } catch (error) {
    console.log("error = ", error);
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
  return getPathUrl(
    `${env.backEnd.url}${environment.orders.shipment.printFormShipmentDeliverly.url}`,
    { sdNo: sdNo }
  );
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
  console.log("approveDCOrderShipments : " + idDC);
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
