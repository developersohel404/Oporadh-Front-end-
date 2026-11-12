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
import { Textarea } from '@/components/ui/textarea';
import { api, getApiError } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { Check, ClipboardList, MapPin, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface AppRow {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  experience?: string;
  reason: string;
  level: string;
  status: string;
  createdAt: string;
  user: { id: string; email: string; profile?: { name: string } };
  division?: { nameBn: string | null; name: string };
  district?: { nameBn: string | null; name: string };
  upazila?: { nameBn: string | null; name: string };
}

export function AdminApplicationsPage() {
  const [apps, setApps] = useState<AppRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get('/admin/moderator-applications?status=PENDING&limit=100')
      .then((r) => setApps(r.data?.data?.applications ?? []))
      .catch((e) => toast.error(getApiError(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id: string) => {
    if (!confirm('Approve করতে চান?')) return;
    try {
      await api.post(`/admin/moderator-applications/${id}/approve`);
      toast.success('Approve সফল');
      load();
    } catch (e) {
      toast.error(getApiError(e));
    }
  };

  const handleReject = async () => {
    if (!rejectId || rejectReason.trim().length < 5) {
      toast.error('কারণ দিন (৫+ অক্ষর)');
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/admin/moderator-applications/${rejectId}/reject`, { reason: rejectReason });
      toast.success('Reject সফল');
      setRejectId(null);
      setRejectReason('');
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
        title="Moderator আবেদন"
        description="Pending applications দেখুন এবং review করুন"
      />

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : apps.length === 0 ? (
        <EmptyState icon={ClipboardList} title="কোনো pending application নেই" />
      ) : (
        <div className="space-y-3">
          {apps.map((a) => (
            <Card key={a.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-semibold">{a.fullName}</h3>
                    <p className="text-sm text-slate-500">
                      {a.email} {a.phone && `• ${a.phone}`}
                    </p>
                  </div>
                  <Badge>{a.level}</Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="h-3 w-3" />
                    {a.upazila?.nameBn ?? a.district?.nameBn ?? a.division?.nameBn ?? '—'}
                  </div>
                  {a.experience && (
                    <p>
                      <strong>অভিজ্ঞতা:</strong> {a.experience}
                    </p>
                  )}
                  <p>
                    <strong>কারণ:</strong> {a.reason}
                  </p>
                  <p className="text-xs text-slate-400">জমা: {formatDate(a.createdAt)}</p>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button size="sm" onClick={() => approve(a.id)}>
                    <Check className="h-3 w-3 mr-1" /> Approve
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setRejectId(a.id)}>
                    <X className="h-3 w-3 mr-1" /> Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!rejectId} onOpenChange={(o) => !o && setRejectId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Application Reject করুন</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>কারণ *</Label>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              placeholder="কেন reject করছেন..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectId(null)}>
              বাতিল
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={submitting}>
              {submitting ? 'প্রক্রিয়া...' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
