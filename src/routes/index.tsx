import { Navigate, Route, Routes } from 'react-router-dom';

// ============================================================
// LAYOUTS
// ============================================================
import { AdminLayout } from '@/components/layout/admin-layout';
import { AuthLayout } from '@/components/layout/auth-layout';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ModeratorLayout } from '@/components/layout/moderator-layout';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { PublicLayout } from '@/components/layout/public-layout';

// ============================================================
// PUBLIC PAGES
// ============================================================
import { AboutPage } from '@/pages/public/about-page';
import { ContactPage } from '@/pages/public/contact-page';
import { HomePage } from '@/pages/public/home-page';
import { MapPage } from '@/pages/public/map-page';
import { NewsDetailPage } from '@/pages/public/news-detail-page';
import { NewsPage } from '@/pages/public/news-page';
import { ReportDetailPage } from '@/pages/public/report-detail-page';
import { ReportsPage } from '@/pages/public/reports-page';

// ============================================================
// AUTH PAGES
// ============================================================
import { ForgotPasswordPage } from '@/pages/auth/forgot-password-page';
import { LoginPage } from '@/pages/auth/login-page';
import { RegisterPage } from '@/pages/auth/register-page';
import { ResetPasswordPage } from '@/pages/auth/reset-password-page';
import { VerifyEmailPage } from '@/pages/auth/verify-email-page';

// ============================================================
// ADMIN PAGES
// ============================================================
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

// ============================================================
// MODERATOR PAGES
// ============================================================
import { ModeratorDashboardPage } from '@/pages/moderator/moderator-dashboard-page';
import { ModeratorReportDetailPage } from '@/pages/moderator/moderator-report-detail-page';
import { ModeratorReportsPage } from '@/pages/moderator/moderator-reports-page';
import { ModeratorSupportPage } from '@/pages/moderator/moderator-support-page';
import { ModeratorUsersPage } from '@/pages/moderator/moderator-users-page';

// ============================================================
// USER PAGES
// ============================================================
import { ChatDetailPage } from '@/pages/dashboard/chat-detail-page';
import { ChatPage } from '@/pages/dashboard/chat-page';
import { CreateReportPage } from '@/pages/dashboard/create-report-page';
import { DashboardPage } from '@/pages/dashboard/dashboard-page';
import { ModeratorApplicationPage } from '@/pages/dashboard/moderator-application-page';
import { MyReportsPage } from '@/pages/dashboard/my-reports-page';
import { NotificationsPage } from '@/pages/dashboard/notifications-page';
import { ProfilePage } from '@/pages/dashboard/profile-page';
import { ReportDetailPage as UserReportDetailPage } from '@/pages/dashboard/report-detail-page';
import { SupportDetailPage } from '@/pages/dashboard/support-detail-page';
import { SupportPage } from '@/pages/dashboard/support-page';

// ============================================================
// OTHER
// ============================================================
import { NotFoundPage } from '@/pages/not-found-page';

// ============================================================
// MAIN ROUTES
// ============================================================

export function AppRoutes() {
  return (
    <Routes>
      {/* ============================================ */}
      {/* 1. PUBLIC ROUTES (Header + Footer) */}
      {/* ============================================ */}
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="reports/:id" element={<ReportDetailPage />} />
        <Route path="news" element={<NewsPage />} />
        <Route path="news/:slug" element={<NewsDetailPage />} />
        <Route path="map" element={<MapPage />} />
      </Route>

      {/* ============================================ */}
      {/* 2. AUTH ROUTES (Centered card) */}
      {/* ============================================ */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* ============================================ */}
      {/* 3. ADMIN ROUTES (ADMIN only) */}
      {/* ============================================ */}
      <Route
        path="admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
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

      {/* ============================================ */}
      {/* 4. MODERATOR ROUTES (MODERATOR + ADMIN) */}
      {/* ============================================ */}
      <Route
        path="moderator"
        element={
          <ProtectedRoute allowedRoles={['MODERATOR', 'ADMIN']}>
            <ModeratorLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ModeratorDashboardPage />} />
        <Route path="reports" element={<ModeratorReportsPage />} />
        <Route path="reports/:id" element={<ModeratorReportDetailPage />} />
        <Route path="users" element={<ModeratorUsersPage />} />
        <Route path="support" element={<ModeratorSupportPage />} />
      </Route>

      {/* ============================================ */}
      {/* 5. USER DASHBOARD (any logged-in user) */}
      {/* ============================================ */}
      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<DashboardPage />} />
        <Route path="my-reports" element={<MyReportsPage />} />
        <Route path="my-reports/create" element={<CreateReportPage />} />
        <Route path="my-reports/:id" element={<UserReportDetailPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="chat/:id" element={<ChatDetailPage />} />
        <Route path="support" element={<SupportPage />} />
        <Route path="support/:id" element={<SupportDetailPage />} />
        <Route path="moderator-application" element={<ModeratorApplicationPage />} />
      </Route>

      {/* ============================================ */}
      {/* 6. NOT FOUND */}
      {/* ============================================ */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
