import { api } from '../api';

export interface NotificationResponse {
  id: string;
  title: string;
  message: string;
  type: 'RESUME' | 'INTERVIEW' | 'ATS' | 'SYSTEM' | 'SECURITY';
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
}

export interface UnreadCountResponse {
  unreadCount: number;
}

export const getNotifications = async (): Promise<NotificationResponse[]> => {
  const res = await api.get('/notifications');
  return res.data.data;
};

export const getUnreadCount = async (): Promise<UnreadCountResponse> => {
  const res = await api.get('/notifications/unread-count');
  return res.data.data;
};

export const markNotificationAsRead = async (id: string): Promise<NotificationResponse> => {
  const res = await api.put(`/notifications/${id}/read`);
  return res.data.data;
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await api.put('/notifications/read-all');
};
