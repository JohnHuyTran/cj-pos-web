import { deleteData, post } from '../adapters/posback-adapter';
import { environment } from '../environment-base';
import { env } from '../adapters/environmentConfigs';
import { getPathUrl } from "./base-service";

export async function confirmStockCount(payload: any) {
  try {
    const response = await post(`${env.backEnd.url}${environment.checkStock.stockCount.confirm.url}`, payload);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function cancelStockCount(id: string) {
  try {
    const response = await deleteData(getPathCancelStockCount(id));
    return response;
  } catch (error) {
    throw error;
  }
}

export const getPathCancelStockCount = (id: string) => {
  return getPathUrl(`${env.backEnd.url}${environment.checkStock.stockCount.cancel.url}`, { id: id });
};

