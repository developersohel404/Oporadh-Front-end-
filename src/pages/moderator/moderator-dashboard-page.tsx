import { LoadingSpinner } from '@/components/common/loading-spinner';
import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { CheckCircle2, Clock, FileText, TrendingUp, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ModeratorDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/moderator/dashboard')
      .then((r) => setData(r.data?.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner size="lg" />;
  if (!data) return <p className="text-center py-8 text-slate-500">ডেটা লোড হয়নি</p>;

  const stats = [
    { label: 'মোট রিপোর্ট', value: data.reports.total, icon: FileText, color: 'text-blue-500' },
    { label: 'জমা', value: data.reports.submitted, icon: Clock, color: 'text-amber-500' },
    { label: 'রিভিউ', value: data.reports.underReview, icon: Clock, color: 'text-purple-500' },
    {
      label: 'প্রকাশিত',
      value: data.reports.published,
      icon: CheckCircle2,
      color: 'text-green-500',
    },
    { label: 'প্রত্যাখ্যাত', value: data.reports.rejected, icon: XCircle, color: 'text-red-500' },
    {
      label: 'অনুমোদিত',
      value: data.reports.approved,
      icon: CheckCircle2,
      color: 'text-emerald-500',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="মডারেটর ড্যাশবোর্ড"
        description={`${data.jurisdiction.level} level moderator`}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs text-slate-600">{s.label}</CardTitle>
                <Icon className={`h-4 w-4 ${s.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{s.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> ক্যাটাগরি অনুযায়ী
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.categories?.length ? (
            <div className="space-y-3">
              {data.categories.map((c: any, i: number) => {
                const max = data.categories[0]?.count || 1;
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{c.category?.nameBn ?? c.category?.name}</span>
                      <span className="text-slate-500">{c.count}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-900"
                        style={{ width: `${(c.count / max) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-4">কোনো তথ্য নেই</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
