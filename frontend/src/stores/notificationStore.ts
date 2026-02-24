import { create } from 'zustand';
import api from '../api/axios';

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllRead: () => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,

    fetchNotifications: async () => {
        set({ isLoading: true });
        try {
            const { data } = await api.get('/notifications');
            const notifications = data.notifications;
            const unreadCount = notifications.filter((n: Notification) => !n.is_read).length;
            set({ notifications, unreadCount, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            console.error('Error fetching notifications:', error);
        }
    },

    markAsRead: async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            const notifications = get().notifications.map(n =>
                n.id === id ? { ...n, is_read: true } : n
            );
            const unreadCount = notifications.filter(n => !n.is_read).length;
            set({ notifications, unreadCount });
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    },

    markAllRead: async () => {
        try {
            await api.put('/notifications/read-all');
            const notifications = get().notifications.map(n => ({ ...n, is_read: true }));
            set({ notifications, unreadCount: 0 });
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    },

    deleteNotification: async (id) => {
        try {
            await api.delete(`/notifications/${id}`);
            const notifications = get().notifications.filter(n => n.id !== id);
            const unreadCount = notifications.filter(n => !n.is_read).length;
            set({ notifications, unreadCount });
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    }
}));
