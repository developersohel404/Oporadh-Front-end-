export type NewsStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface News {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage?: string | null;
  category?: string | null;
  status: NewsStatus;
  publishedAt?: string | null;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  publishedBy?: {
    id: string;
    profile?: { name: string } | null;
  };
  division?: { name: string; nameBn: string | null };
  district?: { name: string; nameBn: string | null };
  _count?: { comments: number };
}
