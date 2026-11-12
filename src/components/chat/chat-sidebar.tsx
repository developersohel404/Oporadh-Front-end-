import { Badge } from '@/components/ui/badge';
import { formatRelative } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Conversation } from '@/types/conversation';
import { MessageCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

interface ChatSidebarProps {
  conversations: Conversation[];
  basePath?: string;
  currentUserId?: string;
}

export function ChatSidebar({
  conversations,
  basePath = '/dashboard/chat',
  currentUserId,
}: ChatSidebarProps) {
  const { id } = useParams();

  if (conversations.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <MessageCircle className="h-8 w-8 mx-auto mb-2 text-slate-300" />
        <p className="text-sm">কোনো chat নেই</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {conversations.map((c) => {
        const other = c.userId === currentUserId ? c.moderator : c.user;
        const active = id === c.id;
        return (
          <Link
            key={c.id}
            to={`${basePath}/${c.id}`}
            className={cn(
              'block p-3 rounded-md transition-colors',
              active ? 'bg-slate-100' : 'hover:bg-slate-50'
            )}
          >
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{other?.profile?.name || 'Unknown'}</p>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {c.lastMessage?.message || 'No messages yet'}
                </p>
                <p className="text-xs text-slate-400 mt-1">{formatRelative(c.updatedAt)}</p>
              </div>
              {(c.unreadCount ?? 0) > 0 && (
                <Badge variant="destructive" className="shrink-0">
                  {c.unreadCount}
                </Badge>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
