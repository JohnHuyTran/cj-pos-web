import { get } from '../adapters/posback-adapter';
import { environment } from '../environment-base';

export async function getNotificationData(page: number) {
  try {
    const response = await get(`${environment.task.notification.url}?page=${page + 1}&perPage=10`);
    return response;
  } catch (error) {
    throw error;
  }
}
