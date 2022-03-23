import { post } from '../adapters/posback-adapter';
import { environment } from '../environment-base';
import { env } from '../adapters/environmentConfigs';
import { Payload } from '../models/barcode-discount';

export async function saveDraftTransferOut(payload: Payload) {
  try {
    const response = await post(`${env.backEnd.url}${environment.sell.transferOut.save.url}`, payload);
    return response;
  } catch (error) {
    throw error;
  }
}
