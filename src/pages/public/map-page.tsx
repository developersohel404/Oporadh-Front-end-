import { LoadingSpinner } from '@/components/common/loading-spinner';
import { PageHeader } from '@/components/common/page-header';
import { CrimeMap } from '@/components/map/crime-map';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';

export function MapPage() {
  const [heatmap, setHeatmap] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/crime-map/heatmap').catch(() => ({ data: { data: { points: [] } } })),
      api.get('/crime-map/statistics').catch(() => ({ data: { data: null } })),
    ])
      .then(([h, s]) => {
        setHeatmap(h.data?.data);
        setStats(s.data?.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader title="Crime Map" description="এলাকাভিত্তিক অপরাধ মানচিত্র" />

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold">{stats.totalReports ?? 0}</div>
              <p className="text-sm text-slate-500">মোট রিপোর্ট</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold">{heatmap?.totalPoints ?? 0}</div>
              <p className="text-sm text-slate-500">লোকেশন</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold">{heatmap?.maxIntensity ?? 0}</div>
              <p className="text-sm text-slate-500">সর্বোচ্চ রিপোর্ট</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="overflow-hidden">
        <CrimeMap points={heatmap?.points ?? []} height="600px" />
      </Card>
    </div>
  );
}
