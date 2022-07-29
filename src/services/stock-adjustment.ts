import { deleteData, post } from '../adapters/posback-adapter';
import { environment } from '../environment-base';
import { env } from '../adapters/environmentConfigs';

export async function saveDraftStockAdjust(payload: any) {
  try {
    const response = await post('http://192.168.110.127:8000/stock-adjust', payload);
    return response;
  } catch (error) {
    throw error;
  }
}