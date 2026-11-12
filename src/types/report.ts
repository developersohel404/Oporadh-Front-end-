export type ReportStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'NEED_MORE_INFO'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'HIDDEN'
  | 'DELETED'
  | 'CLOSED';

export type ReportPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export interface CrimeCategory {
  id: string;
  code: string;
  name: string;
  nameBn: string;
  description?: string | null;
  isActive?: boolean;
}

export interface ReportMedia {
  id: string;
  processedUrl: string;
  originalUrl?: string;
  mediaType: 'IMAGE' | 'VIDEO';
  mimeType: string;
  fileSize: number;
  uploadedAt?: string;
}

export interface CrimeReport {
  id: string;
  title: string;
  description: string;
  status: ReportStatus;
  priority: ReportPriority;
  reporterId: string;
  categoryId: string;
  category?: CrimeCategory;
  incidentAddress?: string | null;
  incidentDate: string;
  incidentTime?: string | null;
  suspectName?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  divisionId?: string;
  districtId?: string;
  upazilaId?: string;
  division?: { id: string; name: string; nameBn: string | null };
  district?: { id: string; name: string; nameBn: string | null };
  upazila?: { id: string; name: string; nameBn: string | null };
  media?: ReportMedia[];
  createdAt: string;
  updatedAt: string;
  _count?: {
    media?: number;
    comments?: number;
    reviews?: number;
  };
}
