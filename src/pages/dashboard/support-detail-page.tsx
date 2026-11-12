// src/pages/dashboard/support-detail-page.tsx
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import { SUPPORT_STATUS_LABELS } from '@/lib/constants';
import { formatDateTime } from '@/lib/format';
import { ArrowLeft, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function SupportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<any>(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    if (!id) return;
    api
      .get(`/support/tickets/${id}`)
      .then((r) => setTicket(r.data?.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [id]);

  const send = async () => {
    if (!id || !reply.trim()) return;
    await api.post(`/support/tickets/${id}/messages`, { message: reply });
    setReply('');
    load();
  };

  if (loading) return <LoadingSpinner size="lg" />;
  if (!ticket) return <p className="text-center py-8">Ticket পাওয়া যায়নি</p>;

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" /> ফিরে যান
      </Button>
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold">{ticket.subject}</h2>
            <Badge>{SUPPORT_STATUS_LABELS[ticket.status]}</Badge>
          </div>
          <p className="text-sm text-slate-600">{ticket.message}</p>

          <div className="border-t pt-4 space-y-3">
            {ticket.messages
              ?.filter((m: any) => !m.isInternal)
              .map((m: any) => (
                <div key={m.id} className="p-3 bg-slate-50 rounded">
                  <p className="text-xs text-slate-500 mb-1">
                    {m.sender?.profile?.name || 'Support'} • {formatDateTime(m.createdAt)}
                  </p>
                  <p className="text-sm">{m.message}</p>
                </div>
              ))}
          </div>

          {ticket.status !== 'CLOSED' && (
            <div className="flex gap-2 border-t pt-4">
              <Textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={2}
                placeholder="উত্তর..."
              />
              <Button onClick={send}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
