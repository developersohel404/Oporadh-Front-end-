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
import { Label } from '@/components/ui/label';
import { api, getApiError } from '@/lib/api';
import { SUPPORT_CATEGORY_LABELS, SUPPORT_STATUS_LABELS } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import { Headphones, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: string;
  createdAt: string;
  user?: { id: string; email: string; profile?: { name: string } };
  assignedToId?: string | null;
  _count?: { messages: number };
}

export function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignId, setAssignId] = useState<string | null>(null);
  const [moderators, setModerators] = useState<any[]>([]);
  const [selectedMod, setSelectedMod] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get('/admin/support/tickets?limit=100')
      .then((r) => setTickets(r.data?.data?.tickets ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    api
      .get('/admin/moderators?limit=100')
      .then((r) => setModerators(r.data?.data?.moderators ?? []));
  }, []);

  const openAssign = (id: string) => {
    setAssignId(id);
    setSelectedMod('');
  };

  const doAssign = async () => {
    if (!selectedMod) {
      toast.error('Moderator নির্বাচন করুন');
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/admin/support/tickets/${assignId}/assign`, { moderatorId: selectedMod });
      toast.success('Assign সফল');
      setAssignId(null);
      load();
    } catch (e) {
      toast.error(getApiError(e));
    } finally {
      setSubmitting(false);
    }
  };

  const doClose = async (id: string) => {
    if (!confirm('Close?')) return;
    try {
      await api.post(`/admin/support/tickets/${id}/close`);
      toast.success('Closed');
      load();
    } catch (e) {
      toast.error(getApiError(e));
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Support Tickets" description="সব support ticket দেখুন" />

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : tickets.length === 0 ? (
        <EmptyState icon={Headphones} title="কোনো ticket নেই" />
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <Card key={t.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{t.subject}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {t.user?.profile?.name || t.user?.email} •{' '}
                      {SUPPORT_CATEGORY_LABELS[t.category]} • {formatDate(t.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      variant={
                        t.status === 'CLOSED'
                          ? 'secondary'
                          : t.status === 'ESCALATED'
                            ? 'destructive'
                            : 'default'
                      }
                    >
                      {SUPPORT_STATUS_LABELS[t.status]}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      {t._count?.messages ?? 0} messages
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={() => openAssign(t.id)}>
                    Assign
                  </Button>
                  {t.status !== 'CLOSED' && (
                    <Button size="sm" variant="outline" onClick={() => doClose(t.id)}>
                      Close
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!assignId} onOpenChange={(o) => !o && setAssignId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign to Moderator</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label>Moderator</Label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {moderators.map((m) => (
                <label
                  key={m.id}
                  className={`flex items-center gap-2 p-2 border rounded cursor-pointer ${selectedMod === m.userId ? 'bg-slate-100 border-slate-400' : ''}`}
                >
                  <input
                    type="radio"
                    name="mod"
                    checked={selectedMod === m.userId}
                    onChange={() => setSelectedMod(m.userId)}
                  />
                  <div>
                    <p className="text-sm font-medium">{m.user?.profile?.name || m.user?.email}</p>
                    <p className="text-xs text-slate-500">
                      {m.level} • {m.upazila?.nameBn ?? m.district?.nameBn ?? m.division?.nameBn}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignId(null)}>
              বাতিল
            </Button>
            <Button onClick={doAssign} disabled={submitting}>
              <Send className="h-4 w-4 mr-1" /> Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
