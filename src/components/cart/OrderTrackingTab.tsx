'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Order } from '@/types/order';
import { ActiveOrder, clearActiveOrder, saveActiveOrder } from '@/lib/guest-orders';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/format';
import {
  Loader2,
  ExternalLink,
  Package,
  Clock,
  ChefHat,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  Truck,
} from 'lucide-react';
import Image from 'next/image';

interface OrderTrackingTabProps {
  activeOrders: ActiveOrder[];
  slug: string;
  basePath: string;
  onClose: () => void;
}

function getSteps(orderType: string) {
  if (orderType === 'delivery') {
    return [
      { key: 'received', label: 'Recibido', icon: Clock },
      { key: 'preparing', label: 'Preparando', icon: ChefHat },
      { key: 'ready', label: 'Listo', icon: Package },
      { key: 'on_the_way', label: 'En camino', icon: Truck },
      { key: 'completed', label: 'Entregado', icon: CheckCircle2 },
    ];
  }
  return [
    { key: 'received', label: 'Recibido', icon: Clock },
    { key: 'preparing', label: 'Preparando', icon: ChefHat },
    { key: 'ready', label: 'Listo', icon: Package },
    { key: 'completed', label: 'Entregado', icon: CheckCircle2 },
  ];
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  awaiting_payment: { label: 'Esperando pago', color: 'bg-amber-100 text-amber-700' },
  pending: { label: 'Recibido', color: 'bg-blue-100 text-blue-700' },
  in_progress: { label: 'Preparando', color: 'bg-blue-100 text-blue-700' },
  ready: { label: 'Listo', color: 'bg-emerald-100 text-emerald-700' },
  out_for_delivery: { label: 'En camino', color: 'bg-purple-100 text-purple-700' },
  completed: { label: 'Completado', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-700' },
};

const ITEM_STATUS_DOT: Record<string, string> = {
  pending: 'bg-gray-300',
  in_preparation: 'bg-blue-400',
  ready: 'bg-emerald-500',
  delivered: 'bg-gray-400',
};

const TERMINAL_STATUSES = new Set(['completed', 'cancelled']);

function getStepIndex(order: Order): number {
  if (order.status === 'cancelled') return -1;
  if (order.status === 'completed') {
    return order.type === 'delivery' ? 4 : 3;
  }
  if (order.status === 'out_for_delivery') return 3; // delivery only
  if (order.status === 'ready') return 2;
  if (order.status === 'pending' || order.status === 'awaiting_payment') return 0;
  // in_progress
  if (order.items?.some((i) => i.status === 'ready' || i.status === 'delivered')) return 2;
  return 1;
}

function getStatusMessage(order: Order): string {
  switch (order.status) {
    case 'awaiting_payment':
      return 'Verificando pago...';
    case 'pending':
      return 'Pedido recibido';
    case 'in_progress': {
      const ready = order.items?.filter((i) => i.status === 'ready' || i.status === 'delivered').length ?? 0;
      if (ready > 0) return `${ready}/${order.items?.length} items listos`;
      return 'En preparacion';
    }
    case 'ready':
      return order.type === 'delivery'
        ? 'Listo. Esperando repartidor.'
        : order.type === 'pickup'
          ? 'Listo para retirar.'
          : 'Tu pedido está listo.';
    case 'out_for_delivery':
      return 'En camino.';
    case 'completed':
      return 'Completado';
    case 'cancelled':
      return 'Cancelado';
    default:
      return '';
  }
}

/* ─── Compact Stepper ───────────────────────────────────────────────────── */

type Step = ReturnType<typeof getSteps>[number];

function CompactStepper({ steps, stepIndex }: { steps: Step[]; stepIndex: number }) {
  return (
    <div className="flex items-start w-full">
      {steps.map((step, idx) => {
        const isActive = idx <= stepIndex;
        const isCurrent = idx === stepIndex;
        const StepIcon = step.icon;
        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300',
                  isCurrent
                    ? 'bg-(--color-primary) text-white'
                    : isActive
                      ? 'bg-(--color-primary)/15 text-(--color-primary)'
                      : 'bg-gray-100 text-gray-300',
                )}
              >
                <StepIcon size={12} />
              </div>
              <span
                className={cn(
                  'text-[9px] font-medium text-center leading-tight w-12',
                  isActive ? 'text-gray-700' : 'text-gray-400',
                )}
              >
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className="flex-1 mt-3.5 mx-0.5">
                <div className="h-px w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-(--color-primary) rounded-full transition-all duration-500"
                    style={{ width: idx < stepIndex ? '100%' : '0%' }}
                  />
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ─── Order Card ────────────────────────────────────────────────────────── */

interface OrderCardProps {
  activeOrder: ActiveOrder;
  slug: string;
  basePath: string;
  onClose: () => void;
}

function OrderCard({ activeOrder, slug, basePath, onClose }: OrderCardProps) {
  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ['order-tracking', slug, activeOrder.orderId],
    queryFn: async () => {
      const res = await api.get<Order>(
        `/storefront/${slug}/orders/${activeOrder.orderId}`,
      );
      return res.data;
    },
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && TERMINAL_STATUSES.has(status) ? false : 10_000;
    },
    staleTime: 5_000,
  });

  useEffect(() => {
    if (order && TERMINAL_STATUSES.has(order.status)) {
      clearActiveOrder(activeOrder.orderId);
    }
  }, [order, activeOrder.orderId]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 flex items-center justify-center h-28">
        <Loader2 size={20} className="animate-spin text-gray-300" />
      </div>
    );
  }

  if (!order) return null;

  const steps = getSteps(order.type);
  const stepIndex = getStepIndex(order);
  const statusConfig = STATUS_CONFIG[order.status] ?? { label: order.status, color: 'bg-gray-100 text-gray-600' };
  const statusMessage = getStatusMessage(order);
  const isCancelled = order.status === 'cancelled';
  const orderNumber = order.orderNumber ?? order.id.slice(-8).toUpperCase();

  return (
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <p className="text-sm font-black text-gray-900 font-mono tracking-wider">
            #{orderNumber}
          </p>
          <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', statusConfig.color)}>
            {statusConfig.label}
          </span>
        </div>
        <Link
          href={`${basePath}/track/${order.id}`}
          onClick={onClose}
          className="flex items-center gap-1 text-xs font-semibold text-(--color-primary) hover:underline"
        >
          Ver
          <ExternalLink size={10} />
        </Link>
      </div>

      {/* Stepper or cancelled */}
      <div className="px-4 pb-3">
        {isCancelled ? (
          <div className="flex items-center gap-2 py-2 px-3 bg-red-50 rounded-xl">
            <XCircle size={14} className="text-red-500 shrink-0" />
            <p className="text-xs font-medium text-red-700">Pedido cancelado</p>
          </div>
        ) : (
          <>
            <CompactStepper steps={steps} stepIndex={stepIndex} />
            {statusMessage && (
              <p className="text-[10px] text-gray-400 text-center mt-1.5">{statusMessage}</p>
            )}
          </>
        )}
      </div>

      {/* Items summary */}
      <div className="border-t border-gray-100">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2.5 px-4 py-2 border-b border-gray-50 last:border-b-0"
          >
            {item.productImage ? (
              <div className="relative w-8 h-8 rounded-md overflow-hidden bg-gray-100 shrink-0">
                <Image src={item.productImage} alt={item.productName ?? ''} fill className="object-cover" />
              </div>
            ) : (
              <div className={cn('w-1.5 h-1.5 rounded-full shrink-0', ITEM_STATUS_DOT[item.status] ?? 'bg-gray-300')} />
            )}
            <p className="text-xs text-gray-700 flex-1 min-w-0 truncate">
              <span className="font-semibold">{item.quantity}x</span> {item.productName ?? 'Producto'}
            </p>
            <p className="text-xs text-gray-400 font-medium shrink-0 tabular-nums">
              {formatPrice(item.unitPrice * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="px-4 py-2.5 bg-gray-50 flex items-center justify-between border-t border-gray-100">
        <span className="text-xs text-gray-500 font-medium">Total</span>
        <span className="text-sm font-bold text-gray-900">{formatPrice(order.total ?? 0)}</span>
      </div>
    </div>
  );
}

/* ─── Add Order by Code ─────────────────────────────────────────────────── */

function AddOrderByCode({ slug, basePath }: { slug: string; basePath: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length < 4) {
      setError('Minimo 4 caracteres');
      return;
    }

    setError(null);
    setIsSearching(true);

    try {
      const res = await api.get<{ id: string; orderNumber: string }>(
        `/storefront/${slug}/orders/lookup`,
        { params: { orderNumber: trimmed } },
      );
      // Save to localStorage so it appears in tracking
      saveActiveOrder({
        orderId: res.data.id,
        orderNumber: res.data.orderNumber ?? trimmed,
        slug,
      });
      setCode('');
      setIsOpen(false);
      setError(null);
      // Force re-render by navigating to tracking
      router.push(`${basePath}/track/${res.data.id}`);
    } catch {
      setError('Pedido no encontrado');
    } finally {
      setIsSearching(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
      >
        <Plus size={14} />
        Agregar pedido por codigo
      </button>
    );
  }

  return (
    <div className="bg-gray-50 rounded-xl p-3 space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={code}
            onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(null); }}
            placeholder="Ej: A1B2C3D4"
            maxLength={8}
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm font-mono font-bold tracking-widest text-gray-900 placeholder:text-gray-300 placeholder:tracking-normal placeholder:font-normal placeholder:text-xs focus:outline-none focus:ring-1 focus:ring-(--color-primary) bg-white"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isSearching || code.trim().length < 4}
          className="h-9 px-3 rounded-lg bg-(--color-primary) text-white text-xs font-semibold hover:opacity-90 disabled:opacity-40 transition-all flex items-center gap-1.5 shrink-0"
        >
          {isSearching ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Search size={13} />
          )}
        </button>
        <button
          onClick={() => { setIsOpen(false); setCode(''); setError(null); }}
          className="h-9 px-2 rounded-lg text-gray-400 hover:text-gray-600 text-xs font-medium transition-colors shrink-0"
        >
          Cancel
        </button>
      </div>
      {error && <p className="text-xs text-red-500 px-1">{error}</p>}
    </div>
  );
}

/* ─── Tab ────────────────────────────────────────────────────────────────── */

export function OrderTrackingTab({
  activeOrders,
  slug,
  basePath,
  onClose,
}: OrderTrackingTabProps) {
  if (activeOrders.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-gray-100 p-5 rounded-full mb-4">
          <Package size={36} className="text-gray-300" />
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1">
          Sin pedidos activos
        </h3>
        <p className="text-sm text-gray-400 mb-5">
          Agrega un pedido con su codigo para ver el estado.
        </p>
        <AddOrderByCode slug={slug} basePath={basePath} />
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-3">
        {activeOrders.map((activeOrder) => (
          <OrderCard
            key={activeOrder.orderId}
            activeOrder={activeOrder}
            slug={slug}
            basePath={basePath}
            onClose={onClose}
          />
        ))}

        <AddOrderByCode slug={slug} basePath={basePath} />
      </div>
    </ScrollArea>
  );
}
