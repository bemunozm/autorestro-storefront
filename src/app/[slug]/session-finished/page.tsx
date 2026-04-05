'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSessionStore } from '@/stores/session-store';
import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { useRestaurant } from '@/providers/restaurant-provider';
import api from '@/lib/api';
import { 
  CheckCircle2, 
  Home, 
  PartyPopper
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import confetti from 'canvas-confetti';

interface SessionSummary {
  totalItems: number;
  totalSpent: number;
}

export default function SessionFinishedPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { restaurant, basePath } = useRestaurant();
  const { sessionId, clear: clearSession } = useSessionStore();
  const { token, logout } = useAuthStore();
  const { clearCart } = useCartStore();

  const [summary, setSummary] = useState<SessionSummary | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await api.get(`/storefront/${slug}/sessions/${sessionId}`);
      const data = res.data;
      const totalItems = data.orders.reduce((acc: number, order: { items: unknown[] }) => acc + order.items.length, 0);
      const totalSpent = data.orders.reduce((acc: number, order: { items: { price: number; quantity: number }[] }) => {
        return acc + order.items.reduce((sum: number, item: { price: number; quantity: number }) => sum + (item.price * item.quantity), 0);
      }, 0);
      setSummary({ totalItems, totalSpent });
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  }, [slug, sessionId]);

  // Fetch summary then clear session on mount
  useEffect(() => {
    const finalize = async () => {
      if (token && sessionId) {
        await fetchSummary();
      }
      clearSession();
      logout();
      clearCart();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
    };
    finalize();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Confetti on mount
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
          <div className="relative bg-primary p-6 rounded-full shadow-2xl">
            <CheckCircle2 size={48} className="text-white" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight">¡Gracias por tu visita!</h1>
          <p className="text-muted-foreground font-medium">
            Esperamos que hayas disfrutado tu experiencia en <span className="text-foreground font-bold">{restaurant?.name}</span>.
          </p>
        </div>

        <Card className="border-none bg-muted/30 rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
              <span>Platillos disfrutados</span>
              {summary === null
                ? <Skeleton className="h-4 w-8 rounded" />
                : <span className="text-foreground font-bold">{summary.totalItems}</span>
              }
            </div>
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total de la mesa</span>
              {summary === null
                ? <Skeleton className="h-5 w-24 rounded" />
                : <span className="text-primary">{formatPrice(summary.totalSpent)}</span>
              }
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Button 
            onClick={() => router.push(basePath || '/')}
            className="w-full h-14 rounded-2xl bg-primary text-lg font-bold shadow-xl shadow-primary/20 gap-2 group"
          >
            Volver al inicio
            <Home size={20} className="group-hover:-translate-y-0.5 transition-transform" />
          </Button>
          
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-bold uppercase tracking-widest pt-4">
            <PartyPopper size={14} />
            Vuelve pronto
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 text-[10px] text-muted-foreground font-medium opacity-50">
        POWERED BY AUTORESTRO
      </div>
    </div>
  );
}
