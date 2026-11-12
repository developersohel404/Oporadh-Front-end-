import { AdminLayout } from '@/components/layout/admin-layout';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { AdminAboutPage } from '@/pages/admin/admin-about-page';
import { AdminApplicationsPage } from '@/pages/admin/admin-applications-page';
import { AdminAuditLogsPage } from '@/pages/admin/admin-audit-logs-page';
import { AdminCategoriesPage } from '@/pages/admin/admin-categories-page';
import { AdminContactMessagesPage } from '@/pages/admin/admin-contact-messages-page';
import { AdminDashboardPage } from '@/pages/admin/admin-dashboard-page';
import { AdminModeratorsPage } from '@/pages/admin/admin-moderators-page';
import { AdminNewsPage } from '@/pages/admin/admin-news-page';
import { AdminReportsPage } from '@/pages/admin/admin-reports-page';
import { AdminSupportPage } from '@/pages/admin/admin-support-page';
import { AdminUsersPage } from '@/pages/admin/admin-users-page';
import { Navigate, Route, Routes } from 'react-router-dom';

export function AdminRoutes() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="moderators" element={<AdminModeratorsPage />} />
          <Route path="applications" element={<AdminApplicationsPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="news" element={<AdminNewsPage />} />
          <Route path="support" element={<AdminSupportPage />} />
          <Route path="audit-logs" element={<AdminAuditLogsPage />} />
          <Route path="about" element={<AdminAboutPage />} />
          <Route path="contact-messages" element={<AdminContactMessagesPage />} />
        </Route>
      </Routes>
    </ProtectedRoute>
  );
}
