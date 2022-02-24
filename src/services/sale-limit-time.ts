import { deleteData, get, post, put } from '../adapters/posback-adapter';
import { environment } from '../environment-base';
import { getPathUrl } from './base-service';
import { env } from '../adapters/environmentConfigs';
import { Payload } from '../models/sale-limit-time';

export async function saveDraftST(payload: Payload) {
  try {
    const response = await post(`${env.backEnd.url}${environment.sell.saleLimitTime.save.url}`, payload);
    return response;
  } catch (error) {
    throw error;
  }
}
export async function updateDraftST(payload: Payload, id: string) {
  try {
    const response = await post(getPathUpdateDraftST(id), payload);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function getStartSaleLimitTime(id: string) {
  try {
    const response = await post(getPathGetStart(id));
    return response;
  } catch (error) {
    throw error;
  }
}

export async function cancelDraftST(id: string) {
  try {
    const response = await deleteData(getPathCancelDraftST(id));
    return response;
  } catch (error) {
    throw error;
  }
}

export const getPathUpdateDraftST = (id: string) => {
  return getPathUrl(`${env.backEnd.url}${environment.sell.saleLimitTime.update.url}`, { id: id });
};

export const getPathCancelDraftST = (id: string) => {
  return getPathUrl(`${env.backEnd.url}${environment.sell.saleLimitTime.cancel.url}`, { id: id });
};

export const getPathGetStart = (id: string) => {
  return getPathUrl(`${env.backEnd.url}${environment.sell.saleLimitTime.cancel.url}`, { id: id });
};
