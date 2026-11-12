import { EmptyState } from '@/components/common/empty-state';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { PageHeader } from '@/components/common/page-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';
import { formatRelative } from '@/lib/format';
import { connectSocket } from '@/lib/socket';
import { useAuthStore } from '@/stores/auth-store';
import { MessageCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// ============================================================
// Main Page
// ============================================================

export function ChatPage() {
  const user = useAuthStore((s) => s.user);
  const [convs, setConvs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // Load conversations
  // ============================================================
  const load = useCallback(() => {
    api
      .get('/conversations')
      .then((r) => setConvs(r.data?.data?.conversations ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();

    // Real-time: refresh list when new message arrives
    const socket = connectSocket();
    const handleNewMessage = () => {
      load();
    };

    socket.on('message:new', handleNewMessage);

    return () => {
      socket.off('message:new', handleNewMessage);
    };
  }, [load]);

  // ============================================================
  // Loading
  // ============================================================
  if (loading) return <LoadingSpinner size="lg" />;

  // ============================================================
  // Render
  // ============================================================
  return (
    <div className="space-y-4">
      <PageHeader title="চ্যাট" description="Moderator-এর সাথে কথোপকথন" />

      {convs.length === 0 ? (
        <EmptyState
          icon={MessageCircle}
          title="কোনো conversation নেই"
          description="আপনার কোনো রিপোর্টে moderator প্রশ্ন করলে এখানে দেখাবে"
        />
      ) : (
        <div className="space-y-2">
          {convs.map((c) => {
            const other = c.userId === user?.id ? c.moderator : c.user;
            return (
              <Link key={c.id} to={`/dashboard/chat/${c.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-4 flex justify-between items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{other?.profile?.name || 'Moderator'}</p>

                      {c.report && (
                        <p className="text-xs text-slate-500 truncate">Report: {c.report.title}</p>
                      )}

                      <p className="text-sm text-slate-500 truncate mt-1">
                        {c.lastMessage?.message || 'No messages yet'}
                      </p>

                      <p className="text-xs text-slate-400 mt-1">{formatRelative(c.updatedAt)}</p>
                    </div>

                    {(c.unreadCount ?? 0) > 0 && (
                      <Badge variant="destructive">{c.unreadCount}</Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
