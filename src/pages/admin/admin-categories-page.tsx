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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { api, getApiError } from '@/lib/api';
import { Plus, Tag, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Cat {
  id: string;
  code: string;
  name: string;
  nameBn: string;
  description?: string | null;
  isActive: boolean;
}

export function AdminCategoriesPage() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Cat | null>(null);
  const [form, setForm] = useState({ code: '', name: '', nameBn: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get('/crime-categories')
      .then((r) => setCats(r.data?.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ code: '', name: '', nameBn: '', description: '' });
    setOpen(true);
  };
  const openEdit = (c: Cat) => {
    setEditing(c);
    setForm({ code: c.code, name: c.name, nameBn: c.nameBn, description: c.description ?? '' });
    setOpen(true);
  };

  const submit = async () => {
    if (!form.code || !form.name || !form.nameBn) {
      toast.error('সব field দিন');
      return;
    }
    setSubmitting(true);
    try {
      if (editing) {
        await api.patch(`/admin/crime-categories/${editing.id}`, {
          name: form.name,
          nameBn: form.nameBn,
          description: form.description,
        });
      } else {
        await api.post('/admin/crime-categories', form);
      }
      toast.success('সফল');
      setOpen(false);
      load();
    } catch (e) {
      toast.error(getApiError(e));
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('মুছে ফেলতে চান?')) return;
    try {
      await api.delete(`/admin/crime-categories/${id}`);
      toast.success('মুছে ফেলা হয়েছে');
      load();
    } catch (e) {
      toast.error(getApiError(e));
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Crime Categories"
        description="অপরাধ ক্যাটাগরি manage করুন"
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" /> নতুন
          </Button>
        }
      />

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : cats.length === 0 ? (
        <EmptyState icon={Tag} title="কোনো ক্যাটাগরি নেই" />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name (EN)</TableHead>
                  <TableHead>Name (BN)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cats.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-xs">{c.code}</TableCell>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.nameBn}</TableCell>
                    <TableCell>
                      <Badge variant={c.isActive ? 'success' : 'secondary'}>
                        {c.isActive ? 'Active' : 'Disabled'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button size="sm" variant="outline" onClick={() => openEdit(c)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => remove(c.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Category Edit' : 'নতুন Category'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {!editing && (
              <div>
                <Label>Code *</Label>
                <Input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="CHURI"
                />
              </div>
            )}
            <div>
              <Label>Name (English) *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Name (বাংলা) *</Label>
              <Input
                value={form.nameBn}
                onChange={(e) => setForm({ ...form, nameBn: e.target.value })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              বাতিল
            </Button>
            <Button onClick={submit} disabled={submitting}>
              {submitting ? '...' : editing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
