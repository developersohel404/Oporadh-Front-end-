import { api } from '@/lib/api';
import type { Notification } from '@/types/notification';
import { useEffect, useState } from 'react';

export const useNotifications = (limit = 50) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([api.get(`/notifications?limit=${limit}`), api.get('/notifications/unread-count')])
      .then(([notifRes, countRes]) => {
        setNotifications(notifRes.data?.data?.notifications ?? []);
        setUnreadCount(countRes.data?.data?.unreadCount ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [limit]);

  return { notifications, unreadCount, loading, reload: load };
};
