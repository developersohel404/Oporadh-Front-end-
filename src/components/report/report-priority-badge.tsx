import { Badge } from '@/components/ui/badge';
import { PRIORITY_LABELS } from '@/lib/constants';

export function ReportPriorityBadge({ priority }: { priority: string }) {
  const variants: Record<string, 'secondary' | 'default' | 'warning' | 'destructive'> = {
    LOW: 'secondary',
    NORMAL: 'default',
    HIGH: 'warning',
    URGENT: 'destructive',
  };
  return (
    <Badge variant={variants[priority] ?? 'secondary'}>
      {PRIORITY_LABELS[priority] ?? priority}
    </Badge>
  );
}
