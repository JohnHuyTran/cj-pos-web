import { post } from '../adapters/posback-adapter';
import { environment } from '../environment-base';
import { env } from '../adapters/environmentConfigs';

export async function confirmStockCount(payload: any) {
  try {
    const response = await post(`${env.backEnd.url}${environment.checkStock.stockCount.confirm.url}`, payload);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function cancelStockCount(id: string) {

}
