import { deleteData, get, post, put } from '../adapters/posback-adapter';
import { environment } from '../environment-base';
import { getPathUrl } from './base-service';
import { env } from '../adapters/environmentConfigs';
import { Payload, CheckStockPayload } from '../models/barcode-discount';

export async function saveDraftBarcodeDiscount(payload: Payload) {
  try {
    const response = await post(`${env.backEnd.url}${environment.sell.barcodeDiscount.save.url}`, payload);
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
    return response;
  } catch (error) {
    throw error;
  }
}

export async function cancelBarcodeDiscount(id: string) {
  try {
    const response = await deleteData(getPathCancelDraft(id));
    return response;
  } catch (error) {
    throw error;
  }
}

export async function checkStockBalance(payload: CheckStockPayload) {
  try {
    const response = await post(`${env.backEnd.url}${environment.stock.stockBalanceCheck.url}`, payload);
    return response;
  } catch (error) {
    throw error;
  }
}

export const getPathUpdateDraft = (id: string) => {
  return getPathUrl(`${env.backEnd.url}${environment.sell.barcodeDiscount.update.url}`, { id: id });
};

export const getPathApproveDraft = (id: string) => {
  return getPathUrl(`${env.backEnd.url}${environment.sell.barcodeDiscount.approve.url}`, { id: id });
};

export const getPathCancelDraft = (id: string) => {
  return getPathUrl(`${env.backEnd.url}${environment.sell.barcodeDiscount.cancel.url}`, { id: id });
};
