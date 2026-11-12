import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  try {
    return format(new Date(date), 'dd MMM yyyy');
  } catch {
    return '';
  }
};

export const formatDateTime = (date: string | Date): string => {
  try {
    return format(new Date(date), 'dd MMM yyyy, hh:mm a');
  } catch {
    return '';
  }
};

export const formatRelative = (date: string | Date): string => {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return '';
  }
};

export const getBengaliName = (
  item: { name: string; nameBn?: string | null } | null | undefined
): string => {
  if (!item) return '';
  return item.nameBn ?? item.name;
};

export const truncate = (text: string, length: number = 100): string => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};
