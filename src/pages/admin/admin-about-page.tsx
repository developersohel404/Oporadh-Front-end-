import { LoadingSpinner } from '@/components/common/loading-spinner';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { api, getApiError } from '@/lib/api';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Item {
  id: string;
  key: string;
  title?: string | null;
  content: string;
}

export function AdminAboutPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get('/about')
      .then((r) => setItems(r.data?.data?.items ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const update = (idx: number, field: 'title' | 'content', value: string) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    setItems(newItems);
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      await api.patch('/admin/about/bulk', {
        items: items.map((i) => ({ key: i.key, title: i.title, content: i.content })),
      });
      toast.success('সব update সফল');
    } catch (e) {
      toast.error(getApiError(e));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-4">
      <PageHeader
        title="About Content"
        description="About page-এর কনটেন্ট edit করুন"
        actions={
          <Button onClick={saveAll} disabled={saving}>
            <Save className="h-4 w-4 mr-2" /> {saving ? 'সেভ হচ্ছে...' : 'সব সেভ'}
          </Button>
        }
      />

      <div className="space-y-4">
        {items.map((item, idx) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="text-base font-mono">{item.key}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>Title</Label>
                <Input
                  value={item.title ?? ''}
                  onChange={(e) => update(idx, 'title', e.target.value)}
                />
              </div>
              <div>
                <Label>Content</Label>
                <Textarea
                  value={item.content}
                  onChange={(e) => update(idx, 'content', e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
