export const APP_NAME = 'OPORADH';

export const REPORT_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'খসড়া',
  SUBMITTED: 'জমা হয়েছে',
  UNDER_REVIEW: 'রিভিউ চলছে',
  NEED_MORE_INFO: 'আরও তথ্য দরকার',
  APPROVED: 'অনুমোদিত',
  PUBLISHED: 'প্রকাশিত',
  REJECTED: 'প্রত্যাখ্যাত',
  HIDDEN: 'লুকানো',
  DELETED: 'মুছে ফেলা',
  CLOSED: 'বন্ধ',
};

export const REPORT_STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-slate-100 text-slate-700',
  SUBMITTED: 'bg-blue-100 text-blue-700',
  UNDER_REVIEW: 'bg-amber-100 text-amber-700',
  NEED_MORE_INFO: 'bg-orange-100 text-orange-700',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  PUBLISHED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  HIDDEN: 'bg-slate-200 text-slate-700',
  DELETED: 'bg-red-200 text-red-800',
  CLOSED: 'bg-slate-200 text-slate-700',
};

export const PRIORITY_LABELS: Record<string, string> = {
  LOW: 'কম',
  NORMAL: 'সাধারণ',
  HIGH: 'উচ্চ',
  URGENT: 'জরুরি',
};

export const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'bg-slate-100 text-slate-700',
  NORMAL: 'bg-blue-100 text-blue-700',
  HIGH: 'bg-orange-100 text-orange-700',
  URGENT: 'bg-red-100 text-red-700',
};

export const USER_ROLE_LABELS: Record<string, string> = {
  USER: 'ব্যবহারকারী',
  MODERATOR: 'মডারেটর',
  ADMIN: 'অ্যাডমিন',
};

export const USER_STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'সক্রিয়',
  PENDING_VERIFICATION: 'যাচাই বাকি',
  RESTRICTED: 'সীমাবদ্ধ',
  SUSPENDED: 'সাসপেন্ড',
  BANNED: 'নিষিদ্ধ',
};

export const SUPPORT_STATUS_LABELS: Record<string, string> = {
  OPEN: 'খোলা',
  IN_PROGRESS: 'চলমান',
  ESCALATED: 'এস্কেলেটেড',
  RESOLVED: 'সমাধান',
  CLOSED: 'বন্ধ',
};

export const SUPPORT_CATEGORY_LABELS: Record<string, string> = {
  ACCOUNT: 'অ্যাকাউন্ট',
  REPORT_ISSUE: 'রিপোর্ট সমস্যা',
  MODERATOR_ISSUE: 'মডারেটর সমস্যা',
  TECHNICAL: 'টেকনিক্যাল',
  OTHER: 'অন্যান্য',
};

export const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  REPORT_SUBMITTED: 'রিপোর্ট জমা',
  REPORT_APPROVED: 'রিপোর্ট অনুমোদিত',
  REPORT_REJECTED: 'রিপোর্ট প্রত্যাখ্যাত',
  REPORT_NEED_MORE_INFO: 'আরও তথ্য দরকার',
  REPORT_PUBLISHED: 'রিপোর্ট প্রকাশিত',
  REPORT_HIDDEN: 'রিপোর্ট লুকানো',
  ACCOUNT_WARNING: 'সতর্কতা',
  ACCOUNT_RESTRICTED: 'সীমাবদ্ধ',
  ACCOUNT_SUSPENDED: 'সাসপেন্ড',
  ACCOUNT_RESTORED: 'পুনরুদ্ধার',
  NEW_MESSAGE: 'নতুন বার্তা',
  SUPPORT_REPLY: 'সাপোর্ট উত্তর',
  NEWS_PUBLISHED: 'নিউজ প্রকাশ',
  SYSTEM_NOTIFICATION: 'সিস্টেম',
};
