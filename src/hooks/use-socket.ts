import { connectSocket } from '@/lib/socket';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

export const useSocket = (enabled: boolean = true) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const s = connectSocket();
    setSocket(s);

    s.on('connect', () => setConnected(true));
    s.on('disconnect', () => setConnected(false));

    return () => {
      s.off('connect');
      s.off('disconnect');
    };
  }, [enabled]);

  return { socket, connected };
};
