import { MessageBubble } from '@/components/chat/message-bubble';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useChatSocket } from '@/hooks/use-chat-socket';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import type { Message } from '@/types/conversation';
import { ArrowLeft, Send, Wifi, WifiOff } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

// ============================================================
// Main Page
// ============================================================

export function ChatDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // ============================================================
  // Load initial data
  // ============================================================
  useEffect(() => {
    if (!id) return;

    Promise.all([
      api.get(`/conversations/${id}`).catch(() => ({ data: { data: null } })),
      api
        .get(`/conversations/${id}/messages?limit=100`)
        .catch(() => ({ data: { data: { messages: [] } } })),
    ])
      .then(([c, m]) => {
        setConversation(c.data?.data);
        setMessages(m.data?.data?.messages ?? []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // ============================================================
  // Socket handler — new message
  // ============================================================
  const handleNewMessage = useCallback((msg: Message) => {
    setMessages((prev) => {
      // Avoid duplicates
      if (prev.some((m) => m.id === msg.id)) return prev;
      return [...prev, msg];
    });
  }, []);

  const { isConnected, isAnyoneTyping, sendMessage, markRead, startTyping, stopTyping } =
    useChatSocket({
      conversationId: id,
      currentUserId: user?.id,
      onMessage: handleNewMessage,
    });

  // ============================================================
  // Auto scroll
  // ============================================================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAnyoneTyping]);

  // ============================================================
  // Mark read on open
  // ============================================================
  useEffect(() => {
    if (id && messages.length > 0) {
      markRead();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, messages.length]);

  // ============================================================
  // Send handler
  // ============================================================
  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;

    setSending(true);
    stopTyping();

    try {
      const newMsg = await sendMessage(text);
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
      setInput('');
    } catch (err) {
      // Fallback to HTTP if socket fails
      try {
        const r = await api.post(`/conversations/${id}/messages`, {
          message: text,
        });
        const httpMsg = r.data?.data;
        if (httpMsg) {
          setMessages((prev) => [...prev, httpMsg]);
          setInput('');
        }
      } catch {
        toast.error('বার্তা পাঠানো যায়নি');
      }
    } finally {
      setSending(false);
    }
  };

  // ============================================================
  // Input change (with typing indicator)
  // ============================================================
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (e.target.value.trim()) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  // ============================================================
  // Loading
  // ============================================================
  if (loading) return <LoadingSpinner size="lg" />;

  // ============================================================
  // Render
  // ============================================================
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] space-y-3">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/chat')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h2 className="font-semibold">
            {conversation?.moderator?.profile?.name ||
              conversation?.user?.profile?.name ||
              'কথোপকথন'}
          </h2>
          {conversation?.report && (
            <p className="text-xs text-slate-500">Report: {conversation.report.title}</p>
          )}
        </div>
        <Badge variant={isConnected ? 'success' : 'secondary'} className="gap-1">
          {isConnected ? (
            <>
              <Wifi className="h-3 w-3" /> Live
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3" /> Offline
            </>
          )}
        </Badge>
      </div>

      {/* Messages Window */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-500 text-sm">
              এখনো কোনো বার্তা নেই
            </div>
          ) : (
            messages.map((m) => (
              <MessageBubble key={m.id} message={m} isOwn={m.senderId === user?.id} />
            ))
          )}

          {/* Typing indicator */}
          {isAnyoneTyping && <div className="text-xs text-slate-500 italic px-2">লিখছে...</div>}

          <div ref={bottomRef} />
        </CardContent>

        {/* Input */}
        <div className="p-3 border-t bg-white flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="বার্তা লিখুন..."
            disabled={sending}
          />
          <Button onClick={handleSend} disabled={sending || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
