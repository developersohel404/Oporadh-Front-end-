import { EmptyState } from '@/components/common/empty-state';
import type { CrimeReport } from '@/types/report';
import { FileText } from 'lucide-react';
import { ReportCard } from './report-card';

interface Props {
  reports: CrimeReport[];
  getHref?: (r: CrimeReport) => string;
  showReporter?: boolean;
  emptyMessage?: string;
}

export function ReportList({ reports, getHref, showReporter, emptyMessage }: Props) {
  if (reports.length === 0) {
    return <EmptyState icon={FileText} title={emptyMessage ?? 'কোনো রিপোর্ট নেই'} />;
  }
  return (
    <div className="space-y-3">
      {reports.map((r) => (
        <ReportCard key={r.id} report={r} href={getHref?.(r)} showReporter={showReporter} />
      ))}
    </div>
  );
}
