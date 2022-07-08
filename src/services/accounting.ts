import { post, put } from '../adapters/posback-adapter';
import { environment } from '../environment-base';
import { AccountAccountExpenses } from '../models/branch-accounting-model';
import { ContentType } from '../utils/enum/common-enum';
import { getPathUrl } from './base-service';

export async function expenseSave(payload: AccountAccountExpenses, files: File[]) {
  const bodyFormData = new FormData();
  bodyFormData.append('requestBody', JSON.stringify(payload));
  files.map((file: File) => {
    return bodyFormData.append('file[]', file);
  });
  const response = await post(environment.branchAccounting.expense.save.url, bodyFormData, ContentType.MULTIPART)
    .then((result: any) => result)
    .catch((error) => {
      throw error;
    });
  return response;
}

export async function expenseApproveByBranch(payload: any, files: File[]) {
  const bodyFormData = new FormData();
  bodyFormData.append('requestBody', JSON.stringify(payload));
  files.map((file: File) => {
    return bodyFormData.append('file[]', file);
  });
  const response = await put(
    getPathExpense(payload.docNo, environment.branchAccounting.expense.approve.branch.url),
    bodyFormData,
    ContentType.JSON
  )
    .then((result: any) => result)
    .catch((error) => {
      throw error;
    });
  return response;
}

export async function expenseApproveByOC(payload: any, files: File[]) {
  const bodyFormData = new FormData();
  bodyFormData.append('requestBody', JSON.stringify(payload));
  files.map((file: File) => {
    return bodyFormData.append('file[]', file);
  });
  const response = await put(
    getPathExpense(payload.docNo, environment.branchAccounting.expense.approve.ocArea.url),
    bodyFormData,
    ContentType.JSON
  )
    .then((result: any) => result)
    .catch((error) => {
      throw error;
    });
  return response;
}

export async function expenseApproveByAccount(payload: any) {
  const response = await put(
    getPathExpense(payload.docNo, environment.branchAccounting.expense.approve.account.url),
    payload,
    ContentType.JSON
  )
    .then((result: any) => result)
    .catch((error) => {
      throw error;
    });
  return response;
}

export async function expenseApproveByAccountManager(payload: any) {
  const response = await put(
    getPathExpense(payload.docNo, environment.branchAccounting.expense.approve.accountManager.url),
    payload,
    ContentType.JSON
  )
    .then((result: any) => result)
    .catch((error) => {
      throw error;
    });
  return response;
}

export async function expenseRejectByOC(payload: any) {
  const response = await put(
    getPathExpense(payload.docNo, environment.branchAccounting.expense.reject.ocArea.url),
    payload,
    ContentType.JSON
  )
    .then((result: any) => result)
    .catch((error) => {
      throw error;
    });
  return response;
}

export async function expenseRejectByAccount(payload: any) {
  const response = await put(
    getPathExpense(payload.docNo, environment.branchAccounting.expense.reject.account.url),
    payload,
    ContentType.JSON
  )
    .then((result: any) => result)
    .catch((error) => {
      throw error;
    });
  return response;
}

export async function expenseRejectByAccountManager(payload: any) {
  const response = await put(
    getPathExpense(payload.docNo, environment.branchAccounting.expense.reject.accountManager.url),
    payload,
    ContentType.JSON
  )
    .then((result: any) => result)
    .catch((error) => {
      throw error;
    });
  return response;
}
export const getPathExpense = (docNo: string, path: string) => {
  return getPathUrl(`${path}`, { docNo: docNo });
};
