import { post } from '../adapters/posback-adapter';
import { environment } from '../environment-base';
import { env } from '../adapters/environmentConfigs';

export async function saveDraftStockAdjust(payload: any) {
  try {
    const response = await post(`${env.backEnd.url}${environment.checkStock.stockAdjustment.saveDraft.url}`, payload);
    return response;
  } catch (error) {
    throw error;
  }
}