'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useRestaurant } from '@/providers/restaurant-provider';
import api from '@/lib/api';
import { Order, OrderItem } from '@/types/order';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Clock,
  ChefHat,
  Package,
  XCircle,
  Loader2,
  CreditCard,
  User,
  Phone,
  Mail,
  MapPin,
  UtensilsCrossed,
  ShoppingBag,
  Truck,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/format';
import Link from 'next/link';
import Image from 'next/image';
import { clearActiveOrder, saveActiveOrder, getActiveOrdersForSlug } from '@/lib/guest-orders';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';

/* ─── Config ────────────────────────────────────────────────────────────── */

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

const ITEM_STATUS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' },
  in_preparation: { label: 'Preparando', color: 'bg-blue-100 text-blue-700' },
  ready: { label: 'Listo', color: 'bg-green-100 text-green-700' },
  delivered: { label: 'Entregado', color: 'bg-gray-100 text-gray-600' },
};

const ORDER_TYPE_LABELS: Record<string, { label: string; icon: typeof UtensilsCrossed }> = {
  dine_in: { label: 'En el local', icon: UtensilsCrossed },
  pickup: { label: 'Para retirar', icon: ShoppingBag },
  delivery: { label: 'Delivery', icon: Truck },
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  webpay: 'Webpay',
  mercadopago: 'MercadoPago',
  cash: 'Efectivo',
  pending: 'Pendiente',
};

const PAYMENT_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendiente', color: 'text-amber-600' },
  paid: { label: 'Pagado', color: 'text-emerald-600' },
  failed: { label: 'Fallido', color: 'text-red-600' },
  refunded: { label: 'Reembolsado', color: 'text-gray-600' },
};

const TERMINAL_STATUSES = new Set(['completed', 'cancelled']);

const STATUS_CONFIG_SIDEBAR: Record<string, { label: string; color: string }> = {
  awaiting_payment: { label: 'Pago pendiente', color: 'bg-amber-100 text-amber-700' },
  pending:          { label: 'Recibido',        color: 'bg-blue-100 text-blue-700' },
  in_progress:      { label: 'Preparando',      color: 'bg-blue-100 text-blue-700' },
  ready:            { label: 'Listo',           color: 'bg-green-100 text-green-700' },
  out_for_delivery: { label: 'En camino',       color: 'bg-purple-100 text-purple-700' },
  completed:        { label: 'Entregado',       color: 'bg-gray-100 text-gray-500' },
  cancelled:        { label: 'Cancelado',       color: 'bg-red-100 text-red-600' },
};

function getStepDescription(key: string): string {
  const descriptions: Record<string, string> = {
    received: 'Tu pedido fue recibido',
    preparing: 'Preparando tu pedido',
    ready: 'Listo para entregar',
    on_the_way: 'En camino a tu ubicacion',
    completed: 'Pedido entregado',
  };
  return descriptions[key] ?? '';
}

function getStepIndex(order: Order): number {
  if (order.status === 'cancelled') return -1;
  if (order.status === 'completed') {
    return order.type === 'delivery' ? 4 : 3;
  }
  if (order.status === 'out_for_delivery') return 3; // delivery only
  if (order.status === 'ready') return 2;
  if (order.status === 'pending' || order.status === 'awaiting_payment') return 0;
  // in_progress
  if (order.items.some((i) => i.status === 'ready' || i.status === 'delivered')) return 2;
  return 1;
}

function getStatusMessage(order: Order): string {
  switch (order.status) {
    case 'awaiting_payment':
      return 'Estamos verificando tu pago. Esta pagina se actualizara automaticamente.';
    case 'pending':
      return 'Tu pedido fue recibido y esta en espera.';
    case 'in_progress': {
      const ready = order.items?.filter((i) => i.status === 'ready' || i.status === 'delivered').length ?? 0;
      if (ready > 0) return `${ready} de ${order.items?.length} items listos.`;
      return 'Nuestro equipo esta trabajando en tu pedido.';
    }
    case 'ready':
      return order.type === 'delivery'
        ? 'Tu pedido está listo. Esperando al repartidor.'
        : order.type === 'pickup'
          ? 'Tu pedido está listo para retirar.'
          : 'Tu pedido está listo.';
    case 'out_for_delivery':
      return 'Tu pedido va en camino.';
    case 'completed':
      return 'Todos los items fueron entregados.';
    case 'cancelled':
      return 'Este pedido fue cancelado.';
    default:
      return '';
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/* ─── Stepper components ────────────────────────────────────────────────── */

interface StepperProps {
  steps: ReturnType<typeof getSteps>;
  stepIndex: number;
  statusMessage: string;
}

function VerticalStepper({ steps, stepIndex, statusMessage }: StepperProps) {
  return (
    <div className="flex flex-col">
      {steps.map((step, idx) => {
        const isCurrent = idx === stepIndex;
        const isDone = idx < stepIndex;
        const StepIcon = isDone ? CheckCircle2 : step.icon;
        const isLast = idx === steps.length - 1;
        const description = getStepDescription(step.key);

        return (
          <div key={step.key} className="flex gap-4">
            {/* Left column: circle + connector line */}
            <div className="flex flex-col items-center shrink-0">
              {/* Circle */}
              {isCurrent ? (
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-11 h-11 rounded-full ring-4 ring-primary/20 animate-pulse" />
                  <div className="w-11 h-11 rounded-full bg-(--color-primary) text-white flex items-center justify-center shadow-md z-10">
                    <StepIcon className="h-5 w-5" />
                  </div>
                </div>
              ) : isDone ? (
                <div className="w-11 h-11 rounded-full bg-(--color-primary) text-white flex items-center justify-center opacity-70">
                  <StepIcon className="h-5 w-5" />
                </div>
              ) : (
                <div className="w-11 h-11 rounded-full bg-gray-100 text-gray-300 border-2 border-gray-200 flex items-center justify-center">
                  <StepIcon className="h-5 w-5" />
                </div>
              )}

              {/* Connector line below circle */}
              {!isLast && (
                <div className="w-0.5 h-8 mt-1 rounded-full overflow-hidden bg-gray-200">
                  {isDone && (
                    <div className="w-full h-full bg-(--color-primary)" />
                  )}
                </div>
              )}
            </div>

            {/* Right column: label + description */}
            <div className={cn('flex flex-col justify-center', isLast ? 'pb-0' : 'pb-1')}>
              <span
                className={cn(
                  'text-sm leading-tight',
                  isCurrent
                    ? 'font-bold text-gray-900'
                    : isDone
                      ? 'font-semibold text-gray-700'
                      : 'font-medium text-gray-400',
                )}
              >
                {step.label}
              </span>
              {isCurrent && description && (
                <span className="text-xs text-gray-400 mt-0.5">{description}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HorizontalStepper({ steps, stepIndex, statusMessage: _statusMessage }: StepperProps) {
  return (
    <div className="w-full">
      {/* Top row: circles + connecting lines */}
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => {
          const isCurrent = idx === stepIndex;
          const isDone = idx < stepIndex;
          const StepIcon = isDone ? CheckCircle2 : step.icon;
          const isLast = idx === steps.length - 1;

          return (
            <React.Fragment key={step.key}>
              <div className="relative flex items-center justify-center">
                {isCurrent ? (
                  <div className="relative">
                    <span
                      className="absolute inset-0 rounded-full animate-ping bg-(--color-primary)/30"
                      style={{ animationDuration: '2s' }}
                    />
                    <div className="relative w-12 h-12 rounded-full bg-(--color-primary) text-white flex items-center justify-center shadow-lg z-10">
                      <StepIcon className="h-5 w-5" />
                    </div>
                  </div>
                ) : isDone ? (
                  <div className="w-12 h-12 rounded-full bg-(--color-primary) text-white flex items-center justify-center opacity-80">
                    <StepIcon className="h-5 w-5" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-300 border-2 border-dashed border-gray-200 flex items-center justify-center">
                    <StepIcon className="h-5 w-5" />
                  </div>
                )}
              </div>

              {!isLast && (
                <div className="flex-1 h-0.5 mx-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-(--color-primary) rounded-full transition-all duration-700 ease-out"
                    style={{ width: idx < stepIndex ? '100%' : '0%' }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Bottom row: labels + descriptions */}
      <div className="flex justify-between mt-3">
        {steps.map((step, idx) => {
          const isCurrent = idx === stepIndex;
          const isDone = idx < stepIndex;
          const description = getStepDescription(step.key);

          return (
            <div
              key={step.key}
              className="flex flex-col items-center text-center"
              style={{ width: `${100 / steps.length}%` }}
            >
              <span
                className={cn(
                  'text-sm leading-tight',
                  isCurrent
                    ? 'font-bold text-gray-900'
                    : isDone
                      ? 'font-semibold text-gray-600'
                      : 'font-medium text-gray-400',
                )}
              >
                {step.label}
              </span>
              {isCurrent && description && (
                <span className="text-xs text-gray-400 mt-0.5">{description}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Sidebar Order Card ────────────────────────────────────────────────── */

function getSidebarAccentColor(status: string): string {
  if (status === 'cancelled') return 'bg-red-400';
  if (status === 'completed') return 'bg-gray-300';
  if (status === 'ready') return 'bg-green-400';
  if (status === 'in_progress' || status === 'pending') return 'bg-blue-400';
  if (status === 'out_for_delivery') return 'bg-purple-400';
  // awaiting_payment or any active state
  return 'bg-(--color-primary)';
}

function SidebarOrderCard({
  activeOrderId,
  currentOrderId,
  currentOrder,
  slug,
  basePath,
  isAuthenticated,
}: {
  activeOrderId: string;
  currentOrderId: string;
  currentOrder?: Order;
  slug: string;
  basePath: string;
  isAuthenticated: boolean;
}) {
  const isActive = activeOrderId === currentOrderId;
  const { addItem } = useCartStore();

  const { data: fetchedData } = useQuery<Order>({
    queryKey: ['guest-order', activeOrderId],
    queryFn: () =>
      api.get<Order>(`/storefront/${slug}/orders/${activeOrderId}`).then((r) => r.data),
    staleTime: 60_000,
    enabled: !isActive,
    retry: false,
  });

  const orderData = isActive ? currentOrder : fetchedData;

  if (!orderData) {
    return (
      <div className={cn(
        'rounded-xl overflow-hidden border',
        isActive ? 'bg-white border-gray-200 shadow-sm ring-1 ring-black/5' : 'border-transparent',
      )}>
        <div className="flex">
          <div className="w-[3px] shrink-0 bg-gray-100 rounded-l-xl animate-pulse" />
          <div className="flex-1 p-3 space-y-2">
            <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
            <div className="h-1 w-full bg-gray-50 rounded-full animate-pulse" />
            <div className="h-3 w-full bg-gray-50 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const sc = STATUS_CONFIG_SIDEBAR[orderData.status];
  const orderNum = orderData.orderNumber ?? activeOrderId.slice(-8).toUpperCase();
  const typeInfo = ORDER_TYPE_LABELS[orderData.type];
  const itemCount = orderData.items?.length ?? 0;
  const firstItems = orderData.items?.slice(0, 3) ?? [];
  const steps = getSteps(orderData.type);
  const stepIndex = getStepIndex(orderData);
  const isCancelled = orderData.status === 'cancelled';
  const isTerminal = TERMINAL_STATUSES.has(orderData.status);
  const accentColor = getSidebarAccentColor(orderData.status);

  const itemsText = firstItems.map((i) => `${i.quantity}x ${i.productName ?? 'Producto'}`).join(', ');
  const moreCount = itemCount - firstItems.length;

  const handleReorder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    for (const item of orderData.items) {
      addItem(
        { id: item.productId, name: item.productName ?? 'Producto', price: item.unitPrice, imageUrl: item.productImage },
        item.quantity,
        item.comment,
      );
    }
  };

  return (
    <Link href={`${basePath}/track/${activeOrderId}`}>
      <div className={cn(
        'rounded-xl overflow-hidden transition-all border',
        isActive
          ? 'bg-white shadow-sm ring-1 ring-black/5 border-gray-200'
          : 'border-transparent hover:bg-gray-50/80',
      )}>
        <div className="flex">
          {/* Left accent border */}
          <div className={cn('w-[3px] shrink-0 rounded-l-xl', accentColor)} />

          <div className="flex-1 p-3">
            {/* Header: number + status badge */}
            <div className="flex items-center justify-between mb-1.5">
              <span className={cn('text-sm font-mono font-black tracking-wider', isActive ? 'text-gray-900' : 'text-gray-500')}>
                #{orderNum}
              </span>
              {sc && (
                <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full', sc.color)}>
                  {sc.label}
                </span>
              )}
            </div>

            {/* Segmented progress bar */}
            {!isCancelled && (
              <div className="flex gap-1 mb-2">
                {steps.map((_, idx) => (
                  <div key={idx} className="flex-1 h-1 rounded-full overflow-hidden bg-gray-100">
                    <div
                      className={cn('h-full rounded-full transition-all duration-500', idx <= stepIndex ? 'bg-(--color-primary)' : '')}
                      style={{ width: idx <= stepIndex ? '100%' : '0%' }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Items text */}
            <p className="text-[11px] text-gray-500 truncate mb-1">
              {itemsText}{moreCount > 0 && <span className="text-gray-400"> +{moreCount} más</span>}
            </p>

            {/* Creation date */}
            <p className="text-[11px] text-gray-400 mb-1.5">
              {formatDate(orderData.createdAt)}
            </p>

            {/* Footer: type + total */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-[11px] text-gray-400">
                {typeInfo && (
                  <>
                    <typeInfo.icon size={10} />
                    <span>{typeInfo.label}</span>
                  </>
                )}
              </div>
              <span className={cn('text-sm font-bold tabular-nums', isActive ? 'text-gray-900' : 'text-gray-500')}>
                {formatPrice(orderData.total ?? 0)}
              </span>
            </div>

            {/* Reorder button — only for authenticated users */}
            {isTerminal && isAuthenticated && (
              <button
                onClick={handleReorder}
                className="mt-2 w-full py-1.5 text-[11px] font-semibold text-(--color-primary) bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
              >
                Repetir pedido
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── Mobile Order Card ─────────────────────────────────────────────────── */

function MobileOrderCard({
  orderId: cardOrderId,
  isActive,
  currentOrder,
  slug,
  basePath,
  onSelect,
  delay,
  isAuthenticated,
}: {
  orderId: string;
  isActive: boolean;
  currentOrder?: Order;
  slug: string;
  basePath: string;
  onSelect: () => void;
  delay: number;
  isAuthenticated: boolean;
}) {
  const { addItem } = useCartStore();

  const { data: fetchedData } = useQuery<Order>({
    queryKey: ['guest-order', cardOrderId],
    queryFn: () =>
      api.get<Order>(`/storefront/${slug}/orders/${cardOrderId}`).then((r) => r.data),
    staleTime: 60_000,
    enabled: !isActive,
    retry: false,
  });

  const orderData = isActive ? currentOrder : fetchedData;

  if (!orderData) {
    return (
      <div
        className="bg-white rounded-2xl p-4 shadow-sm opacity-0 animate-[fadeInUp_0.4s_ease-out_forwards]"
        style={{ animationDelay: `${delay}s` }}
      >
        <div className="space-y-2.5">
          <div className="h-5 w-28 bg-gray-100 rounded animate-pulse" />
          <div className="flex gap-1">
            <div className="h-1.5 flex-1 bg-gray-100 rounded-full animate-pulse" />
            <div className="h-1.5 flex-1 bg-gray-50 rounded-full animate-pulse" />
            <div className="h-1.5 flex-1 bg-gray-50 rounded-full animate-pulse" />
          </div>
          <div className="h-3 w-40 bg-gray-50 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  const sc = STATUS_CONFIG_SIDEBAR[orderData.status];
  const orderNum = orderData.orderNumber ?? cardOrderId.slice(-8).toUpperCase();
  const typeInfo = ORDER_TYPE_LABELS[orderData.type];
  const itemCount = orderData.items?.length ?? 0;
  const firstItems = orderData.items?.slice(0, 3) ?? [];
  const steps = getSteps(orderData.type);
  const stepIndex = getStepIndex(orderData);
  const isCancelled = orderData.status === 'cancelled';
  const isTerminal = TERMINAL_STATUSES.has(orderData.status);

  const itemsText = firstItems.map((i) => `${i.quantity}x ${i.productName ?? 'Producto'}`).join(', ');
  const moreCount = itemCount - firstItems.length;

  const handleReorder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    for (const item of orderData.items) {
      addItem(
        { id: item.productId, name: item.productName ?? 'Producto', price: item.unitPrice, imageUrl: item.productImage },
        item.quantity,
        item.comment,
      );
    }
  };

  return (
    <Link
      href={`${basePath}/track/${cardOrderId}`}
      onClick={() => { sessionStorage.setItem('tracker-nav', 'detail'); onSelect(); }}
      className="block opacity-0 animate-[fadeInUp_0.4s_ease-out_forwards]"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className={cn(
        'bg-white rounded-2xl shadow-sm transition-all border overflow-hidden',
        isActive ? 'border-gray-200 ring-1 ring-primary/10' : 'border-transparent active:scale-[0.98]',
      )}>
        <div className="p-4">
          {/* Row 1: Order number + badge + total */}
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2.5">
              <span className="text-base font-mono font-black tracking-wider text-gray-900">
                #{orderNum}
              </span>
              {sc && (
                <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', sc.color)}>
                  {sc.label}
                </span>
              )}
            </div>
            <span className="text-base font-bold text-gray-900 tabular-nums">
              {formatPrice(orderData.total ?? 0)}
            </span>
          </div>

          {/* Row 2: Segmented progress bar */}
          {!isCancelled && (
            <div className="flex gap-1 mb-3">
              {steps.map((step, idx) => (
                <div key={step.key} className="flex-1 h-1.5 rounded-full overflow-hidden bg-gray-100">
                  <div
                    className={cn('h-full rounded-full transition-all duration-500', idx <= stepIndex ? 'bg-(--color-primary)' : '')}
                    style={{ width: idx <= stepIndex ? '100%' : '0%' }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Row 3: Items as text */}
          <p className="text-sm text-gray-600 mb-2">
            {itemsText}
            {moreCount > 0 && <span className="text-gray-400"> +{moreCount} más</span>}
          </p>

          {/* Row 4: Type + date */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            {typeInfo && (
              <span className="flex items-center gap-1.5">
                <typeInfo.icon size={12} />
                {typeInfo.label}
              </span>
            )}
            <span>{formatDate(orderData.createdAt)}</span>
          </div>
        </div>

        {/* Reorder button — only for authenticated users */}
        {isTerminal && isAuthenticated && (
          <button
            onClick={handleReorder}
            className="w-full py-2.5 text-xs font-semibold text-(--color-primary) bg-primary/5 hover:bg-primary/10 border-t border-gray-100 transition-colors"
          >
            Repetir pedido
          </button>
        )}
      </div>
    </Link>
  );
}

/* ─── Mobile Order List ─────────────────────────────────────────────────── */

function MobileOrderList({
  allOrders,
  currentOrderId,
  currentOrder,
  slug,
  basePath,
  onSelectOrder,
  isAuthenticated,
}: {
  allOrders: { id: string; orderNumber: string }[];
  currentOrderId: string;
  currentOrder?: Order;
  slug: string;
  basePath: string;
  onSelectOrder: () => void;
  isAuthenticated: boolean;
}) {
  return (
    <div className="space-y-3">
      <Link
        href={`${basePath}/menu`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-gray-700 transition-colors mb-2"
      >
        <ArrowLeft size={16} />
        Volver al menú
      </Link>
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-gray-900">Mis pedidos</p>
        <span className="text-xs text-gray-400 font-medium">{allOrders.length} pedidos</span>
      </div>
      {allOrders.map((o, idx) => (
        <MobileOrderCard
          key={o.id}
          orderId={o.id}
          isActive={o.id === currentOrderId}
          currentOrder={o.id === currentOrderId ? currentOrder : undefined}
          slug={slug}
          basePath={basePath}
          onSelect={onSelectOrder}
          delay={idx * 0.05}
          isAuthenticated={isAuthenticated}
        />
      ))}
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function GuestTrackingPage() {
  const params = useParams();
  const slug = params.slug as string;
  const orderId = params.orderId as string;
  const { basePath, restaurant } = useRestaurant();
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuthStore();

  const { data: order, isLoading } = useQuery({
    queryKey: ['guest-order', orderId],
    queryFn: () =>
      api.get<Order>(`/storefront/${slug}/orders/${orderId}`).then((r) => r.data),
    staleTime: 15_000,
    retry: 1,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return 15_000;
      return TERMINAL_STATUSES.has(data.status) ? false : 15_000;
    },
  });

  useEffect(() => {
    if (!order) return;
    if (TERMINAL_STATUSES.has(order.status)) {
      clearActiveOrder(orderId);
    } else {
      saveActiveOrder({
        orderId,
        orderNumber: order.orderNumber ?? orderId.slice(-8).toUpperCase(),
        slug,
      });
    }
  }, [order?.status, orderId, slug]);

  // ── Order sidebar state ───────────────────────────────────────────────────
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => { setHasMounted(true); }, []);

  const guestOrders = hasMounted && slug ? getActiveOrdersForSlug(slug) : [];

  const allOrders = useMemo(() => {
    const orderMap = new Map<string, { id: string; orderNumber: string; statusLabel?: string; statusColor?: string }>();

    // Current order always first (unless terminal + guest)
    if (order) {
      const isTerminal = TERMINAL_STATUSES.has(order.status);
      if (!(isTerminal && !isAuthenticated)) {
        const sc = STATUS_CONFIG_SIDEBAR[order.status];
        orderMap.set(orderId, {
          id: orderId,
          orderNumber: order.orderNumber ?? orderId.slice(-8).toUpperCase(),
          statusLabel: sc?.label,
          statusColor: sc?.color,
        });
      }
    }

    // Guest orders from localStorage
    for (const go of guestOrders) {
      if (!orderMap.has(go.orderId)) {
        orderMap.set(go.orderId, {
          id: go.orderId,
          orderNumber: go.orderNumber,
        });
      }
    }

    return Array.from(orderMap.values());
  }, [order, orderId, guestOrders, isAuthenticated]);

  const hasMultipleOrders = allOrders.length > 1;

  const [mobileView, setMobileView] = useState<'list' | 'detail'>('detail');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fromCard = sessionStorage.getItem('tracker-nav');
    if (fromCard) {
      sessionStorage.removeItem('tracker-nav');
      setMobileView('detail');
    } else if (isMobile && hasMultipleOrders) {
      setMobileView('list');
    }
  }, [isMobile, hasMultipleOrders, orderId]);
  // ─────────────────────────────────────────────────────────────────────────

  if (isLoading && !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin h-8 w-8 text-gray-300" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
        <XCircle size={40} className="text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">Pedido no encontrado</p>
        <Link href={`${basePath}/menu`} className="text-sm text-(--color-primary) font-semibold mt-3 hover:underline">
          Volver al menu
        </Link>
      </div>
    );
  }

  const steps = getSteps(order.type);
  const stepIndex = getStepIndex(order);
  const statusMessage = getStatusMessage(order);
  const orderNumber = order.orderNumber ?? orderId.slice(-8).toUpperCase();
  const orderType = ORDER_TYPE_LABELS[order.type];
  const paymentMethod = PAYMENT_METHOD_LABELS[order.paymentMethod ?? 'pending'] ?? order.paymentMethod;
  const paymentStatus = PAYMENT_STATUS_LABELS[order.paymentStatus ?? 'pending'];
  const isCancelled = order.status === 'cancelled';
  const isAwaitingPayment = order.status === 'awaiting_payment';
  const hasCustomerInfo = order.guestName || order.guestEmail || order.guestPhone || order.table;

  const detailsLayout = isMobile ? 'mobile' : 'desktop';

  return (
    <div className="min-h-screen bg-gray-50 pb-12 relative">
      {/* Subtle top gradient accent */}
      <div className="absolute inset-x-0 top-0 h-48 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />

      <div
        className={cn(
          'relative mx-auto px-4 py-6',
          hasMultipleOrders && !isMobile ? 'max-w-6xl' : 'max-w-4xl',
        )}
      >
        {/* Back link — hidden when mobile list view has its own nav */}
        {!(isMobile && mobileView === 'list') && (
          <div className="opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]">
            {isMobile && hasMultipleOrders ? (
              <button
                onClick={() => setMobileView('list')}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft size={16} />
                Mis pedidos
              </button>
            ) : (
              <Link
                href={`${basePath}/menu`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft size={16} />
                Volver
              </Link>
            )}
          </div>
        )}

        {/* Main layout: sidebar + content */}
        <div className={cn(
          hasMultipleOrders && !isMobile ? 'flex gap-6 mt-4' : isMobile ? 'mt-3 space-y-3' : 'mt-4 space-y-4',
        )}>

          {/* Desktop sidebar */}
          {hasMultipleOrders && !isMobile && (
            <aside className="w-72 shrink-0 opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 mb-3">
                Mis pedidos
              </p>
              <div className="space-y-2">
                {allOrders.map((o) => (
                  <SidebarOrderCard
                    key={o.id}
                    activeOrderId={o.id}
                    currentOrderId={orderId}
                    currentOrder={o.id === orderId ? order : undefined}
                    slug={slug}
                    basePath={basePath}
                    isAuthenticated={isAuthenticated}
                  />
                ))}
              </div>
            </aside>
          )}

          {/* Content area */}
          <div className={cn(
            hasMultipleOrders && !isMobile ? 'flex-1 min-w-0 space-y-4' : '',
            !hasMultipleOrders && !isMobile ? 'space-y-4' : '',
            isMobile ? '' : '',
          )}>

            {isMobile && mobileView === 'list' ? (
              <MobileOrderList
                allOrders={allOrders}
                currentOrderId={orderId}
                currentOrder={order}
                slug={slug}
                basePath={basePath}
                onSelectOrder={() => setMobileView('detail')}
                isAuthenticated={isAuthenticated}
              />
            ) : (
              <>
            {/* Hero status card */}
            <div
              className="bg-white rounded-3xl shadow-sm overflow-hidden opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]"
              style={{ animationDelay: '0.05s' }}
            >
              {/* Top accent bar */}
              <div className="h-1.5 bg-(--color-primary)" />

              <div className={cn(isMobile ? 'p-5' : 'p-8')}>
                {/* Order number + type badge row */}
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Pedido</p>
                    <p className={cn(
                      'font-black text-gray-900 font-mono tracking-wider leading-none',
                      isMobile ? 'text-2xl' : 'text-4xl',
                    )}>
                      #{orderNumber}
                    </p>
                    <p className="text-xs text-gray-400 mt-1.5">{formatDate(order.createdAt)}</p>
                  </div>
                  {orderType && (
                    <div className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1.5 shrink-0">
                      <orderType.icon size={13} className="text-gray-500" />
                      <span className="text-xs font-semibold text-gray-600">{orderType.label}</span>
                    </div>
                  )}
                </div>

                {/* Status message */}
                {!isAwaitingPayment && !isCancelled && statusMessage && (
                  <div className={cn(isMobile ? 'mb-5' : 'mb-8')}>
                    <p className={cn(
                      'font-bold text-gray-900',
                      isMobile ? 'text-base' : 'text-xl',
                    )}>
                      {statusMessage}
                    </p>
                  </div>
                )}

                {/* Stepper */}
                {!isAwaitingPayment && !isCancelled && (
                  <div>
                    {isMobile ? (
                      <VerticalStepper steps={steps} stepIndex={stepIndex} statusMessage={statusMessage} />
                    ) : (
                      <HorizontalStepper steps={steps} stepIndex={stepIndex} statusMessage={statusMessage} />
                    )}
                  </div>
                )}

                {/* Awaiting payment */}
                {isAwaitingPayment && (
                  <div className="flex items-center gap-3 bg-amber-50 rounded-2xl p-4">
                    <Loader2 className="animate-spin text-amber-500 shrink-0" size={20} />
                    <p className="text-sm font-medium text-amber-800">{statusMessage}</p>
                  </div>
                )}

                {/* Cancelled */}
                {isCancelled && (
                  <div className="flex items-center gap-3 bg-red-50 rounded-2xl p-4">
                    <XCircle className="text-red-500 shrink-0" size={20} />
                    <p className="text-sm font-medium text-red-700">{statusMessage}</p>
                  </div>
                )}
              </div>

              {/* Live indicator */}
              {!TERMINAL_STATUSES.has(order.status) && !isAwaitingPayment && (
                <div className="px-6 md:px-8 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <p className="text-[11px] text-gray-400 font-medium">Actualizacion en vivo</p>
                </div>
              )}
            </div>

            {/* ── Details section ────────────────────────────────────── */}
            <div
              className={cn(
                'opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]',
                detailsLayout === 'desktop' ? 'grid grid-cols-3 gap-4' : 'space-y-3',
              )}
              style={{ animationDelay: '0.15s' }}
            >
              {/* Items card — first on BOTH mobile and desktop */}
              <div className={cn(detailsLayout === 'desktop' ? 'col-span-2' : '')}>
                <div className={cn(
                  'bg-white rounded-2xl shadow-sm overflow-hidden',
                  detailsLayout === 'desktop' && 'h-full flex flex-col',
                )}>
                  <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between shrink-0">
                    <h2 className="font-bold text-gray-900 text-sm">Items del pedido</h2>
                    <span className="text-xs text-gray-400">{order.items.length} items</span>
                  </div>
                  <div className={cn(
                    'divide-y divide-gray-50',
                    detailsLayout === 'desktop' ? 'flex-1 overflow-auto' : '',
                  )}>
                    {order.items.map((item: OrderItem) => {
                      const status = ITEM_STATUS[item.status];
                      return (
                        <div key={item.id} className={cn('flex gap-3', isMobile ? 'px-4 py-2.5' : 'px-5 py-3')}>
                          {item.productImage ? (
                            <div className={cn(
                              'relative rounded-xl overflow-hidden bg-gray-100 shrink-0',
                              isMobile ? 'w-12 h-12' : 'w-14 h-14',
                            )}>
                              <Image src={item.productImage} alt={item.productName ?? ''} fill className="object-cover" />
                            </div>
                          ) : (
                            <div className={cn(
                              'rounded-xl bg-gray-100 flex items-center justify-center shrink-0',
                              isMobile ? 'w-12 h-12' : 'w-14 h-14',
                            )}>
                              <Package size={16} className="text-gray-300" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={cn('text-gray-800 truncate', isMobile ? 'text-sm' : 'text-base')}>
                                <span className="font-bold">{item.quantity}x</span>{' '}
                                {item.productName ?? 'Producto'}
                              </p>
                              <p className={cn('font-bold text-gray-900 shrink-0 tabular-nums', isMobile ? 'text-sm' : 'text-base')}>
                                {formatPrice(item.unitPrice * item.quantity)}
                              </p>
                            </div>
                            {item.comment && (
                              <p className="text-xs text-gray-400 italic mt-0.5 truncate">
                                &quot;{item.comment}&quot;
                              </p>
                            )}
                            {status && (
                              <Badge className={cn('text-[10px] font-medium h-5 mt-1 border-0', status.color)}>
                                {status.label}
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Total */}
                  <div className="px-5 py-3.5 bg-gray-50 flex justify-between items-center border-t border-gray-100 shrink-0">
                    <span className="text-sm text-gray-500 font-medium">Total</span>
                    <span className={cn('font-black text-gray-900', isMobile ? 'text-lg' : 'text-xl')}>
                      {formatPrice(order.total ?? 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Info column: customer + payment */}
              <div className={cn(
                detailsLayout === 'desktop'
                  ? 'col-span-1 flex flex-col gap-4'
                  : hasCustomerInfo
                    ? 'grid grid-cols-2 gap-3'
                    : '',
              )}>
                {/* Customer info */}
                {hasCustomerInfo && (
                  <div className="bg-white rounded-2xl shadow-sm p-4 space-y-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Cliente</p>
                    {order.guestName && (
                      <div className="flex items-center gap-2">
                        <User size={13} className="text-gray-400 shrink-0" />
                        <span className="text-sm text-gray-700 truncate">{order.guestName}</span>
                      </div>
                    )}
                    {order.guestEmail && (
                      <div className="flex items-center gap-2">
                        <Mail size={13} className="text-gray-400 shrink-0" />
                        <span className="text-sm text-gray-700 truncate">{order.guestEmail}</span>
                      </div>
                    )}
                    {order.guestPhone && (
                      <div className="flex items-center gap-2">
                        <Phone size={13} className="text-gray-400 shrink-0" />
                        <span className="text-sm text-gray-700">{order.guestPhone}</span>
                      </div>
                    )}
                    {order.table && (
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-gray-400 shrink-0" />
                        <span className="text-sm text-gray-700">Mesa #{order.table.tableNumber}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Payment info */}
                <div className={cn(
                  'bg-white rounded-2xl shadow-sm p-4 space-y-2',
                  detailsLayout === 'desktop' && 'flex-1',
                )}>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pago</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard size={13} className="text-gray-400 shrink-0" />
                      <span className="text-sm text-gray-700">{paymentMethod}</span>
                    </div>
                    {paymentStatus && (
                      <span className={cn('text-xs font-semibold', paymentStatus.color)}>
                        {paymentStatus.label}
                      </span>
                    )}
                  </div>
                  {order.transaction?.externalId && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 shrink-0 w-3.5" />
                      <span className="text-xs text-gray-400 font-mono">Tx: {order.transaction.externalId}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
