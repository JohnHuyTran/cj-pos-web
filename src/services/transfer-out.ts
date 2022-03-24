import { deleteData, post } from '../adapters/posback-adapter';
import { environment } from '../environment-base';
import { env } from '../adapters/environmentConfigs';
import { Payload } from '../models/barcode-discount';
import { getPathUrl } from "./base-service";

export async function saveDraftTransferOut(payload: Payload) {
  try {
    const response = await post(`${env.backEnd.url}${environment.withDraw.transferOut.save.url}`, payload);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function sendForApprovalTransferOut(id: string) {
  try {
    const response = await post(getPathSendForApproval(id));
    return response;
  } catch (error) {
    throw error;
  }
}

export async function cancelTransferOut(id: string) {
  try {
    const response = await deleteData(getPathCancelDraft(id));
    return response;
  } catch (error) {
    throw error;
  }
}

export const getPathSendForApproval = (id: string) => {
  return getPathUrl(`${env.backEnd.url}${environment.withDraw.transferOut.sendForApproval.url}`, { id: id });
};

export const getPathCancelDraft = (id: string) => {
  return getPathUrl(`${env.backEnd.url}${environment.withDraw.transferOut.cancel.url}`, { id: id });
};

