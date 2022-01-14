import { put } from '../adapters/posback-adapter';
import { environment } from '../environment-base';
import { ContentType } from '../utils/enum/common-enum';
import { SaveStockTransferRequest } from '../models/stock-transfer-model';

export async function saveStockTransfer(payload: SaveStockTransferRequest) {
  try {
    const response = await put(environment.stock.saveStockTransfer.url, payload, ContentType.JSON).then(
      (result: any) => result
    );
    return response;
  } catch (error) {
    console.log('error = ', error);
    throw error;
  }
}
