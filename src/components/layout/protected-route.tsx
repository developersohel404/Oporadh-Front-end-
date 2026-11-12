import { useAuthStore } from '@/stores/auth-store';
import { Navigate, useLocation } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
  allowedRoles?: Array<'USER' | 'MODERATOR' | 'ADMIN'>;
}

export function ProtectedRoute({ children, allowedRoles }: Props) {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'MODERATOR') return <Navigate to="/moderator/dashboard" replace />;
    return <Navigate to="/dashboard/home" replace />;
  }

  return <>{children}</>;
}
