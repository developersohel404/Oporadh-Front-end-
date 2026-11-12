import { EmptyState } from '@/components/common/empty-state';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { PageHeader } from '@/components/common/page-header';
import { Pagination } from '@/components/common/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';
import { REPORT_STATUS_COLORS, REPORT_STATUS_LABELS } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import { FileText, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function MyReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
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
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="আমার রিপোর্ট"
        description="সব রিপোর্ট"
        actions={
          <Link to="/dashboard/my-reports/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" /> নতুন
            </Button>
          </Link>
        }
      />

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : reports.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="এখনো কোনো রিপোর্ট নেই"
          action={
            <Link to="/dashboard/my-reports/create">
              <Button>রিপোর্ট তৈরি</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <Link key={r.id} to={`/dashboard/my-reports/${r.id}`}>
              <Card className="hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="flex justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold">{r.title}</h3>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{r.description}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {r.category?.nameBn} • {r.upazila?.nameBn} • {formatDate(r.createdAt)}
                      </p>
                    </div>
                    <Badge className={REPORT_STATUS_COLORS[r.status]}>
                      {REPORT_STATUS_LABELS[r.status]}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
