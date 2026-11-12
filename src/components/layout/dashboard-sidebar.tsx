import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import {
  Bell,
  FileText,
  Headphones,
  Home,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Plus,
  ShieldCheck,
  User,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const NAV = [
  { href: '/dashboard/home', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
  { href: '/dashboard/my-reports', label: 'আমার রিপোর্ট', icon: FileText },
  { href: '/dashboard/my-reports/create', label: 'নতুন রিপোর্ট', icon: Plus },
  { href: '/dashboard/notifications', label: 'নোটিফিকেশন', icon: Bell },
  { href: '/dashboard/chat', label: 'চ্যাট', icon: MessageCircle },
  { href: '/dashboard/support', label: 'সাপোর্ট', icon: Headphones },
  { href: '/dashboard/moderator-application', label: 'মডারেটর আবেদন', icon: ShieldCheck },
  { href: '/dashboard/profile', label: 'প্রোফাইল', icon: User },
];

export function DashboardSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  return (
    <div className="flex flex-col h-full bg-white border-r">
      <div className="h-16 flex items-center px-6 border-b shrink-0">
        <Link to="/dashboard/home" className="text-xl font-bold">
          OPORADH
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV.map((it) => {
          const Icon = it.icon;
          const active = location.pathname === it.href;
          return (
            <Link
              key={it.href}
              to={it.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium',
                active ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              )}
            >
              <Icon className="h-4 w-4" /> {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t space-y-2">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md"
        >
          <Home className="h-4 w-4" /> সাইটে যান
        </Link>
        <div className="px-3 py-2 rounded-md bg-slate-50">
          <p className="text-sm font-medium truncate">{user?.name || user?.email}</p>
          <p className="text-xs text-slate-500 capitalize">{user?.role?.toLowerCase()}</p>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          <LogOut className="h-4 w-4 mr-2" /> লগআউট
        </Button>
      </div>
    </div>
  );
}
