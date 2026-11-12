import { formatDateTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Message } from '@/types/conversation';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <div className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[70%] rounded-lg p-3',
          isOwn ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'
        )}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
        {message.attachment && (
          <a
            href={message.attachment}
            target="_blank"
            rel="noreferrer"
            className={cn(
              'text-xs underline mt-1 block',
              isOwn ? 'text-slate-300' : 'text-blue-600'
            )}
          >
            Attachment
          </a>
        )}
        <p className={cn('text-xs mt-1', isOwn ? 'text-slate-300' : 'text-slate-500')}>
          {formatDateTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
