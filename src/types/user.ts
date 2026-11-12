export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'PENDING_VERIFICATION' | 'RESTRICTED' | 'SUSPENDED' | 'BANNED';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  phone?: string | null;
  name?: string;
  nickname?: string;
  avatarUrl?: string | null;
  age?: number | null;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  nickname?: string | null;
  age?: number | null;
  avatarUrl?: string | null;
}

export interface UserWithProfile extends User {
  profile?: UserProfile;
  division?: { id: string; name: string; nameBn: string | null };
  district?: { id: string; name: string; nameBn: string | null };
  upazila?: { id: string; name: string; nameBn: string | null };
  _count?: {
    reports?: number;
    restrictions?: number;
  };
}
