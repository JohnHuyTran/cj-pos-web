import { deleteData, get, post } from "../adapters/posback-adapter";
import { environment } from "../environment-base";
import { env } from "../adapters/environmentConfigs";
import { Payload } from "../models/barcode-discount";
import { getPathUrl } from "./base-service";

export async function saveDraftTransferOut(payload: Payload) {
  try {
    const response = await post(
      `${env.backEnd.url}${environment.withDraw.transferOut.save.url}`,
      payload
    );
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

export async function approveTransferOut(id: string, payload: any) {
  try {
    const response = await post(getPathApprove(id), payload);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function rejectTransferOut(id: string) {
  try {
    const response = await get(getPathReject(id));
    return response;
  } catch (error) {
    throw error;
  }
}

export async function endTransferOut(id: string, payload: any) {
  try {
    const response = await post(getPathEnd(id), payload);
    return response;
  } catch (error) {
    throw error;
  }
}

export const getPathSendForApproval = (id: string) => {
  return getPathUrl(
    `${env.backEnd.url}${environment.withDraw.transferOut.sendForApproval.url}`,
    { id: id }
  );
};

export const getPathCancelDraft = (id: string) => {
  return getPathUrl(
    `${env.backEnd.url}${environment.withDraw.transferOut.cancel.url}`,
    { id: id }
  );
};

export const getPathApprove = (id: string) => {
  return getPathUrl(
    `${env.backEnd.url}${environment.withDraw.transferOut.approve.url}`,
    { id: id }
  );
};

export const getPathReject = (id: string) => {
  return getPathUrl(
    `${env.backEnd.url}${environment.withDraw.transferOut.reject.url}`,
    { id: id }
  );
};

export const getPathEnd = (id: string) => {
  return getPathUrl(
    `${env.backEnd.url}${environment.withDraw.transferOut.end.url}`,
    { id: id }
  );
};
