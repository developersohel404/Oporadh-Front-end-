import { LoadingSpinner } from '@/components/common/loading-spinner';
import { PageHeader } from '@/components/common/page-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { REPORT_STATUS_LABELS } from '@/lib/constants';
import { CheckCircle2, Clock, FileText, ShieldCheck, Tag, Users, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/dashboard')
      .then((r) => setData(r.data?.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner size="lg" />;
  if (!data) return <p className="text-center py-8 text-slate-500">ডেটা লোড হয়নি</p>;

  const stats = [
    { label: 'ব্যবহারকারী', value: data.users.total, icon: Users, color: 'text-blue-500' },
    { label: 'মডারেটর', value: data.moderators.total, icon: ShieldCheck, color: 'text-purple-500' },
    { label: 'রিপোর্ট', value: data.reports.total, icon: FileText, color: 'text-amber-500' },
    { label: 'ক্যাটাগরি', value: data.categories.active, icon: Tag, color: 'text-green-500' },
  ];

  const stats2 = [
    { label: 'জমা', value: data.reports.submitted, icon: Clock, color: 'text-blue-500' },
    {
      label: 'প্রকাশিত',
      value: data.reports.published,
      icon: CheckCircle2,
      color: 'text-green-500',
    },
    { label: 'প্রত্যাখ্যাত', value: data.reports.rejected, icon: XCircle, color: 'text-red-500' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="অ্যাডমিন ড্যাশবোর্ড" description="OPORADH প্ল্যাটফর্মের সার্বিক অবস্থা" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-slate-600">{s.label}</CardTitle>
                <Icon className={`h-4 w-4 ${s.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{s.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats2.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-slate-600">{s.label}</CardTitle>
                <Icon className={`h-4 w-4 ${s.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{s.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>সাম্প্রতিক রিপোর্ট</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentReports?.length ? (
              <div className="space-y-2">
                {data.recentReports.slice(0, 5).map((r: any) => (
                  <Link
                    key={r.id}
                    to={`/admin/reports`}
                    className="flex justify-between p-2 border rounded hover:bg-slate-50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{r.title}</p>
                      <p className="text-xs text-slate-500">{r.category?.nameBn}</p>
                    </div>
                    <Badge>{REPORT_STATUS_LABELS[r.status] ?? r.status}</Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-4">কোনো রিপোর্ট নেই</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>সাম্প্রতিক ব্যবহারকারী</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentUsers?.length ? (
              <div className="space-y-2">
                {data.recentUsers.slice(0, 5).map((u: any) => (
                  <div key={u.id} className="flex justify-between p-2 border rounded">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{u.profile?.name || u.email}</p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </div>
                    <Badge variant="secondary">{u.role}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-4">কোনো ব্যবহারকারী নেই</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
