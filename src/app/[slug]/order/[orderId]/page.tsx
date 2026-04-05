'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRestaurant } from '@/providers/restaurant-provider';
import { useOrderSocket } from '@/hooks/useOrderSocket';
import api from '@/lib/api';
import { Order, OrderItem } from '@/types/order';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, ChefHat, Package, XCircle, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const STATUS_CONFIG = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  in_progress: { label: 'En progreso', color: 'bg-blue-100 text-blue-700', icon: ChefHat },
  completed: { label: 'Completado', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-700', icon: XCircle },
};

const ITEM_STATUS_CONFIG = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  in_preparation: { label: 'Preparando', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  ready: { label: 'Listo', color: 'bg-green-100 text-green-700 border-green-200' },
  delivered: { label: 'Entregado', color: 'bg-gray-100 text-gray-700 border-gray-200' },
};

const STEPS = [
  { status: 'pending', label: 'Pedido recibido' },
  { status: 'in_progress', label: 'En preparación' },
  { status: 'ready', label: 'Listo' },
  { status: 'completed', label: 'Entregado / Listo' },
];

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const router = useRouter();
  const { restaurant } = useRestaurant();
  const { updates } = useOrderSocket(restaurant?.id);
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => api.get<Order>(`/storefront/${params.slug}/orders/${orderId}`).then(r => r.data),
    staleTime: 5 * 1000,
  });

  useEffect(() => {
    if (updates.length > 0) {
      const lastUpdate = updates[updates.length - 1];
      if (lastUpdate.orderId === orderId) {
        queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      }
    }
  }, [updates, orderId, queryClient]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-gray-500">Pedido no encontrado.</p>
      </div>
    );
  }

  const currentStepIndex = order.status === 'cancelled' 
    ? -1 
    : order.status === 'completed' 
      ? 3 
      : order.status === 'pending' 
        ? 0 
        : order.items.some(i => i.status === 'ready' || i.status === 'delivered') ? 2 : 1;

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Seguimiento de Pedido</h1>
            <p className="text-gray-500 mt-0.5 text-sm">ID: #{orderId.slice(-6).toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 border border-green-200 rounded-full px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            En vivo
          </div>
        </header>

        {/* Stepper */}
        <Card className="shadow-sm border-none rounded-2xl p-6">
          <div className="relative flex justify-between items-start">
            {/* Líneas de conexión entre pasos — generadas flexiblemente */}
            <div className="absolute top-5 left-0 right-0 flex items-center px-5 -z-0 pointer-events-none">
              {STEPS.slice(0, -1).map((_, idx) => (
                <div
                  key={idx}
                  className="flex-1 h-0.5 transition-colors duration-500"
                  style={{ backgroundColor: idx < currentStepIndex ? 'var(--color-primary)' : '#e5e7eb' }}
                />
              ))}
            </div>

            {STEPS.map((step, idx) => {
              const StepIcons = [Clock, ChefHat, Package, CheckCircle2];
              const Icon = StepIcons[idx];
              const isComplete = idx < currentStepIndex;
              const isActive = idx === currentStepIndex;
              return (
                <div key={step.status} className="flex flex-col items-center relative z-10 w-1/4">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                      isComplete || isActive
                        ? "text-white shadow-md border-transparent"
                        : "bg-white text-gray-400 border-gray-200"
                    )}
                    style={{ backgroundColor: isComplete || isActive ? 'var(--color-primary)' : '' }}
                  >
                    {isComplete ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span className={cn(
                    "text-[10px] mt-2 font-semibold text-center leading-tight px-1",
                    isComplete || isActive ? "text-gray-900" : "text-gray-400"
                  )}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Order Details */}
        <Card className="shadow-sm border-none rounded-2xl overflow-hidden">
          <CardHeader className="bg-white border-b flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Tu Pedido</CardTitle>
            <Badge className={cn("px-3 py-1", STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]?.color)}>
              {STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]?.label}
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {order.items.map((item: OrderItem) => (
                <div key={item.id} className="p-4 flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{item.quantity}x</span>
                      <p className="font-medium text-gray-800">{item.productName || 'Producto'}</p>
                    </div>
                    {item.comment && <p className="text-xs text-gray-500 italic">&quot;{item.comment}&quot;</p>}
                    <Badge variant="outline" className={cn("text-[10px] font-medium h-5", ITEM_STATUS_CONFIG[item.status as keyof typeof ITEM_STATUS_CONFIG]?.color)}>
                      {ITEM_STATUS_CONFIG[item.status as keyof typeof ITEM_STATUS_CONFIG]?.label}
                    </Badge>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ${(item.price * item.quantity).toLocaleString('es-CL')}
                  </p>
                </div>
              ))}
            </div>
            <div className="p-4 bg-gray-50 flex justify-between items-center">
              <span className="text-gray-600 font-medium">Total</span>
              <span className="text-xl font-bold text-gray-900">
                ${(order.total || 0).toLocaleString('es-CL')}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
