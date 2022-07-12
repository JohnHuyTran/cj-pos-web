import { post, put } from '../adapters/posback-adapter';
import { environment } from '../environment-base';
import { AccountAccountExpenses, ExpenseSaveRequest } from '../models/branch-accounting-model';
import { ContentType } from '../utils/enum/common-enum';
import { getPathUrl } from './base-service';

export async function expenseSave(payload: ExpenseSaveRequest, files: File[]) {
  const bodyFormData = new FormData();
  bodyFormData.append('requestBody', JSON.stringify(payload));
  files.map((file: File) => {
    return bodyFormData.append('file[]', file);
  });
  const response = await put(environment.branchAccounting.expense.save.url, bodyFormData, ContentType.MULTIPART)
    .then((result: any) => result)
    .catch((error) => {
      throw error;
    });
  return response;
}

export async function expenseApproveByBranch(payload: ExpenseSaveRequest, files: File[]) {
  const bodyFormData = new FormData();
  bodyFormData.append('requestBody', JSON.stringify(payload));
  files.map((file: File) => {
    return bodyFormData.append('file[]', file);
  });
  const response = await put(
    getPathExpense(payload.docNo || '', environment.branchAccounting.expense.approve.branch.url),
    bodyFormData,
    ContentType.MULTIPART
  )
    .then((result: any) => result)
    .catch((error) => {
      throw error;
    });
  return response;
}

export async function expenseApproveByOC(payload: ExpenseSaveRequest, files: File[]) {
  const bodyFormData = new FormData();
  bodyFormData.append('requestBody', JSON.stringify(payload));
  files.map((file: File) => {
    return bodyFormData.append('file[]', file);
  });
  const response = await put(
    getPathExpense(payload.docNo || '', environment.branchAccounting.expense.approve.ocArea.url),
    bodyFormData,
    ContentType.MULTIPART
  )
    .then((result: any) => result)
    .catch((error) => {
      throw error;
    });
  return response;
}

export async function expenseApproveByAccount(payload: ExpenseSaveRequest) {
  const response = await put(
    getPathExpense(payload.docNo || '', environment.branchAccounting.expense.approve.account.url),
    payload,
    ContentType.JSON
  )
    .then((result: any) => result)
    .catch((error) => {
      throw error;
    });
  return response;
}

export async function expenseApproveByAccountManager(payload: ExpenseSaveRequest) {
  const response = await put(
    getPathExpense(payload.docNo || '', environment.branchAccounting.expense.approve.accountManager.url),
    payload,
    ContentType.JSON
  )
    .then((result: any) => result)
    .catch((error) => {
      throw error;
    });
  return response;
}

export async function expenseRejectByOC(payload: ExpenseSaveRequest) {
  const response = await put(
    getPathExpense(payload.docNo || '', environment.branchAccounting.expense.reject.ocArea.url),
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

export async function expenseRejectByAccountManager(payload: ExpenseSaveRequest) {
  const response = await put(
    getPathExpense(payload.docNo || '', environment.branchAccounting.expense.reject.accountManager.url),
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

export const getPathExpenseDetail = (docNo: string, path: string) => {
  return getPathUrl(`${path}`, { docNo: docNo });
};
