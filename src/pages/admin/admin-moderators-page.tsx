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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { api, getApiError } from '@/lib/api';
import { formatDate, getBengaliName } from '@/lib/format';
import { MapPin, Plus, RotateCcw, Shield, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Location {
  id: string;
  name: string;
  nameBn: string | null;
}

interface ModRow {
  id: string;
  level: string;
  status: string;
  user: { id: string; email: string; profile?: { name: string } };
  division?: { nameBn: string | null; name: string };
  district?: { nameBn: string | null; name: string };
  upazila?: { nameBn: string | null; name: string };
  createdAt: string;
}

export function AdminModeratorsPage() {
  const [mods, setMods] = useState<ModRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [level, setLevel] = useState<'UPAZILA' | 'DISTRICT' | 'DIVISION'>('UPAZILA');
  const [divisions, setDivisions] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [upazilas, setUpazilas] = useState<Location[]>([]);
  const [divisionId, setDivisionId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [upazilaId, setUpazilaId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get('/admin/moderators?limit=100')
      .then((r) => setMods(r.data?.data?.moderators ?? []))
      .catch((e) => toast.error(getApiError(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    api.get('/locations/divisions').then((r) => setDivisions(r.data?.data ?? []));
  }, []);

  const onDivisionChange = async (id: string) => {
    setDivisionId(id);
    setDistricts([]);
    setUpazilas([]);
    const r = await api.get(`/locations/divisions/${id}/districts`);
    setDistricts(r.data?.data?.districts ?? []);
  };

  const onDistrictChange = async (id: string) => {
    setDistrictId(id);
    setUpazilas([]);
    const r = await api.get(`/locations/districts/${id}/upazilas`);
    setUpazilas(r.data?.data?.upazilas ?? []);
  };

  const handleCreate = async () => {
    if (!email || !divisionId) {
      toast.error('ইমেইল এবং বিভাগ দিন');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/admin/moderators', {
        email,
        level,
        divisionId,
        ...(level !== 'DIVISION' && districtId ? { districtId } : {}),
        ...(level === 'UPAZILA' && upazilaId ? { upazilaId } : {}),
      });
      toast.success('Moderator তৈরি সফল');
      setCreateOpen(false);
      setEmail('');
      setDivisionId('');
      setDistrictId('');
      setUpazilaId('');
      load();
    } catch (e) {
      toast.error(getApiError(e));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuspend = async (m: ModRow) => {
    const reason = prompt('Suspension reason:');
    if (!reason) return;
    try {
      await api.post(`/admin/moderators/${m.id}/suspend`, { reason });
      toast.success('Suspend সফল');
      load();
    } catch (e) {
      toast.error(getApiError(e));
    }
  };

  const handleRestore = async (m: ModRow) => {
    try {
      await api.post(`/admin/moderators/${m.id}/restore`);
      toast.success('Restore সফল');
      load();
    } catch (e) {
      toast.error(getApiError(e));
    }
  };

  const handleRemove = async (m: ModRow) => {
    const reason = prompt('Removal reason:');
    if (!reason) return;
    try {
      await api.post(`/admin/moderators/${m.id}/remove`, { reason });
      toast.success('Remove সফল');
      load();
    } catch (e) {
      toast.error(getApiError(e));
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="মডারেটর ব্যবস্থাপনা"
        description="সব moderator দেখুন এবং manage করুন"
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> নতুন Moderator
          </Button>
        }
      />

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : mods.length === 0 ? (
        <EmptyState icon={Shield} title="কোনো moderator নেই" />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>নাম</TableHead>
                  <TableHead>ইমেইল</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>এলাকা</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>যোগদান</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mods.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.user?.profile?.name || '—'}</TableCell>
                    <TableCell className="text-sm">{m.user?.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{m.level}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      <MapPin className="h-3 w-3 inline mr-1" />
                      {m.upazila?.nameBn ?? m.district?.nameBn ?? m.division?.nameBn ?? '—'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          m.status === 'ACTIVE'
                            ? 'success'
                            : m.status === 'SUSPENDED'
                              ? 'warning'
                              : 'destructive'
                        }
                      >
                        {m.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{formatDate(m.createdAt)}</TableCell>
                    <TableCell className="text-right space-x-1">
                      {m.status === 'ACTIVE' ? (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleSuspend(m)}>
                            Suspend
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleRemove(m)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleRestore(m)}>
                          <RotateCcw className="h-3 w-3 mr-1" /> Restore
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>নতুন Moderator তৈরি করুন</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>User Email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
              />
            </div>
            <div>
              <Label>Level</Label>
              <Select value={level} onValueChange={(v) => setLevel(v as any)}>
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
              <Label>বিভাগ</Label>
              <Select value={divisionId} onValueChange={onDivisionChange}>
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
            {level !== 'DIVISION' && (
              <div>
                <Label>জেলা</Label>
                <Select value={districtId} onValueChange={onDistrictChange}>
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
            {level === 'UPAZILA' && (
              <div>
                <Label>উপজেলা</Label>
                <Select value={upazilaId} onValueChange={setUpazilaId}>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              বাতিল
            </Button>
            <Button onClick={handleCreate} disabled={submitting}>
              {submitting ? 'তৈরি হচ্ছে...' : 'তৈরি করুন'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
