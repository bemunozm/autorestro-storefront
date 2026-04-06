'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useRestaurant } from '@/providers/restaurant-provider';
import { getActiveOrder, clearActiveOrder } from '@/lib/guest-orders';
import { X, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import api from '@/lib/api';

const STATUS_MAP: Record<string, { label: string; dot: string }> = {
  awaiting_payment: { label: 'Esperando pago', dot: 'bg-amber-400' },
  pending: { label: 'Recibido', dot: 'bg-blue-400' },
  in_progress: { label: 'Preparando', dot: 'bg-blue-500' },
  ready: { label: 'Listo', dot: 'bg-emerald-500' },
};

const DEFAULT_STATUS = { label: 'En curso', dot: 'bg-blue-400' };
const TERMINAL_STATUSES = new Set(['completed', 'cancelled']);
const POLL_MS = 15_000;

export function ActiveOrderBanner() {
  const router = useRouter();
  const pathname = usePathname();
  const { basePath, slug } = useRestaurant();
  const { isAuthenticated } = useAuthStore();

  const [hasMounted, setHasMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { setHasMounted(true); }, []);

  const activeOrder = hasMounted && slug ? getActiveOrder(slug) : null;

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const fetchStatus = useCallback(async () => {
    if (!slug || !activeOrder) return;
    try {
      const res = await api.get<{ status: string }>(
        `/storefront/${slug}/orders/${activeOrder.orderId}`,
      );
      const s = res.data.status;
      setOrderStatus(s);
      if (TERMINAL_STATUSES.has(s)) {
        stopPolling();
        clearActiveOrder(activeOrder.orderId);
      }
    } catch { /* silent */ }
  }, [slug, activeOrder, stopPolling]);

  useEffect(() => {
    if (!hasMounted || !activeOrder) return;
    fetchStatus();
    intervalRef.current = setInterval(fetchStatus, POLL_MS);
    return () => stopPolling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMounted, activeOrder?.orderId]);

  // Entrance animation delay
  useEffect(() => {
    if (hasMounted && activeOrder && !dismissed) {
      const t = setTimeout(() => setVisible(true), 300);
      return () => clearTimeout(t);
    }
    setVisible(false);
  }, [hasMounted, activeOrder, dismissed]);

  if (!hasMounted) return null;
  if (isAuthenticated) return null;
  if (!activeOrder) return null;
  if (pathname?.includes('/track/')) return null;
  if (dismissed) return null;

  const status = STATUS_MAP[orderStatus ?? 'pending'] ?? DEFAULT_STATUS;

  return (
    <>
      {/* Mobile — pill above the cart button */}
      <div
        className={`
          lg:hidden fixed bottom-20 left-4 right-4 z-50
          transition-all duration-500 ease-out
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
        `}
      >
        <button
          onClick={() => router.push(`${basePath}/track/${activeOrder.orderId}`)}
          className="
            w-full flex items-center gap-3 px-4 py-3
            bg-white rounded-2xl
            shadow-[0_4px_24px_rgba(0,0,0,0.10)]
            border border-gray-100
            active:scale-[0.98] transition-transform
          "
        >
          {/* Animated status dot */}
          <span className="relative flex h-3 w-3 shrink-0">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-50 ${status.dot}`} />
            <span className={`relative inline-flex rounded-full h-3 w-3 ${status.dot}`} />
          </span>

          {/* Info */}
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900 truncate">
              {status.label}
            </span>
            <span className="text-xs text-gray-400 font-mono tracking-wider shrink-0">
              #{activeOrder.orderNumber}
            </span>
          </div>

          {/* Arrow */}
          <ChevronRight size={16} className="text-gray-300 shrink-0" />

          {/* Dismiss */}
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); setDismissed(true); } }}
            className="shrink-0 p-1 -mr-1 rounded-full text-gray-300 hover:text-gray-500 transition-colors"
            aria-label="Cerrar"
          >
            <X size={14} />
          </span>
        </button>
      </div>

      {/* Desktop — floating pill above cart FAB */}
      <div
        className={`
          hidden lg:block fixed bottom-24 right-6 z-50
          transition-all duration-500 ease-out
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
        `}
      >
        <button
          onClick={() => router.push(`${basePath}/track/${activeOrder.orderId}`)}
          className="
            flex items-center gap-3 pl-4 pr-3 py-2.5
            bg-white rounded-full
            shadow-[0_8px_32px_rgba(0,0,0,0.12)]
            border border-gray-100
            hover:shadow-[0_8px_32px_rgba(0,0,0,0.18)]
            hover:scale-[1.02] active:scale-[0.98]
            transition-all duration-200
          "
        >
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-50 ${status.dot}`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${status.dot}`} />
          </span>

          <span className="text-sm font-semibold text-gray-900">
            {status.label}
          </span>
          <span className="text-xs text-gray-400 font-mono tracking-wider">
            #{activeOrder.orderNumber}
          </span>

          <span
            role="button"
            tabIndex={0}
            onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); setDismissed(true); } }}
            className="p-1 rounded-full text-gray-300 hover:text-gray-500 transition-colors"
            aria-label="Cerrar"
          >
            <X size={14} />
          </span>
        </button>
      </div>
    </>
  );
}
