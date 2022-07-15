import { post } from '../adapters/posback-adapter';
import { environment } from '../environment-base';
import { env } from '../adapters/environmentConfigs';
import { Payload } from '../models/audit-plan';

export async function saveDraftAuditPlan(payload: Payload) {
  try {
    const response = await post(`${env.backEnd.url}${environment.checkStock.auditPlan.save.url}`, payload);
    return response;
  } catch (error) {
    throw error;
  }
}
