import { ModeratorLayout } from '@/components/layout/moderator-layout';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { ModeratorDashboardPage } from '@/pages/moderator/moderator-dashboard-page';
import { ModeratorReportDetailPage } from '@/pages/moderator/moderator-report-detail-page';
import { ModeratorReportsPage } from '@/pages/moderator/moderator-reports-page';
import { ModeratorSupportPage } from '@/pages/moderator/moderator-support-page';
import { ModeratorUsersPage } from '@/pages/moderator/moderator-users-page';
import { Navigate, Route, Routes } from 'react-router-dom';

export function ModeratorRoutes() {
  return (
    <ProtectedRoute allowedRoles={['MODERATOR', 'ADMIN']}>
      <Routes>
        <Route element={<ModeratorLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ModeratorDashboardPage />} />
          <Route path="reports" element={<ModeratorReportsPage />} />
          <Route path="reports/:id" element={<ModeratorReportDetailPage />} />
          <Route path="users" element={<ModeratorUsersPage />} />
          <Route path="support" element={<ModeratorSupportPage />} />
        </Route>
      </Routes>
    </ProtectedRoute>
  );
}
