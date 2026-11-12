import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { api, getApiError } from '@/lib/api';
import { NOTIFICATION_TYPE_LABELS } from '@/lib/constants';
import { formatRelative } from '@/lib/format';
import { connectSocket } from '@/lib/socket';
import type { Notification } from '@/types/notification';
import { Bell, Check, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function NotificationDropdown() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // ============================================================
  // Load notifications
  // ============================================================
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [listRes, countRes] = await Promise.all([
        api.get('/notifications?limit=20'),
        api.get('/notifications/unread-count'),
      ]);
      setNotifications(listRes.data?.data?.notifications ?? []);
      setUnreadCount(countRes.data?.data?.unreadCount ?? 0);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================================
  // Initial count + Real-time via Socket.IO
  // ============================================================
  useEffect(() => {
    // Initial unread count
    api
      .get('/notifications/unread-count')
      .then((r) => setUnreadCount(r.data?.data?.unreadCount ?? 0))
      .catch(() => {});

    // Real-time listener
    const socket = connectSocket();

    const handleNew = (notif: Notification) => {
      setUnreadCount((c) => c + 1);
      setNotifications((prev) => {
        if (prev.some((n) => n.id === notif.id)) return prev;
        return [notif, ...prev];
      });
      toast(notif.title, { description: notif.message });
    };

    socket.on('notification:new', handleNew);

    return () => {
      socket.off('notification:new', handleNew);
    };
  }, []);

  // ============================================================
  // Load on dropdown open
  // ============================================================
  useEffect(() => {
    if (open) load();
  }, [open, load]);

  // ============================================================
  // Mark all as read
  // ============================================================
  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('সব পঠিত চিহ্নিত');
    } catch (e) {
      toast.error(getApiError(e));
    }
  };

  // ============================================================
  // Mark one read
  // ============================================================
  const markRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      // silent
    }
  };

  // ============================================================
  // Click handler → navigate based on type
  // ============================================================
  const handleClick = async (n: Notification) => {
    if (!n.isRead) await markRead(n.id);
    setOpen(false);

    const data = (n.data ?? {}) as Record<string, any>;

    if (data.reportId) {
      navigate(`/dashboard/my-reports/${data.reportId}`);
    } else if (data.ticketId) {
      navigate(`/dashboard/support/${data.ticketId}`);
    } else if (data.conversationId) {
      navigate(`/dashboard/chat/${data.conversationId}`);
    } else if (data.applicationId) {
      navigate('/dashboard/moderator-application');
    } else {
      toast.info(n.message);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96 p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-semibold text-slate-900">নোটিফিকেশন</h3>
          {notifications.some((n) => !n.isRead) && (
            <Button variant="ghost" size="sm" onClick={markAllRead}>
              <Check className="h-3 w-3 mr-1" /> সব পঠিত
            </Button>
          )}
        </div>

        {/* Body */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 px-4">
              <Bell className="h-10 w-10 mx-auto mb-2 text-slate-300" />
              <p className="text-sm text-slate-500">কোনো নোটিফিকেশন নেই</p>
            </div>
          ) : (
            <div>
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`w-full text-left p-3 hover:bg-slate-50 border-b last:border-b-0 transition-colors ${
                    !n.isRead ? 'bg-blue-50/40 border-l-2 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-medium text-sm text-slate-900 truncate">{n.title}</p>
                        {!n.isRead && (
                          <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2">{n.message}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {NOTIFICATION_TYPE_LABELS[n.type] ?? n.type}
                        </Badge>
                        <span className="text-[10px] text-slate-400">
                          {formatRelative(n.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-2 border-t">
            <Button
              variant="ghost"
              className="w-full text-sm"
              onClick={() => {
                setOpen(false);
                navigate('/dashboard/notifications');
              }}
            >
              সব দেখুন
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
