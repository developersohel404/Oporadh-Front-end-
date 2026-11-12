// src/pages/dashboard/report-detail-page.tsx
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { REPORT_STATUS_COLORS, REPORT_STATUS_LABELS } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function ReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/reports/${id}`)
      .then((r) => setReport(r.data?.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner size="lg" />;
  if (!report) return <p className="text-center py-8">রিপোর্ট পাওয়া যায়নি</p>;

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" /> ফিরে যান
      </Button>
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>{report.title}</CardTitle>
            <Badge className={REPORT_STATUS_COLORS[report.status]}>
              {REPORT_STATUS_LABELS[report.status]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{report.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>ক্যাটাগরি:</strong> {report.category?.nameBn}
            </div>
            <div>
              <strong>এলাকা:</strong> {report.upazila?.nameBn}
            </div>
            <div>
              <strong>তারিখ:</strong> {formatDate(report.incidentDate)}
            </div>
            <div>
              <strong>ঠিকানা:</strong> {report.incidentAddress || '—'}
            </div>
          </div>
          {report.rejectionReason && (
            <div className="p-3 bg-red-50 rounded">
              <strong>প্রত্যাখ্যানের কারণ:</strong> {report.rejectionReason}
            </div>
          )}
          {report.media?.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {report.media.map((m: any) => (
                <img
                  key={m.id}
                  src={m.processedUrl}
                  className="w-full h-32 object-cover rounded border"
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
