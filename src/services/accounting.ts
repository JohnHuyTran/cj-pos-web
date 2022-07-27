import { post, put } from '../adapters/posback-adapter';
import { environment } from '../environment-base';
import {
  AccountAccountExpenses,
  CashStatementEditRequest,
  CloseSaleShiftRequest,
  ExpenseApprove3All,
  ExpenseApprove3ByDocNos,
  ExpenseConfigCreateRequest,
  ExpenseConfigUpdateRequest,
  ExpenseSaveRequest,
} from '../models/branch-accounting-model';
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
  const response = await post(
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
  const response = await post(
    environment.branchAccounting.expense.approve.ocArea.url,
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
  const response = await post(
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
  const response = await post(
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
  const response = await post(
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

export async function expenseCreateConfig(payload: ExpenseConfigCreateRequest) {
  try {
    const apiRootPath = `${environment.branchAccounting.expenseConfig.createExpenseConfig.url}`;
    const response = await post(apiRootPath, payload).then((result: any) => result);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function expenseUpdateConfig(expenseNo: string, payload: ExpenseConfigUpdateRequest) {
  const response = await put(
    getPathExpenseUpdate(expenseNo, environment.branchAccounting.expenseConfig.updateExpenseConfig.url),
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

export const getPathExpensePeriodType = (type: string, path: string) => {
  return getPathUrl(`${path}`, { type: type });
};

export const getPathExpenseUpdate = (expenseNo: string, path: string) => {
  return getPathUrl(`${path}`, { expenseNo: expenseNo });
};

export async function getSummarizeByCriteria(payload: any) {
  try {
    const response = await put(environment.branchAccounting.expense.summarize.byCriteria.url, payload).then(
      (result: any) => result
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function getSummarizeByNo(payload: any) {
  try {
    const response = await put(environment.branchAccounting.expense.summarize.byNo.url, payload).then(
      (result: any) => result
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function expenseApprove3ByDocNos(payload: ExpenseApprove3ByDocNos) {
  const response = await put(environment.branchAccounting.expense.approve3.byNo.url, payload, ContentType.JSON)
    .then((result: any) => result)
    .catch((error) => {
      throw error;
    });
  return response;
}

export async function expenseApprove3All(payload: ExpenseApprove3All) {
  const response = await put(environment.branchAccounting.expense.approve3.byCriteria.url, payload, ContentType.JSON)
    .then((result: any) => result)
    .catch((error) => {
      throw error;
    });
  return response;
}

export async function shiftClose(payload: CloseSaleShiftRequest) {
  const response = await post(environment.branchAccounting.closeSaleShift.shiftClose.url, payload, ContentType.JSON)
    .then((result: any) => result)
    .catch((error) => {
      throw error;
    });
  return response;
}

export async function updateConfirmShiftCloses(shiftCode: string, payload: any) {
  const getPathUpdateConfirmShiftCloses = (shiftCode: string, path: string) => {
    return getPathUrl(`${path}`, { shiftCode: shiftCode });
  };

  const response = await put(
    getPathUpdateConfirmShiftCloses(
      shiftCode,
      environment.branchAccounting.closeSaleShift.updateConfirmShiftCloses.url
    ),
    payload,
    ContentType.JSON
  )
    .then((result: any) => result)
    .catch((error) => {
      throw error;
    });
  return response;
}

export async function cashStatementEdit(payload: CashStatementEditRequest) {
  const response = await post(environment.branchAccounting.cashStatement.edit.url, payload, ContentType.JSON)
    .then((result: any) => result)
    .catch((error) => {
      throw error;
    });
  return response;
}
