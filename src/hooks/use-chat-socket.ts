import { connectSocket } from '@/lib/socket';
import type { Message } from '@/types/conversation';
import { useCallback, useEffect, useRef, useState } from 'react';

// ============================================================
// Types
// ============================================================

interface Options {
  conversationId: string | undefined;
  currentUserId: string | undefined;
  onMessage?: (m: Message) => void;
}

// ============================================================
// useChatSocket Hook
// ============================================================

export function useChatSocket({ conversationId, currentUserId, onMessage }: Options) {
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const socketRef = useRef<any>(null);

  // ============================================================
  // Connect + Join conversation
  // ============================================================
  useEffect(() => {
    if (!conversationId) return;

    const socket = connectSocket();
    socketRef.current = socket;

    const onConnect = () => {
      setIsConnected(true);
      socket.emit('conversation:join', { conversationId });
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onMessageNew = (msg: Message) => {
      if (msg.conversationId === conversationId) {
        onMessage?.(msg);
      }
    };

    const onTypingStart = (data: { conversationId: string; userId: string }) => {
      if (data.conversationId === conversationId && data.userId !== currentUserId) {
        setTypingUsers((prev) => new Set(prev).add(data.userId));
      }
    };

    const onTypingStop = (data: { conversationId: string; userId: string }) => {
      if (data.conversationId === conversationId) {
        setTypingUsers((prev) => {
          const next = new Set(prev);
          next.delete(data.userId);
          return next;
        });
      }
    };

    const onMessageRead = (data: any) => {
      // Read receipt received
      console.log('Message read:', data);
    };

    // Attach listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('message:new', onMessageNew);
    socket.on('typing:start', onTypingStart);
    socket.on('typing:stop', onTypingStop);
    socket.on('message:read', onMessageRead);

    // If already connected → join immediately
    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.emit('conversation:leave', { conversationId });
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('message:new', onMessageNew);
      socket.off('typing:start', onTypingStart);
      socket.off('typing:stop', onTypingStop);
      socket.off('message:read', onMessageRead);
      setTypingUsers(new Set());
    };
  }, [conversationId, currentUserId, onMessage]);

  // ============================================================
  // Send message via Socket
  // ============================================================
  const sendMessage = useCallback(
    (text: string): Promise<Message> =>
      new Promise((resolve, reject) => {
        const socket = socketRef.current;
        if (!socket || !conversationId) {
          reject(new Error('Not connected'));
          return;
        }

        socket.emit('message:send', { conversationId, message: text }, (r: any) => {
          if (r?.success && r.message) {
            resolve(r.message);
          } else {
            reject(new Error(r?.error || 'Failed to send'));
          }
        });
      }),
    [conversationId]
  );

  // ============================================================
  // Mark as read
  // ============================================================
  const markRead = useCallback(() => {
    socketRef.current?.emit('message:read', { conversationId });
  }, [conversationId]);

  // ============================================================
  // Typing indicator
  // ============================================================
  const startTyping = useCallback(() => {
    const socket = socketRef.current;
    if (!socket || !conversationId) return;

    socket.emit('typing:start', { conversationId });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing:stop', { conversationId });
    }, 2000);
  }, [conversationId]);

  const stopTyping = useCallback(() => {
    socketRef.current?.emit('typing:stop', { conversationId });
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, [conversationId]);

  return {
    isConnected,
    typingUsers: Array.from(typingUsers),
    isAnyoneTyping: typingUsers.size > 0,
    sendMessage,
    markRead,
    startTyping,
    stopTyping,
  };
}
