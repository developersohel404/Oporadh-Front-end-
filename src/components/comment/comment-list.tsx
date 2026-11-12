import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api, getApiError } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import type { Comment } from '@/types/comment';
import { Loader2, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CommentForm } from './comment-form';
import { CommentItem } from './comment-item';

interface CommentListProps {
  type: 'report' | 'news';
  id: string;
  title?: string;
}

export function CommentList({ type, id, title = 'মন্তব্য' }: CommentListProps) {
  const { isAuthenticated } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const endpoint = type === 'report' ? `/reports/${id}/comments` : `/news/${id}/comments`;

  const load = async (pageNum: number, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const r = await api.get(`${endpoint}?page=${pageNum}&limit=20`);
      const newComments = r.data?.data?.comments ?? [];
      const meta = r.data?.data?.meta ?? {};

      setComments((prev) => (append ? [...prev, ...newComments] : newComments));
      setTotalPages(meta.totalPages ?? 1);
    } catch {
      // silent
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, type]);

  const handleSubmit = async (content: string) => {
    if (!isAuthenticated) {
      toast.error('মন্তব্য করতে লগইন করুন');
      return;
    }
    try {
      await api.post(endpoint, { content });
      toast.success('মন্তব্য যোগ হয়েছে');
      load(1);
    } catch (e) {
      toast.error(getApiError(e));
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('মন্তব্য মুছে ফেলতে চান?')) return;
    try {
      await api.delete(`${endpoint}/${commentId}`);
      toast.success('মন্তব্য মুছে ফেলা হয়েছে');
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (e) {
      toast.error(getApiError(e));
    }
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    load(next, true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          {title} ({comments.length})
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Comment Form */}
        {isAuthenticated ? (
          <CommentForm onSubmit={handleSubmit} />
        ) : (
          <div className="text-center py-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">
              মন্তব্য করতে{' '}
              <a href="/login" className="text-slate-900 font-medium hover:underline">
                লগইন করুন
              </a>
            </p>
          </div>
        )}

        {/* Divider */}
        <div className="border-t" />

        {/* Comments List */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <MessageCircle className="h-10 w-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm">এখনো কোনো মন্তব্য নেই</p>
            <p className="text-xs mt-1">প্রথম মন্তব্য করুন</p>
          </div>
        ) : (
          <>
            <div className="space-y-1">
              {comments.map((c) => (
                <CommentItem key={c.id} comment={c} onDelete={handleDelete} />
              ))}
            </div>

            {page < totalPages && (
              <div className="text-center pt-2">
                <Button variant="outline" size="sm" onClick={loadMore} disabled={loadingMore}>
                  {loadingMore ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                      লোড হচ্ছে...
                    </>
                  ) : (
                    'আরও দেখুন'
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
