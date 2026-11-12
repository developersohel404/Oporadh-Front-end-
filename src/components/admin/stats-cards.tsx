import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCard {
  label: string;
  value: number;
  icon: LucideIcon;
  iconColor?: string;
  subtitle?: string;
}

interface Props {
  cards: StatCard[];
  columns?: 2 | 3 | 4;
}

export function StatsCards({ cards, columns = 4 }: Props) {
  const cols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };
  return (
    <div className={cn('grid grid-cols-1 gap-4', cols[columns])}>
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{c.label}</CardTitle>
              <Icon className={cn('h-4 w-4', c.iconColor ?? 'text-slate-500')} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{c.value.toLocaleString()}</div>
              {c.subtitle && <p className="text-xs text-slate-500 mt-1">{c.subtitle}</p>}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
