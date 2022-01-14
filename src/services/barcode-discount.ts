import { get, post, put } from "../adapters/posback-adapter";
import { environment } from "../environment-base";
import { getPathUrl } from "./base-service";
import { env } from "../adapters/environmentConfigs";
import { Payload } from "../models/barcode-discount";

export async function saveBarcodeDiscount(payload: Payload) {
  try {
    const response = await post(environment.barcodeDiscount.save.url, payload);
    return response;
  } catch (error) {
    throw error;
  }
}
export async function updateBarcodeDiscount(payload: Payload, id: string) {
  try {
    const response = await post(getPathUpdateDraft(id), payload);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function approveBarcodeDiscount(id: string) {
  try {
    const response = await post(getPathApproveDraft(id));
  } catch (error) {
    throw error;
  }
}

export const getPathUpdateDraft = (id: string) => {
  return getPathUrl(
    `${env.backEnd.url}${environment.barcodeDiscount.update.url}`,
    { id: id }
  );
};

export const getPathApproveDraft = (id: string) => {
  return getPathUrl(
    `${env.backEnd.url}${environment.barcodeDiscount.approve.url}`,
    { id: id }
  );
};
