// src/pages/dashboard/notifications-page.tsx
import { EmptyState } from '@/components/common/empty-state';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';
import { formatDateTime } from '@/lib/format';
import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';

export function NotificationsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api
      .get('/notifications?limit=50')
      .then((r) => setItems(r.data?.data?.notifications ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id: string) => {
    await api.patch(`/notifications/${id}/read`);
    setItems((p) => p.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAll = async () => {
    await api.patch('/notifications/read-all');
    load();
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-4">
      <PageHeader
        title="নোটিফিকেশন"
        actions={
          items.some((n) => !n.isRead) ? (
            <Button variant="outline" onClick={markAll}>
              সব পঠিত
            </Button>
          ) : null
        }
      />
      {items.length === 0 ? (
        <EmptyState icon={Bell} title="কোনো নোটিফিকেশন নেই" />
      ) : (
        <div className="space-y-2">
          {items.map((n) => (
            <Card
              key={n.id}
              className={`cursor-pointer ${!n.isRead ? 'border-l-4 border-l-blue-500' : ''}`}
              onClick={() => !n.isRead && markRead(n.id)}
            >
              <CardContent className="pt-4">
                <h3 className="font-medium">{n.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{n.message}</p>
                <p className="text-xs text-slate-400 mt-2">{formatDateTime(n.createdAt)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
