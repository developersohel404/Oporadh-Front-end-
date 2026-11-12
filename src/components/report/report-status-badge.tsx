import { Badge } from '@/components/ui/badge';
import { REPORT_STATUS_COLORS, REPORT_STATUS_LABELS } from '@/lib/constants';

export function ReportStatusBadge({ status }: { status: string }) {
  return (
    <Badge className={REPORT_STATUS_COLORS[status]}>{REPORT_STATUS_LABELS[status] ?? status}</Badge>
  );
}
