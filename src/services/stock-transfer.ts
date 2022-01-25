import { post, put } from '../adapters/posback-adapter';
import { environment } from '../environment-base';
import { ContentType } from '../utils/enum/common-enum';
import { BranchTransferRequest, SaveStockTransferRequest } from '../models/stock-transfer-model';
import { getPathUrl } from './base-service';

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

export const getPathBranchTransferDetail = (btNo: string) => {
  return getPathUrl(`${environment.stock.branchTransfer.detail.url}`, {
    btNo: btNo,
  });
};

export async function saveBranchTransfer(payload: BranchTransferRequest) {
  try {
    const response = await put(environment.stock.branchTransfer.save.url, payload, ContentType.JSON).then(
      (result: any) => result
    );
    return response;
  } catch (error) {
    console.log('error = ', error);
    throw error;
  }
}

export async function sendBranchTransferToDC(payload: BranchTransferRequest) {
  try {
    const response = await post(environment.stock.branchTransfer.sendDC.url, payload, ContentType.JSON).then(
      (result: any) => result
    );
    return response;
  } catch (error) {
    console.log('error = ', error);
    throw error;
  }
}
