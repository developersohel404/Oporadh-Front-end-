import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PRIORITY_LABELS, REPORT_STATUS_COLORS, REPORT_STATUS_LABELS } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import type { CrimeReport } from '@/types/report';
import { Link } from 'react-router-dom';

interface Props {
  report: CrimeReport;
  href?: string;
  showReporter?: boolean;
}

export function ReportCard({ report, href, showReporter }: Props) {
  const content = (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 truncate">{report.title}</h3>
            <p className="text-sm text-slate-600 mt-1 line-clamp-2">{report.description}</p>
            <div className="flex flex-wrap gap-2 mt-2 text-xs text-slate-500">
              <span>{report.category?.nameBn ?? report.category?.name}</span>
              <span>•</span>
              <span>{report.upazila?.nameBn ?? report.upazila?.name}</span>
              <span>•</span>
              <span>{formatDate(report.createdAt)}</span>
              {showReporter && report.reporter?.profile?.name && (
                <>
                  <span>•</span>
                  <span>{report.reporter.profile.name}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <Badge className={REPORT_STATUS_COLORS[report.status]}>
              {REPORT_STATUS_LABELS[report.status]}
            </Badge>
            <Badge variant="outline">{PRIORITY_LABELS[report.priority]}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
  return href ? <Link to={href}>{content}</Link> : content;
}
