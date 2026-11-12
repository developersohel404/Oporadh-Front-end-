import { EmptyState } from '@/components/common/empty-state';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { PageHeader } from '@/components/common/page-header';
import { Pagination } from '@/components/common/pagination';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { api, getApiError } from '@/lib/api';
import { PRIORITY_LABELS, REPORT_STATUS_COLORS, REPORT_STATUS_LABELS } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import { FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ReportRow {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
  category?: { nameBn: string | null; name: string };
  upazila?: { nameBn: string | null; name: string };
  reporter?: { profile?: { name: string } };
}

export function AdminReportsPage() {
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/reports?page=${page}&limit=20`)
      .then((r) => {
        setReports(r.data?.data?.reports ?? []);
        setTotalPages(r.data?.data?.meta?.totalPages ?? 1);
      })
      .catch((e) => toast.error(getApiError(e)))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="space-y-4">
      <PageHeader title="সব রিপোর্ট" description="সব এলাকার রিপোর্ট দেখুন" />

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : reports.length === 0 ? (
        <EmptyState icon={FileText} title="কোনো রিপোর্ট নেই" />
      ) : (
        <div className="grid gap-3">
          {reports.map((r) => (
            <Card key={r.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{r.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {r.category?.nameBn ?? r.category?.name} •{' '}
                      {r.upazila?.nameBn ?? r.upazila?.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {r.reporter?.profile?.name && `রিপোর্টার: ${r.reporter.profile.name} • `}
                      {formatDate(r.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={REPORT_STATUS_COLORS[r.status]}>
                      {REPORT_STATUS_LABELS[r.status] ?? r.status}
                    </Badge>
                    <Badge variant="outline">{PRIORITY_LABELS[r.priority] ?? r.priority}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
