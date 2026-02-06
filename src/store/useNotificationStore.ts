import { create } from 'zustand';
import { Notification } from '@/types';

interface NotificationStore {
    notificationData: Notification[] | null;
    setNotificationData: (notificationData: Notification[] | null) => void;
}

export const useNotificationStore = create<NotificationStore>()((set) => ({
    notificationData: null,
    setNotificationData: (notificationData) => set({ notificationData }),
}));
