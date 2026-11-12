import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatRelative } from '@/lib/format';
import { useAuthStore } from '@/stores/auth-store';
import type { Comment } from '@/types/comment';
import { Trash2 } from 'lucide-react';

interface CommentItemProps {
  comment: Comment;
  onDelete?: (id: string) => void;
}

export function CommentItem({ comment, onDelete }: CommentItemProps) {
  const user = useAuthStore((s) => s.user);
  const isOwner = user?.id === comment.user?.id;
  const canModerate = user?.role === 'MODERATOR' || user?.role === 'ADMIN';
  const canDelete = isOwner || canModerate;

  const initial = comment.user?.profile?.name?.charAt(0)?.toUpperCase() ?? '?';

  return (
    <div className="flex gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
      <Avatar className="h-9 w-9 shrink-0">
        {comment.user?.profile?.avatarUrl && <AvatarImage src={comment.user.profile.avatarUrl} />}
        <AvatarFallback>{initial}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-medium text-sm text-slate-900 truncate">
              {comment.user?.profile?.nickname ?? comment.user?.profile?.name ?? 'Unknown'}
            </span>
            <span className="text-xs text-slate-400 shrink-0">
              {formatRelative(comment.createdAt)}
            </span>
          </div>

          {canDelete && onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={() => onDelete(comment.id)}
            >
              <Trash2 className="h-3.5 w-3.5 text-slate-400" />
            </Button>
          )}
        </div>

        <p className="text-sm text-slate-700 mt-1 whitespace-pre-wrap break-words">
          {comment.content}
        </p>
      </div>
    </div>
  );
}
