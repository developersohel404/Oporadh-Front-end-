import { EmptyState } from '@/components/common/empty-state';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { PageHeader } from '@/components/common/page-header';
import { Pagination } from '@/components/common/pagination';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api, getApiError } from '@/lib/api';
import { PRIORITY_LABELS, REPORT_STATUS_COLORS, REPORT_STATUS_LABELS } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import { FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export function ModeratorReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState('all');

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (status !== 'all') params.set('status', status);
    api
      .get(`/moderator/reports?${params}`)
      .then((r) => {
        setReports(r.data?.data?.reports ?? []);
        setTotalPages(r.data?.data?.meta?.totalPages ?? 1);
      })
      .catch((e) => toast.error(getApiError(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [page, status]);

  return (
    <div className="space-y-4">
      <PageHeader title="রিপোর্ট রিভিউ" description="নিজের এলাকার রিপোর্ট review করুন" />

      <Card>
        <CardContent className="pt-6">
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">সব</SelectItem>
              <SelectItem value="SUBMITTED">জমা</SelectItem>
              <SelectItem value="UNDER_REVIEW">রিভিউ চলছে</SelectItem>
              <SelectItem value="NEED_MORE_INFO">তথ্য দরকার</SelectItem>
              <SelectItem value="APPROVED">অনুমোদিত</SelectItem>
              <SelectItem value="PUBLISHED">প্রকাশিত</SelectItem>
              <SelectItem value="REJECTED">প্রত্যাখ্যাত</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : reports.length === 0 ? (
        <EmptyState icon={FileText} title="কোনো রিপোর্ট নেই" />
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <Link key={r.id} to={`/moderator/reports/${r.id}`}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{r.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {r.category?.nameBn} • {r.upazila?.nameBn}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {r.reporter?.profile?.name && `${r.reporter.profile.name} • `}
                        {formatDate(r.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={REPORT_STATUS_COLORS[r.status]}>
                        {REPORT_STATUS_LABELS[r.status]}
                      </Badge>
                      <Badge variant="outline">{PRIORITY_LABELS[r.priority]}</Badge>
                    </div>
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
