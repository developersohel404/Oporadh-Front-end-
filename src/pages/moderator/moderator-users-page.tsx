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
import { USER_STATUS_LABELS } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import { AlertTriangle, Ban, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function ModeratorUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState<{ type: 'warn' | 'restrict'; user: any } | null>(null);
  const [message, setMessage] = useState('');
  const [restrictType, setRestrictType] = useState('COMMENT_RESTRICTED');
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get('/moderator/users?limit=100')
      .then((r) => setUsers(r.data?.data?.users ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    if (!action || !message.trim()) {
      toast.error('বার্তা লিখুন');
      return;
    }
    setSubmitting(true);
    try {
      const { type, user } = action;
      if (type === 'warn') await api.post(`/moderator/users/${user.id}/warn`, { message });
      else
        await api.post(`/moderator/users/${user.id}/restrict`, {
          type: restrictType,
          reason: message,
        });
      toast.success('সফল');
      setAction(null);
      setMessage('');
      load();
    } catch (e) {
      toast.error(getApiError(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader title="ব্যবহারকারী" description="নিজের এলাকার ব্যবহারকারী" />

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : users.length === 0 ? (
        <EmptyState icon={Users} title="কোনো ব্যবহারকারী নেই" />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>নাম</TableHead>
                  <TableHead>ইমেইল</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>রিপোর্ট</TableHead>
                  <TableHead>যোগদান</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.profile?.name || '—'}</TableCell>
                    <TableCell className="text-sm">{u.email}</TableCell>
                    <TableCell>
                      <Badge variant={u.status === 'ACTIVE' ? 'success' : 'warning'}>
                        {USER_STATUS_LABELS[u.status] ?? u.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{u._count?.reports ?? 0}</TableCell>
                    <TableCell className="text-xs">{formatDate(u.createdAt)}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setAction({ type: 'warn', user: u })}
                      >
                        <AlertTriangle className="h-3 w-3 mr-1" /> Warn
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setAction({ type: 'restrict', user: u })}
                      >
                        <Ban className="h-3 w-3 mr-1" /> Restrict
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!action} onOpenChange={(o) => !o && setAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action?.type === 'warn' ? 'সতর্কবার্তা' : 'Restrict করুন'}:{' '}
              {action?.user?.profile?.name}
            </DialogTitle>
          </DialogHeader>
          {action?.type === 'restrict' && (
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
                </SelectContent>
              </Select>
            </div>
          )}
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="কারণ / বার্তা..."
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAction(null)}>
              বাতিল
            </Button>
            <Button onClick={submit} disabled={submitting}>
              {submitting ? '...' : 'নিশ্চিত'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
