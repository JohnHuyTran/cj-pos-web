import { post, put } from '../adapters/posback-adapter';
import { environment } from '../environment-base';
import { ContentType } from '../utils/enum/common-enum';
import {
  Approve1StockTransferRequest,
  Approve2StockTransferRequest,
  BranchTransferRequest,
  SaveStockTransferRequest,
  SubmitStockTransferRequest,
} from '../models/stock-transfer-model';
import { getPathUrl } from './base-service';
import { env } from '../adapters/environmentConfigs';
import { fi } from 'date-fns/locale';

export const getPathStockRequestDetail = (rtNo: string) => {
  return getPathUrl(`${environment.stock.stockRequest.detail.url}`, {
    rtNo: rtNo,
  });
};

export async function saveStockRequest(payload: SaveStockTransferRequest) {
  try {
    const response = await put(environment.stock.stockRequest.save.url, payload, ContentType.JSON).then(
      (result: any) => result
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export const getPathSubmitStockRequest = (rtNo: string) => {
  return getPathUrl(`${environment.stock.stockRequest.submit.url}`, {
    rtNo: rtNo,
  });
};

export async function submitStockRequest(rtNo: string, payload: SubmitStockTransferRequest) {
  const response = await put(getPathSubmitStockRequest(rtNo), payload, ContentType.JSON)
    .then((result: any) => result)
    .catch((error) => {
      throw error;
    });
  return response;
}

export const getPathApprove1StockRequest = (rtNo: string) => {
  return getPathUrl(`${environment.stock.stockRequest.approve1.url}`, {
    rtNo: rtNo,
  });
};

export async function approve1StockRequest(rtNo: string, payload: Approve1StockTransferRequest) {
  const response = await put(getPathApprove1StockRequest(rtNo), payload, ContentType.JSON)
    .then((result: any) => result)
    .catch((error) => {
      throw error;
    });
  return response;
}

export const getPathApprove2StockRequest = (rtNo: string) => {
  return getPathUrl(`${environment.stock.stockRequest.approve2.url}`, {
    rtNo: rtNo,
  });
};

export async function approve2StockRequest(rtNo: string, payload: Approve2StockTransferRequest) {
  const response = await put(getPathApprove2StockRequest(rtNo), payload, ContentType.JSON)
    .then((result: any) => result)
    .catch((error) => {
      throw error;
    });
  return response;
}

export const getPathReject1StockRequest = (rtNo: string) => {
  return getPathUrl(`${environment.stock.stockRequest.reject1.url}`, {
    rtNo: rtNo,
  });
};

export async function reject1StockRequest(rtNo: string, payload: Approve1StockTransferRequest) {
  const response = await put(getPathReject1StockRequest(rtNo), payload, ContentType.JSON)
    .then((result: any) => result)
    .catch((error) => {
      throw error;
    });
  return response;
}

export const getPathReject2StockRequest = (rtNo: string) => {
  return getPathUrl(`${environment.stock.stockRequest.reject2.url}`, {
    rtNo: rtNo,
  });
};

export async function reject2StockRequest(rtNo: string, payload: Approve2StockTransferRequest) {
  const response = await put(getPathReject2StockRequest(rtNo), payload, ContentType.JSON)
    .then((result: any) => result)
    .catch((error) => {
      throw error;
    });
  return response;
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
    throw error;
  }
}
export async function sendBranchTransferToPickup(payload: BranchTransferRequest) {
  try {
    const response = await post(environment.stock.branchTransfer.sendToPickup.url, payload, ContentType.JSON).then(
      (result: any) => result
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export const getPathReportBT = (docType: string, btNo: string) => {
  if (docType === 'BT') {
    return getPathUrl(`${env.backEnd.url}${environment.stock.branchTransfer.reportBT.url}`, { btNo: btNo });
  } else if (docType === 'BO') {
    return getPathUrl(`${env.backEnd.url}${environment.stock.branchTransfer.reportBO.url}`, { btNo: btNo });
  } else if (docType === 'Recall') {
    return getPathUrl(`${env.backEnd.url}${environment.stock.branchTransfer.reportReCall.url}`, { btNo: btNo });
  } else if (docType === 'Box') {
    return getPathUrl(`${env.backEnd.url}${environment.stock.branchTransfer.reportPaperBox.url}`, {
      btNo: btNo,
    });
  }
};

export const getPathRemoveStockRequest = (rtNo: string) => {
  return getPathUrl(`${environment.stock.stockRequest.remove.url}`, {
    rtNo: rtNo,
  });
};

export async function removeStockRequest(rtNo: string) {
  const response = await post(getPathRemoveStockRequest(rtNo), ContentType.JSON)
    .then((result: any) => result)
    .catch((error) => {
      throw error;
    });
  return response;
}
