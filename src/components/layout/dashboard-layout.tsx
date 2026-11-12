import { NotificationBell } from '@/components/notification/notification-bell';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from './dashboard-sidebar';

export function DashboardLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:block">
        <DashboardSidebar />
      </aside>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)}>
          <aside
            className="fixed inset-y-0 left-0 w-64 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-16 flex items-center justify-between px-4 border-b">
              <span className="font-bold">OPORADH</span>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="h-[calc(100vh-4rem)]">
              <DashboardSidebar onNavigate={() => setOpen(false)} />
            </div>
          </aside>
        </div>
      )}
      <div className="lg:pl-64">
        <header className="h-16 flex items-center justify-between px-4 lg:px-6 bg-white border-b sticky top-0 z-30">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <NotificationBell />
        </header>
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
