import { EmptyState } from '@/components/common/empty-state';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { PageHeader } from '@/components/common/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { api, getApiError } from '@/lib/api';
import { SUPPORT_CATEGORY_LABELS, SUPPORT_STATUS_LABELS } from '@/lib/constants';
import { formatDateTime } from '@/lib/format';
import { AlertTriangle, Headphones, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function ModeratorSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [reply, setReply] = useState('');
  const [escalateOpen, setEscalateOpen] = useState(false);
  const [escalateReason, setEscalateReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get('/moderator/support/tickets?limit=100')
      .then((r) => setTickets(r.data?.data?.tickets ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openTicket = async (t: any) => {
    try {
      const r = await api.get(`/moderator/support/tickets/${t.id}`);
      setSelected(r.data?.data);
    } catch (e) {
      toast.error(getApiError(e));
    }
  };

  const sendReply = async () => {
    if (!selected || !reply.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/moderator/support/tickets/${selected.id}/messages`, { message: reply });
      toast.success('পাঠানো হয়েছে');
      setReply('');
      openTicket(selected);
    } catch (e) {
      toast.error(getApiError(e));
    } finally {
      setSubmitting(false);
    }
  };

  const escalate = async () => {
    if (!selected || !escalateReason.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/moderator/support/tickets/${selected.id}/escalate`, {
        reason: escalateReason,
      });
      toast.success('Escalated');
      setEscalateOpen(false);
      setEscalateReason('');
      load();
    } catch (e) {
      toast.error(getApiError(e));
    } finally {
      setSubmitting(false);
    }
  };

  if (selected) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => setSelected(null)}>
          ← ফিরে যান
        </Button>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between">
              <div>
                <h2 className="font-semibold text-lg">{selected.subject}</h2>
                <p className="text-sm text-slate-500">
                  {selected.user?.profile?.name || selected.user?.email}
                </p>
              </div>
              <Badge>{SUPPORT_STATUS_LABELS[selected.status]}</Badge>
            </div>

            <div className="border-t pt-4 space-y-3 max-h-[400px] overflow-y-auto">
              {selected.messages?.map((m: any) => (
                <div
                  key={m.id}
                  className={`p-3 rounded ${m.isInternal ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50'}`}
                >
                  <p className="text-xs text-slate-500 mb-1">
                    {m.sender?.profile?.name || 'System'} • {formatDateTime(m.createdAt)}
                  </p>
                  <p className="text-sm">{m.message}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="উত্তর লিখুন..."
                rows={2}
              />
              <Button onClick={sendReply} disabled={submitting}>
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2 pt-2 border-t">
              <Button variant="destructive" onClick={() => setEscalateOpen(true)}>
                <AlertTriangle className="h-4 w-4 mr-1" /> Escalate to Admin
              </Button>
            </div>
          </CardContent>
        </Card>

        <Dialog open={escalateOpen} onOpenChange={setEscalateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Escalate to Admin</DialogTitle>
            </DialogHeader>
            <Textarea
              value={escalateReason}
              onChange={(e) => setEscalateReason(e.target.value)}
              placeholder="কারণ..."
              rows={3}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setEscalateOpen(false)}>
                বাতিল
              </Button>
              <Button onClick={escalate} disabled={submitting}>
                Escalate
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Support Tickets" description="নিজের এলাকার সাপোর্ট" />

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : tickets.length === 0 ? (
        <EmptyState icon={Headphones} title="কোনো ticket নেই" />
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <Card
              key={t.id}
              className="cursor-pointer hover:shadow-md"
              onClick={() => openTicket(t)}
            >
              <CardContent className="pt-6">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">{t.subject}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {t.user?.profile?.name} • {SUPPORT_CATEGORY_LABELS[t.category]}
                    </p>
                  </div>
                  <Badge>{SUPPORT_STATUS_LABELS[t.status]}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
