'use client';

import React, { useEffect } from 'react';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/format';
import Link from 'next/link';
import Image from 'next/image';
import { clearActiveOrder, saveActiveOrder } from '@/lib/guest-orders';

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

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function GuestTrackingPage() {
  const params = useParams();
  const slug = params.slug as string;
  const orderId = params.orderId as string;
  const { basePath, restaurant } = useRestaurant();

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['guest-order', orderId],
    queryFn: () =>
      api.get<Order>(`/storefront/${slug}/orders/${orderId}`).then((r) => r.data),
    staleTime: 5_000,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return 10_000;
      return TERMINAL_STATUSES.has(data.status) ? false : 10_000;
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin h-8 w-8 text-gray-300" />
      </div>
    );
  }

  if (isError || !order) {
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

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">

        {/* Restaurant header */}
        <div className="flex items-center gap-3">
          {(restaurant?.logoUrl || order.restaurant?.logoUrl) && (
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-100 shrink-0">
              <Image
                src={restaurant?.logoUrl || order.restaurant?.logoUrl || ''}
                alt={restaurant?.name || order.restaurant?.name || ''}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Seguimiento</p>
            <p className="text-sm font-bold text-gray-900 truncate">
              {restaurant?.name || order.restaurant?.name}
            </p>
          </div>
        </div>

        {/* Order number + type badge */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Pedido</p>
              <p className="text-2xl font-black text-gray-900 font-mono tracking-wider leading-tight">
                #{orderNumber}
              </p>
              <p className="text-xs text-gray-400 mt-1">{formatDate(order.createdAt)}</p>
            </div>
            {orderType && (
              <div className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1.5 shrink-0">
                <orderType.icon size={13} className="text-gray-500" />
                <span className="text-xs font-semibold text-gray-600">{orderType.label}</span>
              </div>
            )}
          </div>
        </div>

        {/* Awaiting payment */}
        {isAwaitingPayment && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
            <Loader2 className="animate-spin text-amber-500 shrink-0" size={20} />
            <p className="text-sm font-medium text-amber-800">{statusMessage}</p>
          </div>
        )}

        {/* Stepper */}
        {!isAwaitingPayment && !isCancelled && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="relative flex justify-between items-start">
              {steps.map((step, idx) => {
                const isCurrent = idx === stepIndex;
                const isDone = idx < stepIndex;
                const isActive = idx <= stepIndex;
                const StepIcon = isDone ? CheckCircle2 : step.icon;
                return (
                  <div key={step.key} className="flex flex-col items-center relative z-10" style={{ width: `${100 / steps.length}%` }}>
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                        isCurrent
                          ? 'text-white shadow-md'
                          : isDone
                            ? 'text-white'
                            : 'bg-gray-100 text-gray-300 border border-gray-200',
                      )}
                      style={{
                        backgroundColor:
                          isActive ? 'var(--color-primary)' : undefined,
                        opacity: isDone && !isCurrent ? 0.6 : undefined,
                      }}
                    >
                      <StepIcon className="h-5 w-5" />
                    </div>
                    <span
                      className={cn(
                        'text-[10px] mt-2 font-semibold text-center leading-tight px-0.5',
                        isActive ? 'text-gray-800' : 'text-gray-400',
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
              {/* Progress line */}
              <div
                className="absolute top-5 h-0.5 bg-gray-100 rounded-full"
                style={{ width: '75%', left: '12.5%' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500 ease-in-out"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    width: `${Math.max(0, (stepIndex / (steps.length - 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>
            {statusMessage && (
              <p className="text-xs text-gray-400 text-center mt-4">{statusMessage}</p>
            )}
          </div>
        )}

        {/* Cancelled */}
        {isCancelled && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
            <XCircle className="text-red-500 shrink-0" size={20} />
            <p className="text-sm font-medium text-red-700">{statusMessage}</p>
          </div>
        )}

        {/* Order info: customer + payment */}
        <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
          {/* Customer info */}
          {(order.guestName || order.guestEmail || order.guestPhone || order.table) && (
            <div className="p-4 space-y-2.5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Cliente</p>
              {order.guestName && (
                <div className="flex items-center gap-2.5">
                  <User size={14} className="text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-700">{order.guestName}</span>
                </div>
              )}
              {order.guestEmail && (
                <div className="flex items-center gap-2.5">
                  <Mail size={14} className="text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-700">{order.guestEmail}</span>
                </div>
              )}
              {order.guestPhone && (
                <div className="flex items-center gap-2.5">
                  <Phone size={14} className="text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-700">{order.guestPhone}</span>
                </div>
              )}
              {order.table && (
                <div className="flex items-center gap-2.5">
                  <MapPin size={14} className="text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-700">Mesa #{order.table.tableNumber}</span>
                </div>
              )}
            </div>
          )}

          {/* Payment info */}
          <div className="p-4 space-y-2.5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pago</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CreditCard size={14} className="text-gray-400 shrink-0" />
                <span className="text-sm text-gray-700">{paymentMethod}</span>
              </div>
              {paymentStatus && (
                <span className={cn('text-xs font-semibold', paymentStatus.color)}>
                  {paymentStatus.label}
                </span>
              )}
            </div>
            {order.transaction?.externalId && (
              <div className="flex items-center gap-2.5">
                <span className="text-xs text-gray-400 shrink-0 w-3.5" />
                <span className="text-xs text-gray-400 font-mono">
                  Tx: {order.transaction.externalId}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 text-sm">Items del pedido</h2>
            <span className="text-xs text-gray-400">{order.items.length} items</span>
          </div>
          <div className="divide-y divide-gray-50">
            {order.items.map((item: OrderItem) => {
              const status = ITEM_STATUS[item.status];
              return (
                <div key={item.id} className="px-4 py-3 flex gap-3">
                  {item.productImage ? (
                    <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <Image
                        src={item.productImage}
                        alt={item.productName ?? ''}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <Package size={16} className="text-gray-300" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-gray-800 truncate">
                        <span className="font-bold">{item.quantity}x</span>{' '}
                        {item.productName ?? 'Producto'}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 shrink-0 tabular-nums">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                    {item.comment && (
                      <p className="text-xs text-gray-400 italic mt-0.5 truncate">
                        &quot;{item.comment}&quot;
                      </p>
                    )}
                    {status && (
                      <Badge className={cn('text-[10px] font-medium h-5 mt-1.5 border-0', status.color)}>
                        {status.label}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div className="px-4 py-3.5 bg-gray-50 flex justify-between items-center border-t border-gray-100">
            <span className="text-sm text-gray-500 font-medium">Total</span>
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(order.total ?? 0)}
            </span>
          </div>
        </div>

        {/* Polling notice */}
        {!TERMINAL_STATUSES.has(order.status) && !isAwaitingPayment && (
          <p className="text-center text-[11px] text-gray-400">
            Se actualiza automaticamente cada 10 segundos
          </p>
        )}

        {/* Back to menu */}
        <Link href={`${basePath}/menu`} className="block">
          <button className="w-full h-11 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-100 transition-colors text-sm">
            Volver al menu
          </button>
        </Link>
      </div>
    </div>
  );
}
