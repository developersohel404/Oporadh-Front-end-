import { EmptyState } from '@/components/common/empty-state';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { PageHeader } from '@/components/common/page-header';
import { Pagination } from '@/components/common/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Textarea } from '@/components/ui/textarea';
import { api, getApiError } from '@/lib/api';
import { USER_ROLE_LABELS, USER_STATUS_LABELS } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import { RotateCcw, Search, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface UserRow {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  profile?: { name: string; nickname?: string | null };
  upazila?: { nameBn: string | null; name: string };
  _count?: { reports: number };
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');

  const [actionDialog, setActionDialog] = useState<{
    type: 'suspend' | 'ban' | 'restrict' | 'restore';
    user: UserRow | null;
  }>({ type: 'suspend', user: null });
  const [reason, setReason] = useState('');
  const [restrictType, setRestrictType] = useState('COMMENT_RESTRICTED');
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (search) params.set('search', search);
    if (role !== 'all') params.set('role', role);
    if (status !== 'all') params.set('status', status);

    api
      .get(`/admin/users?${params}`)
      .then((r) => {
        setUsers(r.data?.data?.users ?? []);
        setTotalPages(r.data?.data?.meta?.totalPages ?? 1);
      })
      .catch((e) => toast.error(getApiError(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [page, role, status]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  const handleAction = async () => {
    if (!actionDialog.user) return;
    if (!reason.trim() && actionDialog.type !== 'restore') {
      toast.error('কারণ দিন');
      return;
    }
    setSubmitting(true);
    try {
      const { type, user } = actionDialog;
      if (type === 'suspend') await api.post(`/admin/users/${user.id}/suspend`, { reason });
      else if (type === 'ban') await api.post(`/admin/users/${user.id}/ban`, { reason });
      else if (type === 'restrict')
        await api.post(`/admin/users/${user.id}/restrict`, { type: restrictType, reason });
      else if (type === 'restore') await api.post(`/admin/users/${user.id}/restore`);

      toast.success('সফল');
      setActionDialog({ type: 'suspend', user: null });
      setReason('');
      load();
    } catch (e) {
      toast.error(getApiError(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="ব্যবহারকারী ব্যবস্থাপনা"
        description="সব ব্যবহারকারী দেখুন এবং manage করুন"
      />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="নাম বা ইমেইল খুঁজুন..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">সব role</SelectItem>
                <SelectItem value="USER">ব্যবহারকারী</SelectItem>
                <SelectItem value="MODERATOR">মডারেটর</SelectItem>
                <SelectItem value="ADMIN">অ্যাডমিন</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">সব status</SelectItem>
                <SelectItem value="ACTIVE">সক্রিয়</SelectItem>
                <SelectItem value="SUSPENDED">সাসপেন্ড</SelectItem>
                <SelectItem value="BANNED">নিষিদ্ধ</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" /> খুঁজুন
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : users.length === 0 ? (
        <EmptyState icon={Shield} title="কোনো ব্যবহারকারী নেই" />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>নাম</TableHead>
                  <TableHead>ইমেইল</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>এলাকা</TableHead>
                  <TableHead>রিপোর্ট</TableHead>
                  <TableHead>যোগদান</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.profile?.name || '—'}</TableCell>
                    <TableCell className="text-sm text-slate-600">{u.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{USER_ROLE_LABELS[u.role] ?? u.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          u.status === 'ACTIVE'
                            ? 'success'
                            : u.status === 'SUSPENDED'
                              ? 'warning'
                              : 'destructive'
                        }
                      >
                        {USER_STATUS_LABELS[u.status] ?? u.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {u.upazila?.nameBn ?? u.upazila?.name ?? '—'}
                    </TableCell>
                    <TableCell>{u._count?.reports ?? 0}</TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {formatDate(u.createdAt)}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      {u.status === 'ACTIVE' ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setActionDialog({ type: 'restrict', user: u })}
                          >
                            Restrict
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setActionDialog({ type: 'suspend', user: u })}
                          >
                            Suspend
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setActionDialog({ type: 'ban', user: u })}
                          >
                            Ban
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setActionDialog({ type: 'restore', user: u })}
                        >
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

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <Dialog
        open={!!actionDialog.user}
        onOpenChange={(o) => !o && setActionDialog({ type: 'suspend', user: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.type === 'suspend' && 'User Suspend করুন'}
              {actionDialog.type === 'ban' && 'User Ban করুন'}
              {actionDialog.type === 'restrict' && 'User Restrict করুন'}
              {actionDialog.type === 'restore' && 'User Restore করুন'}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.user?.profile?.name || actionDialog.user?.email}
            </DialogDescription>
          </DialogHeader>

          {actionDialog.type === 'restrict' && (
            <div className="space-y-2">
              <Label>Restriction Type</Label>
              <Select value={restrictType} onValueChange={setRestrictType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COMMENT_RESTRICTED">Comment Restrict</SelectItem>
                  <SelectItem value="REPORT_RESTRICTED">Report Restrict</SelectItem>
                  <SelectItem value="MESSAGE_RESTRICTED">Message Restrict</SelectItem>
                  <SelectItem value="TEMPORARY_SUSPENSION">Temporary Suspension</SelectItem>
                  <SelectItem value="PERMANENT_SUSPENSION">Permanent Suspension</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {actionDialog.type !== 'restore' && (
            <div className="space-y-2">
              <Label>কারণ</Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="কারণ লিখুন..."
                rows={3}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionDialog({ type: 'suspend', user: null })}
            >
              বাতিল
            </Button>
            <Button onClick={handleAction} disabled={submitting}>
              {submitting ? 'প্রক্রিয়া চলছে...' : 'নিশ্চিত করুন'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
