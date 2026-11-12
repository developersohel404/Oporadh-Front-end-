// src/pages/dashboard/profile-page.tsx
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { PageHeader } from '@/components/common/page-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { USER_ROLE_LABELS, USER_STATUS_LABELS } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import { User } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ProfilePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/auth/me')
      .then((r) => setData(r.data?.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner size="lg" />;
  if (!data) return <p className="text-center py-8">লোড হয়নি</p>;

  return (
    <div className="max-w-2xl space-y-4">
      <PageHeader title="প্রোফাইল" />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" /> ব্যক্তিগত তথ্য
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>নাম:</strong> {data.profile?.name}
            </div>
            <div>
              <strong>ইমেইল:</strong> {data.email}
            </div>
            <div>
              <strong>Role:</strong>{' '}
              <Badge variant="secondary">{USER_ROLE_LABELS[data.role]}</Badge>
            </div>
            <div>
              <strong>Status:</strong>{' '}
              <Badge variant="success">{USER_STATUS_LABELS[data.status]}</Badge>
            </div>
            <div>
              <strong>বিভাগ:</strong> {data.division?.nameBn ?? '—'}
            </div>
            <div>
              <strong>জেলা:</strong> {data.district?.nameBn ?? '—'}
            </div>
            <div>
              <strong>উপজেলা:</strong> {data.upazila?.nameBn ?? '—'}
            </div>
            <div>
              <strong>যোগদান:</strong> {formatDate(data.createdAt)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
