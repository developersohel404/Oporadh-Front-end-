import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDateTime } from '@/lib/format';

interface Log {
  id: string;
  action: string;
  targetType?: string;
  targetId?: string;
  createdAt: string;
  actor?: { email: string; role: string; profile?: { name: string } };
}

interface Props {
  logs: Log[];
}

export function AuditLogTable({ logs }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Action</TableHead>
          <TableHead>Actor</TableHead>
          <TableHead>Target</TableHead>
          <TableHead>সময়</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((l) => (
          <TableRow key={l.id}>
            <TableCell>
              <Badge variant="secondary">{l.action}</Badge>
            </TableCell>
            <TableCell className="text-sm">
              {l.actor?.profile?.name || l.actor?.email || '—'}
            </TableCell>
            <TableCell className="text-xs">
              {l.targetType}: {l.targetId?.slice(0, 8) ?? '—'}
            </TableCell>
            <TableCell className="text-xs">{formatDateTime(l.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
