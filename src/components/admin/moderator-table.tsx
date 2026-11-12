import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/format';

interface ModRow {
  id: string;
  level: string;
  status: string;
  user: { email: string; profile?: { name: string } };
  upazila?: { nameBn: string | null; name: string };
  district?: { nameBn: string | null; name: string };
  division?: { nameBn: string | null; name: string };
  createdAt: string;
}

interface Props {
  moderators: ModRow[];
  actions?: (m: ModRow) => React.ReactNode;
}

export function ModeratorTable({ moderators, actions }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>নাম</TableHead>
          <TableHead>ইমেইল</TableHead>
          <TableHead>Level</TableHead>
          <TableHead>এলাকা</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>যোগদান</TableHead>
          {actions && <TableHead className="text-right">Action</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {moderators.map((m) => (
          <TableRow key={m.id}>
            <TableCell className="font-medium">{m.user?.profile?.name || '—'}</TableCell>
            <TableCell className="text-sm">{m.user?.email}</TableCell>
            <TableCell>
              <Badge variant="secondary">{m.level}</Badge>
            </TableCell>
            <TableCell className="text-sm">
              {m.upazila?.nameBn ?? m.district?.nameBn ?? m.division?.nameBn ?? '—'}
            </TableCell>
            <TableCell>
              <Badge variant={m.status === 'ACTIVE' ? 'success' : 'warning'}>{m.status}</Badge>
            </TableCell>
            <TableCell className="text-xs">{formatDate(m.createdAt)}</TableCell>
            {actions && <TableCell className="text-right">{actions(m)}</TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
