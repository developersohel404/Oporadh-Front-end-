import { CommentList } from '@/components/comment/comment-list';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';
import { PRIORITY_LABELS, REPORT_STATUS_COLORS, REPORT_STATUS_LABELS } from '@/lib/constants';
import { formatDate, formatRelative } from '@/lib/format';
import { AlertTriangle, Calendar, Clock, FileText, MapPin, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';

export function ReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/reports/public/${id}`)
      .then((r) => setReport(r.data?.data))
      .catch(() => toast.error('রিপোর্ট পাওয়া যায়নি'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner size="lg" />;

  if (!report) {
    return (
      <div className="container mx-auto py-20 text-center">
        <FileText className="h-16 w-16 mx-auto mb-4 text-slate-300" />
        <h2 className="text-2xl font-bold mb-2">রিপোর্ট পাওয়া যায়নি</h2>
        <p className="text-slate-500 mb-4">রিপোর্টটি মুছে ফেলা হয়েছে বা পাওয়া যাচ্ছে না</p>
        <Link to="/reports">
          <Button>সব রিপোর্ট দেখুন</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge className={REPORT_STATUS_COLORS[report.status]}>
            {REPORT_STATUS_LABELS[report.status]}
          </Badge>
          <Badge variant="outline">{PRIORITY_LABELS[report.priority]}</Badge>
          <Badge variant="secondary">{report.category?.nameBn ?? report.category?.name}</Badge>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
          {report.title}
        </h1>

        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {report.upazila?.nameBn}, {report.district?.nameBn}, {report.division?.nameBn}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            ঘটনার তারিখ: {formatDate(report.incidentDate)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {formatRelative(report.createdAt)}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">বিবরণ</h2>
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
              {report.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            {report.incidentAddress && (
              <div>
                <h3 className="text-sm font-semibold mb-1 text-slate-500">ঠিকানা</h3>
                <p className="text-sm text-slate-700">{report.incidentAddress}</p>
              </div>
            )}
            {report.incidentTime && (
              <div>
                <h3 className="text-sm font-semibold mb-1 text-slate-500">ঘটনার সময়</h3>
                <p className="text-sm text-slate-700">{report.incidentTime}</p>
              </div>
            )}
            {report.reporter?.profile?.nickname && (
              <div>
                <h3 className="text-sm font-semibold mb-1 text-slate-500">রিপোর্টার</h3>
                <p className="text-sm text-slate-700 flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {report.reporter.profile.nickname}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Media */}
      {report.media && report.media.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">ছবি / ভিডিও ({report.media.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {report.media.map((m: any) => (
                <div key={m.id} className="rounded-lg overflow-hidden border bg-slate-50">
                  {m.mediaType === 'IMAGE' ? (
                    <img src={m.processedUrl} alt="" className="w-full h-48 object-cover" />
                  ) : (
                    <video src={m.processedUrl} controls className="w-full h-48 object-cover" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-start gap-2 mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                <strong>Privacy Notice:</strong> সব ছবি/ভিডিওতে face blur করা হয়েছে (Section 15)।
                Reporter এবং suspect-এর পরিচয় সংরক্ষিত।
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments */}
      {id && <CommentList type="report" id={id} title="মন্তব্য" />}
    </div>
  );
}
