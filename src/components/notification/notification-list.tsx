import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { NOTIFICATION_TYPE_LABELS } from '@/lib/constants';
import { formatRelative } from '@/lib/format';
import type { Notification } from '@/types/notification';
import { Bell } from 'lucide-react';

interface NotificationListProps {
  notifications: Notification[];
  onMarkRead?: (id: string) => void;
  onNotificationClick?: (n: Notification) => void;
}

export function NotificationList({
  notifications,
  onMarkRead,
  onNotificationClick,
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <Bell className="h-12 w-12 mx-auto mb-3 text-slate-300" />
        <p>কোনো নোটিফিকেশন নেই</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {notifications.map((n) => (
        <Card
          key={n.id}
          className={`cursor-pointer hover:shadow-md transition-all ${
            !n.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
          }`}
          onClick={() => {
            if (!n.isRead) onMarkRead?.(n.id);
            onNotificationClick?.(n);
          }}
        >
          <CardContent className="p-4">
            <div className="flex justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-slate-900">{n.title}</h3>
                  {!n.isRead && <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />}
                </div>
                <p className="text-sm text-slate-600">{n.message}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {NOTIFICATION_TYPE_LABELS[n.type] ?? n.type}
                  </Badge>
                  <span className="text-xs text-slate-400">{formatRelative(n.createdAt)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
