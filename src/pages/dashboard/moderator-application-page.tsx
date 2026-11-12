// src/pages/dashboard/moderator-application-page.tsx
import { LoadingSpinner } from '@/components/common/loading-spinner';
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
import { getBengaliName } from '@/lib/format';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function ModeratorApplicationPage() {
  const [existing, setExisting] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [upazilas, setUpazilas] = useState<any[]>([]);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    reason: '',
    level: 'UPAZILA' as const,
    divisionId: '',
    districtId: '',
    upazilaId: '',
  });

  useEffect(() => {
    api
      .get('/moderator-applications/me')
      .then((r) => setExisting(r.data?.data))
      .catch(() => {})
      .finally(() => setLoading(false));
    api.get('/locations/divisions').then((r) => setDivisions(r.data?.data ?? []));
  }, []);

  const onDiv = async (id: string) => {
    setForm({ ...form, divisionId: id, districtId: '', upazilaId: '' });
    setDistricts([]);
    setUpazilas([]);
    const r = await api.get(`/locations/divisions/${id}/districts`);
    setDistricts(r.data?.data?.districts ?? []);
  };

  const onDist = async (id: string) => {
    setForm({ ...form, districtId: id, upazilaId: '' });
    setUpazilas([]);
    const r = await api.get(`/locations/districts/${id}/upazilas`);
    setUpazilas(r.data?.data?.upazilas ?? []);
  };

  const submit = async () => {
    if (!form.fullName || !form.email || !form.reason || !form.divisionId) {
      toast.error('সব required field দিন');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/moderator-applications', form);
      toast.success('আবেদন জমা সফল');
      const r = await api.get('/moderator-applications/me');
      setExisting(r.data?.data);
    } catch (e) {
      toast.error(getApiError(e));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  if (existing) {
    return (
      <div className="max-w-2xl space-y-4">
        <PageHeader title="মডারেটর আবেদন" />
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="flex justify-between">
              <h2 className="font-semibold">আপনার আবেদন</h2>
              <Badge
                variant={
                  existing.status === 'APPROVED'
                    ? 'success'
                    : existing.status === 'REJECTED'
                      ? 'destructive'
                      : 'warning'
                }
              >
                {existing.status}
              </Badge>
            </div>
            <div className="text-sm space-y-1">
              <p>
                <strong>নাম:</strong> {existing.fullName}
              </p>
              <p>
                <strong>Level:</strong> {existing.level}
              </p>
              <p>
                <strong>কারণ:</strong> {existing.reason}
              </p>
              {existing.rejectionReason && (
                <p className="text-red-600">
                  <strong>প্রত্যাখ্যান:</strong> {existing.rejectionReason}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-4">
      <PageHeader
        title="মডারেটর হতে আবেদন"
        description="আপনার এলাকার জন্য moderator হতে চাইলে আবেদন করুন"
      />
      <Card>
        <CardHeader>
          <CardTitle>আবেদনের তথ্য</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>পূর্ণ নাম *</Label>
            <Input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </div>
          <div>
            <Label>ইমেইল *</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <Label>ফোন</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <Label>Level</Label>
            <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v as any })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UPAZILA">উপজেলা</SelectItem>
                <SelectItem value="DISTRICT">জেলা</SelectItem>
                <SelectItem value="DIVISION">বিভাগ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>বিভাগ *</Label>
            <Select value={form.divisionId} onValueChange={onDiv}>
              <SelectTrigger>
                <SelectValue placeholder="বিভাগ" />
              </SelectTrigger>
              <SelectContent>
                {divisions.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {getBengaliName(d)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {form.level !== 'DIVISION' && (
            <div>
              <Label>জেলা</Label>
              <Select value={form.districtId} onValueChange={onDist}>
                <SelectTrigger>
                  <SelectValue placeholder="জেলা" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {getBengaliName(d)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {form.level === 'UPAZILA' && (
            <div>
              <Label>উপজেলা</Label>
              <Select
                value={form.upazilaId}
                onValueChange={(v) => setForm({ ...form, upazilaId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="উপজেলা" />
                </SelectTrigger>
                <SelectContent>
                  {upazilas.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {getBengaliName(u)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div>
            <Label>অভিজ্ঞতা</Label>
            <Textarea
              value={form.experience}
              onChange={(e) => setForm({ ...form, experience: e.target.value })}
              rows={2}
            />
          </div>
          <div>
            <Label>কারণ *</Label>
            <Textarea
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              rows={4}
              placeholder="কেন moderator হতে চান..."
            />
          </div>
          <Button onClick={submit} disabled={submitting} className="w-full">
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> জমা হচ্ছে...
              </>
            ) : (
              'আবেদন করুন'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
