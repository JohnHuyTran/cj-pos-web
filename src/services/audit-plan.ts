import { post } from '../adapters/posback-adapter';
import { environment } from '../environment-base';
import { env } from '../adapters/environmentConfigs';
import { Payload, PayloadCounting } from '../models/audit-plan';
import { getPathUrl } from './base-service';

export async function saveDraftAuditPlan(payload: Payload) {
  try {
    const response = await post(`${env.backEnd.url}${environment.checkStock.auditPlan.save.url}`, payload);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function confirmAuditPlan(id: string) {
  try {
    const response = await post(getPathConfirmAP(id));
    return response;
  } catch (error) {
    throw error;
  }
}

export async function countingAuditPlan(payload: PayloadCounting) {
  try {
    const response = await post(`${env.backEnd.url}${environment.checkStock.auditPlan.counting.url}`, payload);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function cancelAuditPlan(id: string) {
  try {
    const response = await post(getPathCancelAP(id));
    return response;
  } catch (error) {
    throw error;
  }
}

export const getPathConfirmAP = (id: string) => {
  return getPathUrl(`${env.backEnd.url}${environment.checkStock.auditPlan.confirm.url}`, { id: id });
};

export const getPathCancelAP = (id: string) => {
  return getPathUrl(`${env.backEnd.url}${environment.checkStock.auditPlan.cancel.url}`, { id: id });
};
