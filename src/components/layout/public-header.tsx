import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function PublicHeader() {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const dash =
    user?.role === 'ADMIN'
      ? '/admin/dashboard'
      : user?.role === 'MODERATOR'
        ? '/moderator/dashboard'
        : '/dashboard/home';

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          OPORADH
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm hover:text-slate-900 text-slate-600">
            হোম
          </Link>
          <Link to="/reports" className="text-sm hover:text-slate-900 text-slate-600">
            রিপোর্ট
          </Link>
          <Link to="/news" className="text-sm hover:text-slate-900 text-slate-600">
            নিউজ
          </Link>
          <Link to="/map" className="text-sm hover:text-slate-900 text-slate-600">
            ম্যাপ
          </Link>
          <Link to="/about" className="text-sm hover:text-slate-900 text-slate-600">
            সম্পর্কে
          </Link>
          <Link to="/contact" className="text-sm hover:text-slate-900 text-slate-600">
            যোগাযোগ
          </Link>
        </nav>
        <div className="hidden md:flex gap-2">
          {isAuthenticated ? (
            <Button size="sm" onClick={() => navigate(dash)}>
              ড্যাশবোর্ড
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                লগইন
              </Button>
              <Button size="sm" onClick={() => navigate('/register')}>
                রেজিস্টার
              </Button>
            </>
          )}
        </div>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      {open && (
        <div className="md:hidden border-t bg-white p-4 space-y-2">
          <Link to="/" className="block py-2 text-sm" onClick={() => setOpen(false)}>
            হোম
          </Link>
          <Link to="/reports" className="block py-2 text-sm" onClick={() => setOpen(false)}>
            রিপোর্ট
          </Link>
          <Link to="/news" className="block py-2 text-sm" onClick={() => setOpen(false)}>
            নিউজ
          </Link>
          <Link to="/map" className="block py-2 text-sm" onClick={() => setOpen(false)}>
            ম্যাপ
          </Link>
          <Link to="/about" className="block py-2 text-sm" onClick={() => setOpen(false)}>
            সম্পর্কে
          </Link>
          <Link to="/contact" className="block py-2 text-sm" onClick={() => setOpen(false)}>
            যোগাযোগ
          </Link>
        </div>
      )}
    </header>
  );
}
