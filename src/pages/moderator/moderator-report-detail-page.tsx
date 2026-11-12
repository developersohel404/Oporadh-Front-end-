import { LoadingSpinner } from '@/components/common/loading-spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { PRIORITY_LABELS, REPORT_STATUS_COLORS, REPORT_STATUS_LABELS } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import { AlertTriangle, ArrowLeft, Check, Eye, EyeOff, HelpCircle, Send, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

export function ModeratorReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dialog, setDialog] = useState<{ type: 'reject' | 'info' | 'escalate' | 'hide' | null }>({
    type: null,
  });
  const [reason, setReason] = useState('');

  const load = () => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/moderator/reports/${id}`)
      .then((r) => setReport(r.data?.data))
      .catch((e) => toast.error(getApiError(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [id]);

  const doAction = async (endpoint: string, body?: any) => {
    if (!id) return;
    setSubmitting(true);
    try {
      await api.post(`/moderator/reports/${id}/${endpoint}`, body ?? {});
      toast.success('সফল');
      setDialog({ type: null });
      setReason('');
      load();
    } catch (e) {
      toast.error(getApiError(e));
    } finally {
      setSubmitting(false);
    }
  };

  const updatePriority = async (priority: string) => {
    if (!id) return;
    try {
      await api.post(`/moderator/reports/${id}/priority`, { priority });
      toast.success('Priority update');
      load();
    } catch (e) {
      toast.error(getApiError(e));
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;
  if (!report) return <p className="text-center py-8 text-slate-500">রিপোর্ট নেই</p>;

  const canReview = ['SUBMITTED', 'UNDER_REVIEW', 'NEED_MORE_INFO'].includes(report.status);
  const canPublish = report.status === 'APPROVED';

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" /> ফিরে যান
      </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <CardTitle className="text-xl">{report.title}</CardTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className={REPORT_STATUS_COLORS[report.status]}>
                  {REPORT_STATUS_LABELS[report.status]}
                </Badge>
                <Badge variant="outline">{PRIORITY_LABELS[report.priority]}</Badge>
                <Badge variant="secondary">{report.category?.nameBn}</Badge>
              </div>
            </div>
            <Select value={report.priority} onValueChange={updatePriority}>
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">কম</SelectItem>
                <SelectItem value="NORMAL">সাধারণ</SelectItem>
                <SelectItem value="HIGH">উচ্চ</SelectItem>
                <SelectItem value="URGENT">জরুরি</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs text-slate-500">বিবরণ</Label>
            <p className="mt-1">{report.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-slate-500">রিপোর্টার</Label>
              <p>{report.reporter?.profile?.name}</p>
            </div>
            <div>
              <Label className="text-xs text-slate-500">এলাকা</Label>
              <p>{report.upazila?.nameBn}</p>
            </div>
            <div>
              <Label className="text-xs text-slate-500">ঘটনার তারিখ</Label>
              <p>{formatDate(report.incidentDate)}</p>
            </div>
            <div>
              <Label className="text-xs text-slate-500">ঠিকানা</Label>
              <p>{report.incidentAddress || '—'}</p>
            </div>
          </div>

          {report.media?.length > 0 && (
            <div>
              <Label className="text-xs text-slate-500">Media ({report.media.length})</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {report.media.map((m: any) => (
                  <img
                    key={m.id}
                    src={m.processedUrl}
                    alt=""
                    className="w-full h-32 object-cover rounded border"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-4 border-t">
            {canReview && (
              <>
                <Button onClick={() => doAction('approve')} disabled={submitting}>
                  <Check className="h-4 w-4 mr-1" /> Approve
                </Button>
                <Button variant="destructive" onClick={() => setDialog({ type: 'reject' })}>
                  <X className="h-4 w-4 mr-1" /> Reject
                </Button>
                <Button variant="outline" onClick={() => setDialog({ type: 'info' })}>
                  <HelpCircle className="h-4 w-4 mr-1" /> Request Info
                </Button>
              </>
            )}
            {canPublish && (
              <Button onClick={() => doAction('publish')} disabled={submitting}>
                <Eye className="h-4 w-4 mr-1" /> Publish
              </Button>
            )}
            {report.status === 'PUBLISHED' && (
              <Button variant="outline" onClick={() => setDialog({ type: 'hide' })}>
                <EyeOff className="h-4 w-4 mr-1" /> Hide
              </Button>
            )}
            <Button variant="outline" onClick={() => setDialog({ type: 'escalate' })}>
              <AlertTriangle className="h-4 w-4 mr-1" /> Escalate
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialog.type !== null} onOpenChange={(o) => !o && setDialog({ type: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialog.type === 'reject' && 'রিপোর্ট Reject'}
              {dialog.type === 'info' && 'আরও তথ্য চাওয়া'}
              {dialog.type === 'escalate' && 'Admin-এর কাছে Escalate'}
              {dialog.type === 'hide' && 'রিপোর্ট Hide'}
            </DialogTitle>
          </DialogHeader>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="কারণ লিখুন..."
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog({ type: null })}>
              বাতিল
            </Button>
            <Button
              variant={
                dialog.type === 'reject' || dialog.type === 'hide' ? 'destructive' : 'default'
              }
              onClick={() => {
                if (dialog.type === 'reject') doAction('reject', { reason });
                else if (dialog.type === 'info') doAction('request-info', { message: reason });
                else if (dialog.type === 'escalate') doAction('escalate', { reason });
                else if (dialog.type === 'hide') doAction('hide', { note: reason });
              }}
              disabled={submitting || reason.trim().length < 5}
            >
              <Send className="h-4 w-4 mr-1" /> নিশ্চিত
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
