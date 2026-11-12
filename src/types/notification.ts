export type NotificationType =
  | 'REPORT_SUBMITTED'
  | 'REPORT_APPROVED'
  | 'REPORT_REJECTED'
  | 'REPORT_NEED_MORE_INFO'
  | 'REPORT_PUBLISHED'
  | 'REPORT_HIDDEN'
  | 'ACCOUNT_WARNING'
  | 'ACCOUNT_RESTRICTED'
  | 'ACCOUNT_SUSPENDED'
  | 'ACCOUNT_RESTORED'
  | 'MODERATOR_APPLICATION_APPROVED'
  | 'MODERATOR_APPLICATION_REJECTED'
  | 'MODERATOR_SUSPENDED'
  | 'MODERATOR_REMOVED'
  | 'NEW_MESSAGE'
  | 'SUPPORT_REPLY'
  | 'NEWS_PUBLISHED'
  | 'SYSTEM_NOTIFICATION';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown> | null;
  isRead: boolean;
  createdAt: string;
}
