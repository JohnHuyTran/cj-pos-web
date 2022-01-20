import { put } from '../adapters/posback-adapter';
import { environment } from '../environment-base';
import { ContentType } from '../utils/enum/common-enum';
import { SaveStockPackRequest, SaveStockTransferRequest } from '../models/stock-transfer-model';

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

export async function saveStockPack(payload: SaveStockPackRequest) {
  try {
    const response = await put(environment.stock.saveStockPack.url, payload, ContentType.JSON).then(
      (result: any) => result
    );
    return response;
  } catch (error) {
    console.log('error = ', error);
    throw error;
  }
}

export async function sendStockPackDC(payload: SaveStockPackRequest) {
  try {
    const response = await put(environment.stock.sendStockPack.url, payload, ContentType.JSON).then(
      (result: any) => result
    );
    return response;
  } catch (error) {
    console.log('error = ', error);
    throw error;
  }
}
