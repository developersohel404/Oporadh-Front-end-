import { EmptyState } from '@/components/common/empty-state';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { Pagination } from '@/components/common/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib/api';
import { PRIORITY_LABELS, REPORT_STATUS_COLORS, REPORT_STATUS_LABELS } from '@/lib/constants';
import { formatRelative } from '@/lib/format';
import type { CrimeCategory, CrimeReport } from '@/types/report';
import { Clock, FileText, MapPin, MessageCircle, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export function ReportsPage() {
  const [reports, setReports] = useState<CrimeReport[]>([]);
  const [categories, setCategories] = useState<CrimeCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [status, setStatus] = useState('all');

  // Load categories
  useEffect(() => {
    api
      .get('/crime-categories')
      .then((r) => setCategories(r.data?.data ?? []))
      .catch(() => {});
  }, []);

  // Load reports
  const load = () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '12' });
    if (search.trim()) params.set('search', search.trim());
    if (categoryId !== 'all') params.set('categoryId', categoryId);
    if (status !== 'all') params.set('status', status);

    api
      .get(`/reports/public?${params}`)
      .then((r) => {
        setReports(r.data?.data?.reports ?? []);
        setTotalPages(r.data?.data?.meta?.totalPages ?? 1);
        setTotal(r.data?.data?.meta?.total ?? 0);
      })
      .catch(() => toast.error('রিপোর্ট লোড হয়নি'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, categoryId, status]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">সব রিপোর্ট</h1>
        <p className="text-slate-500">
          মোট <span className="font-semibold text-slate-900">{total}</span> রিপোর্ট — সব এলাকা থেকে
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6 shadow-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[220px] relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="শিরোনাম বা বিবরণ খুঁজুন..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select
              value={categoryId}
              onValueChange={(v) => {
                setCategoryId(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="ক্যাটাগরি" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">সব ক্যাটাগরি</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.nameBn ?? c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">সব status</SelectItem>
                <SelectItem value="SUBMITTED">জমা</SelectItem>
                <SelectItem value="UNDER_REVIEW">রিভিউ চলছে</SelectItem>
                <SelectItem value="APPROVED">অনুমোদিত</SelectItem>
                <SelectItem value="PUBLISHED">প্রকাশিত</SelectItem>
              </SelectContent>
            </Select>

            <Button type="submit">খুঁজুন</Button>
          </form>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      {loading ? (
        <LoadingSpinner size="lg" />
      ) : reports.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="কোনো রিপোর্ট নেই"
          description="এই ফিল্টারে কোনো রিপোর্ট পাওয়া যায়নি"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((r) => (
              <Link key={r.id} to={`/reports/${r.id}`}>
                <Card className="hover:shadow-xl transition-all h-full group overflow-hidden cursor-pointer">
                  {/* Image / placeholder */}
                  {r.media && r.media.length > 0 && r.media[0].processedUrl ? (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={r.media[0].processedUrl}
                        alt={r.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <Badge className={`absolute top-3 left-3 ${REPORT_STATUS_COLORS[r.status]}`}>
                        {REPORT_STATUS_LABELS[r.status]}
                      </Badge>
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative">
                      <FileText className="h-12 w-12 text-slate-400" />
                      <Badge className={`absolute top-3 left-3 ${REPORT_STATUS_COLORS[r.status]}`}>
                        {REPORT_STATUS_LABELS[r.status]}
                      </Badge>
                    </div>
                  )}

                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        {r.category?.nameBn ?? r.category?.name}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {PRIORITY_LABELS[r.priority]}
                      </Badge>
                    </div>

                    <h3 className="font-semibold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {r.title}
                    </h3>

                    <p className="text-sm text-slate-600 line-clamp-2">{r.description}</p>

                    <div className="flex flex-wrap items-center gap-3 pt-2 border-t text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {r.upazila?.nameBn ?? r.upazila?.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatRelative(r.createdAt)}
                      </span>
                      {r._count?.comments !== undefined && r._count.comments > 0 && (
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {r._count.comments}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
