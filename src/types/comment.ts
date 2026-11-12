export type CommentStatus = 'VISIBLE' | 'HIDDEN' | 'DELETED';

export interface Comment {
  id: string;
  content: string;
  status: CommentStatus;
  createdAt: string;
  user?: {
    id: string;
    profile?: {
      name: string;
      nickname?: string | null;
      avatarUrl?: string | null;
    };
  };
}

export interface NewsComment extends Comment {
  newsId: string;
}

export interface ReportComment extends Comment {
  reportId: string;
}
