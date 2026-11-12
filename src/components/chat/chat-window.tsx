import type { Message } from '@/types/conversation';
import { MessageCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { MessageBubble } from './message-bubble';

interface ChatWindowProps {
  messages: Message[];
  currentUserId?: string;
}

export function ChatWindow({ messages, currentUserId }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 mx-auto mb-2 text-slate-300" />
          <p>কোনো message নেই</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((m) => (
        <MessageBubble key={m.id} message={m} isOwn={m.senderId === currentUserId} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
