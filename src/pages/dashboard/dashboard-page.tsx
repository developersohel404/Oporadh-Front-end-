import { LoadingSpinner } from '@/components/common/loading-spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { REPORT_STATUS_COLORS, REPORT_STATUS_LABELS } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import { useAuthStore } from '@/stores/auth-store';
import { Bell, CheckCircle2, Clock, FileText, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [reports, setReports] = useState<any[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/reports?limit=5'), api.get('/notifications/unread-count')])
      .then(([rRes, nRes]) => {
        setReports(rRes.data?.data?.reports ?? []);
        setUnread(nRes.data?.data?.unreadCount ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner size="lg" />;

  const total = reports.length;
  const pending = reports.filter((r) =>
    ['SUBMITTED', 'UNDER_REVIEW', 'NEED_MORE_INFO'].includes(r.status)
  ).length;
  const published = reports.filter((r) => r.status === 'PUBLISHED').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">স্বাগতম, {user?.name}!</h1>
        <p className="text-slate-500">আপনার এলাকার নিরাপত্তায় ভূমিকা রাখুন</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/dashboard/my-reports/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> নতুন রিপোর্ট
          </Button>
        </Link>
        <Link to="/dashboard/my-reports">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" /> আমার রিপোর্ট
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row justify-between pb-2">
            <CardTitle className="text-sm">আমার রিপোর্ট</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row justify-between pb-2">
            <CardTitle className="text-sm">পেন্ডিং</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row justify-between pb-2">
            <CardTitle className="text-sm">প্রকাশিত</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{published}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row justify-between pb-2">
            <CardTitle className="text-sm">নোটিফিকেশন</CardTitle>
            <Bell className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unread}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row justify-between">
          <CardTitle>সাম্প্রতিক রিপোর্ট</CardTitle>
          <Link to="/dashboard/my-reports">
            <Button variant="ghost" size="sm">
              সব
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p>এখনো কোনো রিপোর্ট নেই</p>
              <Link to="/dashboard/my-reports/create">
                <Button className="mt-3">প্রথম রিপোর্ট তৈরি করুন</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {reports.map((r) => (
                <Link
                  key={r.id}
                  to={`/dashboard/my-reports/${r.id}`}
                  className="flex justify-between p-3 border rounded hover:bg-slate-50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{r.title}</p>
                    <p className="text-xs text-slate-500">
                      {r.category?.nameBn} • {formatDate(r.createdAt)}
                    </p>
                  </div>
                  <Badge className={REPORT_STATUS_COLORS[r.status]}>
                    {REPORT_STATUS_LABELS[r.status]}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
