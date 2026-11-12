import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { ChatDetailPage } from '@/pages/dashboard/chat-detail-page';
import { ChatPage } from '@/pages/dashboard/chat-page';
import { CreateReportPage } from '@/pages/dashboard/create-report-page';
import { DashboardPage } from '@/pages/dashboard/dashboard-page';
import { ModeratorApplicationPage } from '@/pages/dashboard/moderator-application-page';
import { MyReportsPage } from '@/pages/dashboard/my-reports-page';
import { NotificationsPage } from '@/pages/dashboard/notifications-page';
import { ProfilePage } from '@/pages/dashboard/profile-page';
import { ReportDetailPage } from '@/pages/dashboard/report-detail-page';
import { SupportDetailPage } from '@/pages/dashboard/support-detail-page';
import { SupportPage } from '@/pages/dashboard/support-page';
import { Navigate, Route, Routes } from 'react-router-dom';

export function DashboardRoutes() {
  return (
    <ProtectedRoute>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<DashboardPage />} />
          <Route path="my-reports" element={<MyReportsPage />} />
          <Route path="my-reports/create" element={<CreateReportPage />} />
          <Route path="my-reports/:id" element={<ReportDetailPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="chat/:id" element={<ChatDetailPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="support/:id" element={<SupportDetailPage />} />
          <Route path="moderator-application" element={<ModeratorApplicationPage />} />
        </Route>
      </Routes>
    </ProtectedRoute>
  );
}
