import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/auth-store';

interface OrderUpdate {
  orderId: string;
  status?: string;
  itemId?: string;
  itemStatus?: string;
}

export function useOrderSocket(restaurantId: string | undefined) {
  const { token } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [updates, setUpdates] = useState<OrderUpdate[]>([]);

  useEffect(() => {
    if (!token || !restaurantId) return;

    const s = io(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/orders`, {
      auth: { token },
      transports: ['websocket'],
    });

    s.on('connect', () => {
      s.emit('join:session', { restaurantId });
    });

    s.on('order:item:updated', (data: OrderUpdate) => {
      setUpdates(prev => [...prev, data]);
    });

    setSocket(s);
    return () => { s.disconnect(); };
  }, [token, restaurantId]);

  return { socket, updates };
}
