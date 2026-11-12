import { LoadingSpinner } from '@/components/common/loading-spinner';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    api
      .get(`/news/${slug}`)
      .then((r) => setNews(r.data?.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingSpinner size="lg" />;
  if (!news) return <div className="container mx-auto py-12 text-center">News পাওয়া যায়নি</div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Card>
        {news.coverImage && (
          <img src={news.coverImage} alt="" className="w-full h-64 object-cover rounded-t-xl" />
        )}
        <CardContent className="pt-6 space-y-4">
          <h1 className="text-3xl font-bold">{news.title}</h1>
          <p className="text-sm text-slate-500">{formatDate(news.publishedAt ?? news.createdAt)}</p>
          <div className="prose prose-slate max-w-none whitespace-pre-wrap">{news.content}</div>
        </CardContent>
      </Card>
    </div>
  );
}
