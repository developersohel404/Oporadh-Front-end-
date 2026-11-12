import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import {
  ClipboardList,
  FileText,
  Headphones,
  Home,
  Info,
  LayoutDashboard,
  LogOut,
  Mail,
  Newspaper,
  ScrollText,
  ShieldCheck,
  Tag,
  Users,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const NAV = [
  {
    title: 'Main',
    items: [{ href: '/admin/dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard }],
  },
  {
    title: 'Management',
    items: [
      { href: '/admin/users', label: 'ব্যবহারকারী', icon: Users },
      { href: '/admin/moderators', label: 'মডারেটর', icon: ShieldCheck },
      { href: '/admin/applications', label: 'আবেদন', icon: ClipboardList },
    ],
  },
  {
    title: 'Content',
    items: [
      { href: '/admin/reports', label: 'রিপোর্ট', icon: FileText },
      { href: '/admin/categories', label: 'ক্যাটাগরি', icon: Tag },
      { href: '/admin/news', label: 'নিউজ', icon: Newspaper },
    ],
  },
  {
    title: 'Support',
    items: [
      { href: '/admin/support', label: 'সাপোর্ট', icon: Headphones },
      { href: '/admin/contact-messages', label: 'যোগাযোগ', icon: Mail },
    ],
  },
  {
    title: 'System',
    items: [
      { href: '/admin/audit-logs', label: 'অডিট লগ', icon: ScrollText },
      { href: '/admin/about', label: 'About', icon: Info },
    ],
  },
];

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  return (
    <div className="flex flex-col h-full bg-white border-r">
      <div className="h-16 flex items-center px-6 border-b shrink-0">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6" />
          <div>
            <div className="text-base font-bold">OPORADH</div>
            <div className="text-xs text-slate-500">Admin</div>
          </div>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV.map((s) => (
          <div key={s.title}>
            <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase">
              {s.title}
            </div>
            <div className="space-y-1">
              {s.items.map((it) => {
                const Icon = it.icon;
                const active =
                  location.pathname === it.href || location.pathname.startsWith(it.href + '/');
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
                    <Icon className="h-4 w-4" />
                    <span>{it.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
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
          <p className="text-xs text-slate-500">Administrator</p>
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
