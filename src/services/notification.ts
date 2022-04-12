import { get } from '../adapters/posback-adapter';
import { environment } from '../environment-base';

export async function getNotificationTasks(page: number) {
  try {
    const response = await get(`${environment.task.notification.tasks.url}?page=${page + 1}&perPage=10`);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function getNotificationReminders(page: number) {
  try {
    const response = await get(`${environment.task.notification.reminders.url}?page=${page + 1}&perPage=10`);
    return response;
  } catch (error) {
    throw error;
  }
}
export async function getNotificationAnnouncements(page: number) {
  try {
    const response = await get(`${environment.task.notification.announcements.url}?page=${page + 1}&perPage=10`);
    return response;
  } catch (error) {
    throw error;
  }
}
