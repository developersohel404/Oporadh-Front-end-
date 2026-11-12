import { EmptyState } from '@/components/common/empty-state';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { PageHeader } from '@/components/common/page-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { Newspaper } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/news?limit=20')
      .then((r) => setNews(r.data?.data?.news ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader title="নিউজ" description="Latest updates" />
      {news.length === 0 ? (
        <EmptyState icon={Newspaper} title="কোনো news নেই" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((n) => (
            <Link key={n.id} to={`/news/${n.slug}`}>
              <Card className="hover:shadow-md h-full">
                {n.coverImage && (
                  <img
                    src={n.coverImage}
                    alt=""
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                )}
                <CardContent className="pt-4 space-y-2">
                  {n.category && <Badge variant="secondary">{n.category}</Badge>}
                  <h3 className="font-semibold line-clamp-2">{n.title}</h3>
                  <p className="text-xs text-slate-400">
                    {formatDate(n.publishedAt ?? n.createdAt)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
