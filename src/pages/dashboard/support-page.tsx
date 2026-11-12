// src/pages/dashboard/support-page.tsx
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { api, getApiError } from '@/lib/api';
import { SUPPORT_CATEGORY_LABELS, SUPPORT_STATUS_LABELS } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import { Headphones, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export function SupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ subject: '', category: 'ACCOUNT', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get('/support/tickets?limit=100')
      .then((r) => setTickets(r.data?.data?.tickets ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    if (!form.subject || !form.message) {
      toast.error('সব field দিন');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/support/tickets', form);
      toast.success('Ticket তৈরি সফল');
      setOpen(false);
      setForm({ subject: '', category: 'ACCOUNT', message: '' });
      load();
    } catch (e) {
      toast.error(getApiError(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="সাপোর্ট"
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> নতুন Ticket
          </Button>
        }
      />

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : tickets.length === 0 ? (
        <EmptyState
          icon={Headphones}
          title="কোনো ticket নেই"
          action={<Button onClick={() => setOpen(true)}>Ticket তৈরি</Button>}
        />
      ) : (
        <div className="space-y-2">
          {tickets.map((t) => (
            <Link key={t.id} to={`/dashboard/support/${t.id}`}>
              <Card className="hover:shadow-md">
                <CardContent className="pt-4 flex justify-between">
                  <div>
                    <p className="font-medium">{t.subject}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {SUPPORT_CATEGORY_LABELS[t.category]} • {formatDate(t.createdAt)}
                    </p>
                  </div>
                  <Badge>{SUPPORT_STATUS_LABELS[t.status]}</Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>নতুন Support Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>বিষয় *</Label>
              <Input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </div>
            <div>
              <Label>ক্যাটাগরি</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACCOUNT">অ্যাকাউন্ট</SelectItem>
                  <SelectItem value="REPORT_ISSUE">রিপোর্ট সমস্যা</SelectItem>
                  <SelectItem value="MODERATOR_ISSUE">মডারেটর সমস্যা</SelectItem>
                  <SelectItem value="TECHNICAL">টেকনিক্যাল</SelectItem>
                  <SelectItem value="OTHER">অন্যান্য</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>বার্তা *</Label>
              <Textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              বাতিল
            </Button>
            <Button onClick={submit} disabled={submitting}>
              {submitting ? '...' : 'তৈরি করুন'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
