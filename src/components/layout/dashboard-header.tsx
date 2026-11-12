import { NotificationBell } from '@/components/notification/notification-bell';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-6 bg-white border-b sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <span className="font-semibold text-slate-900 lg:hidden">OPORADH</span>
      </div>
      <div className="flex items-center gap-2">
        <NotificationBell />
      </div>
    </header>
  );
}
