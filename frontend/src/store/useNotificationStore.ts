import { create } from 'zustand';
import { 
  NotificationResponse, 
  getNotifications, 
  getUnreadCount, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from '@/lib/api/notifications';

interface NotificationState {
  notifications: NotificationResponse[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  isOpen: boolean;

  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  togglePanel: () => void;
  closePanel: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  isOpen: false,

  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getNotifications();
      set({ notifications: data });
    } catch (err: any) {
      set({ error: err?.response?.data?.message || 'Failed to load notifications' });
    } finally {
      set({ loading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const data = await getUnreadCount();
      set({ unreadCount: data.unreadCount });
    } catch (err) {
      console.error('Failed to fetch unread count', err);
    }
  },

  markAsRead: async (id: string) => {
    const { notifications, unreadCount } = get();
    const notification = notifications.find(n => n.id === id);
    if (!notification || notification.isRead) return;

    // Optimistic update
    set({
      notifications: notifications.map(n => 
        n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
      ),
      unreadCount: Math.max(0, unreadCount - 1)
    });

    try {
      await markNotificationAsRead(id);
    } catch (err) {
      // Revert if failed
      set({ notifications, unreadCount });
      console.error('Failed to mark notification as read', err);
    }
  },

  markAllAsRead: async () => {
    const { notifications, unreadCount } = get();
    if (unreadCount === 0) return;

    // Optimistic update
    set({
      notifications: notifications.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() })),
      unreadCount: 0
    });

    try {
      await markAllNotificationsAsRead();
    } catch (err) {
      // Revert if failed
      set({ notifications, unreadCount });
      console.error('Failed to mark all notifications as read', err);
    }
  },

  togglePanel: () => {
    const isNowOpen = !get().isOpen;
    set({ isOpen: isNowOpen });
    if (isNowOpen) {
      get().fetchNotifications();
    }
  },

  closePanel: () => {
    set({ isOpen: false });
  }
}));
