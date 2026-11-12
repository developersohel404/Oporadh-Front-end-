export type ConversationStatus = 'ACTIVE' | 'CLOSED' | 'ARCHIVED';

export interface ConversationUser {
  id: string;
  email?: string;
  profile?: {
    name: string;
    nickname?: string | null;
    avatarUrl?: string | null;
  };
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  message: string;
  attachment?: string | null;
  isRead: boolean;
  createdAt: string;
  sender?: ConversationUser & { role?: string };
}

export interface Conversation {
  id: string;
  userId: string;
  moderatorId: string;
  reportId?: string | null;
  status: ConversationStatus;
  createdAt: string;
  updatedAt: string;
  user?: ConversationUser;
  moderator?: ConversationUser;
  report?: {
    id: string;
    title: string;
    status: string;
  };
  lastMessage?: Message | null;
  unreadCount?: number;
}
