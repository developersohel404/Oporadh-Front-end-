export type SupportCategory =
  | 'ACCOUNT'
  | 'REPORT_ISSUE'
  | 'MODERATOR_ISSUE'
  | 'TECHNICAL'
  | 'OTHER';

export type SupportStatus = 'OPEN' | 'IN_PROGRESS' | 'ESCALATED' | 'RESOLVED' | 'CLOSED';

export interface SupportMessage {
  id: string;
  ticketId: string;
  senderId: string;
  message: string;
  attachment?: string | null;
  isInternal: boolean;
  createdAt: string;
  sender?: {
    id: string;
    role: string;
    profile?: { name: string; nickname?: string | null };
  };
}

export interface SupportTicket {
  id: string;
  userId: string;
  assignedToId?: string | null;
  subject: string;
  category: SupportCategory;
  message: string;
  attachment?: string | null;
  status: SupportStatus;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email?: string;
    profile?: { name: string; nickname?: string | null };
  };
  messages?: SupportMessage[];
  _count?: { messages: number };
}
