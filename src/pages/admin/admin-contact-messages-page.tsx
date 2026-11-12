import { EmptyState } from '@/components/common/empty-state';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { PageHeader } from '@/components/common/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api, getApiError } from '@/lib/api';
import { formatDateTime } from '@/lib/format';
import { Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  NEW: 'নতুন',
  READ: 'পঠিত',
  REPLIED: 'উত্তর দেওয়া',
  ARCHIVED: 'আর্কাইভ',
};

export function AdminContactMessagesPage() {
  const [msgs, setMsgs] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);

  const load = () => {
    setLoading(true);
    api
      .get('/admin/contact-messages?limit=100')
      .then((r) => setMsgs(r.data?.data?.messages ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/admin/contact-messages/${id}/status`, { status });
      toast.success('Status updated');
      load();
      if (selected?.id === id) setSelected({ ...selected, status });
    } catch (e) {
      toast.error(getApiError(e));
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Contact Messages" description="সব যোগাযোগ বার্তা" />

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : msgs.length === 0 ? (
        <EmptyState icon={Mail} title="কোনো message নেই" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            {msgs.map((m) => (
              <Card
                key={m.id}
                className={`cursor-pointer hover:shadow-md transition ${selected?.id === m.id ? 'ring-2 ring-slate-900' : ''}`}
                onClick={() => {
                  setSelected(m);
                  if (m.status === 'NEW') updateStatus(m.id, 'READ');
                }}
              >
                <CardContent className="pt-6">
                  <div className="flex justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium truncate">{m.subject}</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {m.name} • {m.email}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">{formatDateTime(m.createdAt)}</p>
                    </div>
                    <Badge
                      variant={
                        m.status === 'NEW'
                          ? 'destructive'
                          : m.status === 'READ'
                            ? 'secondary'
                            : 'success'
                      }
                    >
                      {STATUS_LABELS[m.status] ?? m.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selected && (
            <Card className="lg:sticky lg:top-20 h-fit">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{selected.subject}</h3>
                  <p className="text-sm text-slate-500 mt-1">{selected.name}</p>
                  <p className="text-xs text-slate-400">
                    {selected.email} {selected.phone && `• ${selected.phone}`}
                  </p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm whitespace-pre-wrap">{selected.message}</p>
                </div>
                <div className="border-t pt-4 space-y-2">
                  <Label className="text-xs">Status</Label>
                  <Select
                    value={selected.status}
                    onValueChange={(v) => updateStatus(selected.id, v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NEW">নতুন</SelectItem>
                      <SelectItem value="READ">পঠিত</SelectItem>
                      <SelectItem value="REPLIED">উত্তর দেওয়া</SelectItem>
                      <SelectItem value="ARCHIVED">আর্কাইভ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <a href={`mailto:${selected.email}`}>
                  <Button className="w-full">Reply via Email</Button>
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
