import { EmptyState } from '@/components/common/empty-state';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { PageHeader } from '@/components/common/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { api, getApiError } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { Archive, CheckCircle, Loader2, Newspaper, Plus, Trash2, Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// ============================================================
// Types
// ============================================================

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  status: string;
  category?: string | null;
  coverImage?: string | null;
  publishedAt?: string | null;
  viewCount: number;
  createdAt: string;
}

// ============================================================
// Main Page
// ============================================================

export function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: '',
    content: '',
    category: '',
    coverImage: '',
  });

  // ============================================================
  // Load news
  // ============================================================
  const load = () => {
    setLoading(true);
    api
      .get('/admin/news?limit=100')
      .then((r) => setNews(r.data?.data?.news ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  // ============================================================
  // Open create/edit
  // ============================================================
  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', content: '', category: '', coverImage: '' });
    setOpen(true);
  };

  const openEdit = (n: NewsItem) => {
    setEditing(n);
    setForm({
      title: n.title,
      content: '',
      category: n.category ?? '',
      coverImage: n.coverImage ?? '',
    });
    setOpen(true);
  };

  // ============================================================
  // ⚠️ Cover upload — uses raw axios to avoid any interceptor issues
  // ============================================================
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    console.log('🔵 handleCoverUpload called');
    console.log('📁 File:', file);

    if (!file) {
      toast.error('কোনো ফাইল select করা হয়নি');
      return;
    }

    // Validate
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      toast.error('শুধু jpg, jpeg, png, webp allowed');
      return;
    }

    setUploading(true);

    try {
      const fd = new FormData();
      fd.append('file', file);

      console.log('📤 Sending FormData...');
      console.log('FormData entries:', Array.from(fd.entries()));

      // ⚠️ Content-Type header দিও না
      // ⚠️ transformRequest: undefined → Axios default ব্যবহার করবে
      const r = await api.post('/admin/news/upload-cover', fd);

      console.log('✅ Response:', r.data);

      const url = r.data?.data?.url;
      if (url) {
        setForm((prev) => ({ ...prev, coverImage: url }));
        toast.success('Cover uploaded');
      } else {
        toast.error('Cover URL পাওয়া যায়নি');
      }
    } catch (err) {
      console.error('❌ Upload error:', err);
      toast.error(getApiError(err));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // ============================================================
  // Submit create/edit
  // ============================================================
  const submit = async () => {
    if (!form.title.trim() || form.title.trim().length < 5) {
      toast.error('শিরোনাম কমপক্ষে ৫ অক্ষর');
      return;
    }
    if (!form.content.trim() || form.content.trim().length < 20) {
      toast.error('কনটেন্ট কমপক্ষে ২০ অক্ষর');
      return;
    }

    setSubmitting(true);
    try {
      const payload: any = {
        title: form.title.trim(),
        content: form.content.trim(),
      };
      if (form.category.trim()) payload.category = form.category.trim();
      if (form.coverImage.trim()) payload.coverImage = form.coverImage.trim();

      if (editing) {
        await api.patch(`/admin/news/${editing.id}`, payload);
        toast.success('News updated');
      } else {
        await api.post('/admin/news', payload);
        toast.success('News created');
      }
      setOpen(false);
      load();
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // Publish / Archive / Delete
  // ============================================================
  const publish = async (id: string) => {
    try {
      await api.post(`/admin/news/${id}/publish`);
      toast.success('Published');
      load();
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  const archive = async (id: string) => {
    try {
      await api.post(`/admin/news/${id}/archive`);
      toast.success('Archived');
      load();
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  const remove = async (id: string) => {
    if (!confirm('News মুছে ফেলতে চান?')) return;
    try {
      await api.delete(`/admin/news/${id}`);
      toast.success('Deleted');
      load();
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  // ============================================================
  // Render
  // ============================================================
  return (
    <div className="space-y-4">
      <PageHeader
        title="News Management"
        description="নিউজ create, publish, archive করুন"
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" /> নতুন News
          </Button>
        }
      />

      {/* List */}
      {loading ? (
        <LoadingSpinner size="lg" />
      ) : news.length === 0 ? (
        <EmptyState icon={Newspaper} title="কোনো news নেই" />
      ) : (
        <div className="space-y-3">
          {news.map((n) => (
            <Card key={n.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {n.coverImage ? (
                    <img
                      src={n.coverImage}
                      alt=""
                      className="w-full md:w-32 h-32 object-cover rounded-lg border shrink-0"
                    />
                  ) : (
                    <div className="w-full md:w-32 h-32 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                      <Newspaper className="h-8 w-8 text-slate-400" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900">{n.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Slug: {n.slug} • Views: {n.viewCount}
                    </p>

                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge
                        variant={
                          n.status === 'PUBLISHED'
                            ? 'success'
                            : n.status === 'DRAFT'
                              ? 'secondary'
                              : 'warning'
                        }
                      >
                        {n.status}
                      </Badge>
                      {n.category && <Badge variant="outline">{n.category}</Badge>}
                      <span className="text-xs text-slate-400">{formatDate(n.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    {n.status === 'DRAFT' && (
                      <Button size="sm" onClick={() => publish(n.id)}>
                        <CheckCircle className="h-3 w-3 mr-1" /> Publish
                      </Button>
                    )}
                    {n.status === 'PUBLISHED' && (
                      <Button size="sm" variant="outline" onClick={() => archive(n.id)}>
                        <Archive className="h-3 w-3 mr-1" /> Archive
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => openEdit(n)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(n.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit News' : 'নতুন News'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <Label>শিরোনাম *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="News title"
                disabled={submitting}
              />
            </div>

            {/* Content */}
            <div>
              <Label>কনটেন্ট *</Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={8}
                placeholder="News content..."
                disabled={submitting}
              />
            </div>

            {/* Category */}
            <div>
              <Label>Category</Label>
              <Input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Local News"
                disabled={submitting}
              />
            </div>

            {/* Cover Image */}
            <div>
              <Label>Cover Image</Label>

              <div className="space-y-3 mt-2">
                {/* Upload Button */}
                <label
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-md border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 ${
                    uploading || submitting ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={handleCoverUpload}
                    disabled={uploading || submitting}
                  />
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload Image
                    </>
                  )}
                </label>

                {/* URL input */}
                <Input
                  value={form.coverImage}
                  onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  placeholder="URL auto-fill হবে upload করার পর"
                  disabled={submitting}
                />

                {/* Preview */}
                {form.coverImage && (
                  <div className="relative group inline-block">
                    <img
                      src={form.coverImage}
                      alt="Cover preview"
                      className="max-h-40 rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, coverImage: '' })}
                      className="absolute top-2 right-2 h-7 w-7 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
              বাতিল
            </Button>
            <Button onClick={submit} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>{editing ? 'Update' : 'Create'}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
