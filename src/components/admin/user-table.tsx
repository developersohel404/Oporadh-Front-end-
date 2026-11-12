import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { USER_ROLE_LABELS, USER_STATUS_LABELS } from '@/lib/constants';
import { formatDate } from '@/lib/format';

interface UserRow {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  profile?: { name: string };
  _count?: { reports: number };
}

interface Props {
  users: UserRow[];
  actions?: (user: UserRow) => React.ReactNode;
}

export function UserTable({ users, actions }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>নাম</TableHead>
          <TableHead>ইমেইল</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>রিপোর্ট</TableHead>
          <TableHead>যোগদান</TableHead>
          {actions && <TableHead className="text-right">Action</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((u) => (
          <TableRow key={u.id}>
            <TableCell className="font-medium">{u.profile?.name || '—'}</TableCell>
            <TableCell className="text-sm">{u.email}</TableCell>
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
            <TableCell>{u._count?.reports ?? 0}</TableCell>
            <TableCell className="text-xs">{formatDate(u.createdAt)}</TableCell>
            {actions && <TableCell className="text-right">{actions(u)}</TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
