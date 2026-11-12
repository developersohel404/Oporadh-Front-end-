import { PageHeader } from '@/components/common/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { api, getApiError } from '@/lib/api';
import { AlertTriangle, Image as ImageIcon, Loader2, Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// ============================================================
// Types
// ============================================================

interface UploadedMedia {
  id: string;
  processedUrl: string;
  mediaType: string;
  mimeType: string;
  fileSize: number;
}

// ============================================================
// Main Page
// ============================================================

export function CreateReportPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia[]>([]);

  const [form, setForm] = useState({
    title: '',
    categoryId: '',
    description: '',
    incidentAddress: '',
    incidentDate: new Date().toISOString().slice(0, 10),
    incidentTime: '',
    suspectName: '',
    priority: 'NORMAL',
  });

  // ============================================================
  // Load categories
  // ============================================================
  useEffect(() => {
    api
      .get('/crime-categories')
      .then((r) => setCategories(r.data?.data ?? []))
      .catch(() => {});
  }, []);

  // ============================================================
  // Ensure report created (for media upload)
  // ============================================================
  const ensureReportCreated = async (): Promise<string | null> => {
    if (reportId) return reportId;

    if (!form.title || form.title.length < 5) {
      toast.error('শিরোনাম কমপক্ষে ৫ অক্ষর');
      return null;
    }
    if (!form.categoryId) {
      toast.error('ক্যাটাগরি নির্বাচন করুন');
      return null;
    }
    if (!form.description || form.description.length < 10) {
      toast.error('বিবরণ কমপক্ষে ১০ অক্ষর');
      return null;
    }

    try {
      const r = await api.post('/reports', {
        ...form,
        incidentDate: new Date(form.incidentDate).toISOString(),
      });
      const id = r.data?.data?.id;
      if (!id) throw new Error('Report ID পাওয়া যায়নি');
      setReportId(id);
      toast.success('রিপোর্ট ড্রাফট তৈরি');
      return id;
    } catch (e) {
      toast.error(getApiError(e));
      return null;
    }
  };

  // ============================================================
  // Upload media
  // ============================================================
  const handleMediaUpload = async (file: File) => {
    const rid = await ensureReportCreated();
    if (!rid) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      // ⚠️ Content-Type header দিও না
      const r = await api.post(`/reports/${rid}/media`, fd);

      const media = r.data?.data;
      if (media) {
        setUploadedMedia((prev) => [...prev, media]);
        toast.success('ছবি upload সফল');
      }
    } catch (e) {
      toast.error(getApiError(e));
    } finally {
      setUploading(false);
    }
  };

  const removeMedia = async (mediaId: string) => {
    if (!reportId) return;
    try {
      await api.delete(`/reports/${reportId}/media/${mediaId}`);
      setUploadedMedia((prev) => prev.filter((m) => m.id !== mediaId));
      toast.success('ছবি মুছে ফেলা হয়েছে');
    } catch (e) {
      toast.error(getApiError(e));
    }
  };

  // ============================================================
  // Final Submit
  // ============================================================
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (reportId) {
        await api.patch(`/reports/${reportId}`, {
          ...form,
          incidentDate: new Date(form.incidentDate).toISOString(),
        });
      } else {
        await api.post('/reports', {
          ...form,
          incidentDate: new Date(form.incidentDate).toISOString(),
        });
      }
      toast.success('রিপোর্ট জমা হয়েছে!');
      navigate('/dashboard/my-reports');
    } catch (e) {
      toast.error(getApiError(e));
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // Render
  // ============================================================
  return (
    <div className="max-w-3xl space-y-4">
      <PageHeader title="নতুন রিপোর্ট" description="আপনার এলাকার অপরাধ সম্পর্কে জানান" />

      <form onSubmit={submit} className="space-y-4">
        {/* ==================== Report Details ==================== */}
        <Card>
          <CardHeader>
            <CardTitle>রিপোর্টের তথ্য</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div>
              <Label>শিরোনাম *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="যেমন: চুরির ঘটনা ঘটেছে"
                disabled={loading || !!reportId}
              />
            </div>

            {/* Category */}
            <div>
              <Label>ক্যাটাগরি *</Label>
              <Select
                value={form.categoryId}
                onValueChange={(v) => setForm({ ...form, categoryId: v })}
                disabled={loading || !!reportId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nameBn ?? c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <Label>বিবরণ *</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={5}
                placeholder="বিস্তারিত লিখুন..."
                disabled={loading}
              />
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>তারিখ *</Label>
                <Input
                  type="date"
                  value={form.incidentDate}
                  onChange={(e) => setForm({ ...form, incidentDate: e.target.value })}
                  disabled={loading}
                />
              </div>
              <div>
                <Label>সময়</Label>
                <Input
                  value={form.incidentTime}
                  onChange={(e) => setForm({ ...form, incidentTime: e.target.value })}
                  placeholder="সকাল ১০টা"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <Label>ঠিকানার বিবরণ</Label>
              <Input
                value={form.incidentAddress}
                onChange={(e) => setForm({ ...form, incidentAddress: e.target.value })}
                placeholder="যেমন: দেবিদ্বার বাজার"
                disabled={loading}
              />
            </div>

            {/* Suspect + Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>সন্দেহভাজন (ঐচ্ছিক)</Label>
                <Input
                  value={form.suspectName}
                  onChange={(e) => setForm({ ...form, suspectName: e.target.value })}
                  disabled={loading}
                />
              </div>
              <div>
                <Label>Priority</Label>
                <Select
                  value={form.priority}
                  onValueChange={(v) => setForm({ ...form, priority: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">কম</SelectItem>
                    <SelectItem value="NORMAL">সাধারণ</SelectItem>
                    <SelectItem value="HIGH">উচ্চ</SelectItem>
                    <SelectItem value="URGENT">জরুরি</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ==================== Media Upload ==================== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              ছবি / ভিডিও (ঐচ্ছিক)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Privacy notice */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <AlertTriangle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-800">
                <strong>Privacy Notice:</strong> সব ছবিতে automatic face blur করা হবে (Section 15)।
                Public-এ শুধু blurred version দেখা যাবে।
              </div>
            </div>

            {/* Upload button */}
            <label className="cursor-pointer inline-block">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleMediaUpload(f);
                  e.target.value = '';
                }}
                disabled={uploading}
              />
              <Button type="button" variant="outline" asChild disabled={uploading}>
                <span>
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Upload হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      ছবি যোগ করুন
                    </>
                  )}
                </span>
              </Button>
            </label>

            {/* Media preview grid */}
            {uploadedMedia.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {uploadedMedia.map((m) => (
                  <div key={m.id} className="relative group">
                    <img
                      src={m.processedUrl}
                      alt=""
                      className="w-full h-28 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeMedia(m.id)}
                      className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <Badge variant="secondary" className="absolute bottom-1 left-1 text-[10px]">
                      Blurred ✓
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-slate-500">
              📌 ছবি upload করলে রিপোর্ট প্রথমে DRAFT হিসেবে সেভ হবে
            </p>
          </CardContent>
        </Card>

        {/* ==================== Submit Buttons ==================== */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={loading}>
            বাতিল
          </Button>
          <Button type="submit" disabled={loading} size="lg">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> জমা হচ্ছে...
              </>
            ) : (
              'রিপোর্ট জমা দিন'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
