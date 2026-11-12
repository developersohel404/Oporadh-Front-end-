import { ReportList } from '@/components/report/report-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';
import type { CrimeReport } from '@/types/report';
import { FileText, Map as MapIcon, Newspaper, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function HomePage() {
  const [reports, setReports] = useState<CrimeReport[]>([]);
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    api
      .get('/reports?limit=6')
      .then((r) => setReports(r.data?.data?.reports ?? []))
      .catch(() => {});
    api
      .get('/news?limit=3')
      .then((r) => setNews(r.data?.data?.news ?? []))
      .catch(() => {});
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold text-slate-900 mb-4">OPORADH</h1>
        <p className="text-xl text-slate-600 mb-8">Crime Reporting & Community Safety Platform</p>
        <p className="text-slate-500 mb-8">
          আপনার এলাকার অপরাধ রিপোর্ট করুন, moderator যাচাই করবে, এবং নিরাপদ বাংলাদেশ গড়ুন।
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/register">
            <Button size="lg">শুরু করুন</Button>
          </Link>
          <Link to="/reports">
            <Button variant="outline" size="lg">
              রিপোর্ট দেখুন
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: FileText, label: 'রিপোর্ট', desc: 'Published crime reports' },
          { icon: ShieldCheck, label: 'Verified', desc: 'Moderator verified' },
          { icon: MapIcon, label: 'Crime Map', desc: 'Area-wise data' },
          { icon: Newspaper, label: 'News', desc: 'Latest updates' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <Card key={i}>
              <CardContent className="pt-6 text-center">
                <Icon className="h-8 w-8 mx-auto mb-2 text-slate-600" />
                <h3 className="font-semibold">{item.label}</h3>
                <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Recent Reports */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">সাম্প্রতিক রিপোর্ট</h2>
          <Link to="/reports">
            <Button variant="ghost">সব দেখুন →</Button>
          </Link>
        </div>
        <ReportList
          reports={reports}
          getHref={(r) => `/reports/${r.id}`}
          emptyMessage="এখনো কোনো রিপোর্ট নেই"
        />
      </section>

      {/* News */}
      {news.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">নিউজ</h2>
            <Link to="/news">
              <Button variant="ghost">সব দেখুন →</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {news.map((n: any) => (
              <Link key={n.id} to={`/news/${n.slug}`}>
                <Card className="hover:shadow-md h-full">
                  {n.coverImage && (
                    <img
                      src={n.coverImage}
                      alt=""
                      className="w-full h-40 object-cover rounded-t-xl"
                    />
                  )}
                  <CardContent className="pt-4">
                    <h3 className="font-semibold line-clamp-2">{n.title}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
