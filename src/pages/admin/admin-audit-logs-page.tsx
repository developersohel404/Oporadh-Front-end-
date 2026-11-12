import { EmptyState } from '@/components/common/empty-state';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { PageHeader } from '@/components/common/page-header';
import { Pagination } from '@/components/common/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { api, getApiError } from '@/lib/api';
import { formatDateTime } from '@/lib/format';
import { ScrollText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Log {
  id: string;
  action: string;
  targetType?: string;
  targetId?: string;
  metadata?: any;
  createdAt: string;
  actor?: { email: string; role: string; profile?: { name: string } };
}

export function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [action, setAction] = useState('');

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '50' });
    if (action) params.set('action', action);
    api
      .get(`/admin/audit-logs?${params}`)
      .then((r) => {
        setLogs(r.data?.data?.logs ?? []);
        setTotalPages(r.data?.data?.meta?.totalPages ?? 1);
      })
      .catch((e) => toast.error(getApiError(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [page]);

  return (
    <div className="space-y-4">
      <PageHeader title="Audit Logs" description="সব গুরুত্বপূর্ণ action-এর log" />

      <Card>
        <CardContent className="pt-6 flex gap-3">
          <Input
            placeholder="Action filter (যেমন: REPORT_APPROVED)"
            value={action}
            onChange={(e) => setAction(e.target.value)}
          />
          <Button
            onClick={() => {
              setPage(1);
              load();
            }}
          >
            Filter
          </Button>
        </CardContent>
      </Card>

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : logs.length === 0 ? (
        <EmptyState icon={ScrollText} title="কোনো log নেই" />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>সময়</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell>
                      <Badge variant="secondary">{l.action}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {l.actor?.profile?.name || l.actor?.email || '—'}
                      <span className="text-xs text-slate-400 ml-2">{l.actor?.role}</span>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">
                      {l.targetType}: {l.targetId?.slice(0, 8) ?? '—'}
                    </TableCell>
                    <TableCell className="text-xs">{formatDateTime(l.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
