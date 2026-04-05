'use client';

import React from 'react';
import Link from 'next/link';
import { useOrders } from '@/hooks/useOrders';
import { useRestaurant } from '@/providers/restaurant-provider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag, ChevronRight, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Order } from '@/types/order';

const STATUS_CONFIG = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' },
  in_progress: { label: 'En progreso', color: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Completado', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-700' },
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(price);

function getDateGroup(dateStr: string): 'Hoy' | 'Esta semana' | 'Anteriores' {
  const now = new Date();
  const date = new Date(dateStr);

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());

  if (date >= startOfToday) return 'Hoy';
  if (date >= startOfWeek) return 'Esta semana';
  return 'Anteriores';
}

function OrderCardSkeleton() {
  return (
    <Card className="shadow-sm border-none rounded-2xl">
      <CardContent className="p-4 flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>
          <Skeleton className="h-3 w-36 rounded-md" />
          <div className="flex justify-between pt-1">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-3 w-12 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-5 w-5 rounded-sm flex-shrink-0" />
      </CardContent>
    </Card>
  );
}

export default function OrdersPage() {
  const { basePath } = useRestaurant();
  const { data: orders, isLoading } = useOrders();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 pb-20">
        <div className="max-w-2xl mx-auto space-y-6">
          <header className="flex items-center justify-between">
            <Skeleton className="h-8 w-36 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </header>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <OrderCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const sortedOrders = orders ? [...orders].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ) : [];

  const grouped: Record<string, Order[]> = { 'Hoy': [], 'Esta semana': [], 'Anteriores': [] };
  for (const order of sortedOrders) {
    grouped[getDateGroup(order.createdAt)].push(order);
  }

  const groupLabels = ['Hoy', 'Esta semana', 'Anteriores'] as const;

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Mis Pedidos</h1>
          <Link href={`${basePath}/menu`}>
            <Button variant="ghost" className="text-gray-500 hover:text-gray-700">
              Ir al Menú
            </Button>
          </Link>
        </header>

        {sortedOrders.length === 0 ? (
          <Card className="shadow-sm border-none rounded-2xl p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No tienes pedidos aún</h2>
            <p className="text-gray-500 mb-6 max-w-xs">¡Explora nuestro menú y realiza tu primer pedido!</p>
            <Link href={`${basePath}/menu`}>
              <Button className="rounded-xl px-8" style={{ backgroundColor: 'var(--color-primary)' }}>
                Explorar Menú
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {groupLabels.map((group) => {
              const groupOrders = grouped[group];
              if (groupOrders.length === 0) return null;
              return (
                <div key={group} className="space-y-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-1">{group}</p>
                  {groupOrders.map((order: Order) => (
                    <Link key={order.id} href={`${basePath}/order/${order.id}`}>
                      <Card className="shadow-sm border-none rounded-2xl hover:shadow-md transition-shadow duration-200">
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border">
                            <ShoppingBag className="h-6 w-6 text-gray-400" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="font-bold text-gray-900 capitalize">
                                {order.type === 'dine_in' ? 'En el local' : order.type === 'pickup' ? 'Para retirar' : 'Delivery'}
                              </p>
                              <p className="font-bold text-gray-900">
                                {formatPrice(order.total || 0)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(order.createdAt).toLocaleDateString('es-CL', {
                                day: '2-digit',
                                month: 'long',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}</span>
                            </div>
                            <div className="flex items-center justify-between pt-1">
                              <Badge className={cn("text-[10px] font-medium h-5", STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]?.color)}>
                                {STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]?.label}
                              </Badge>
                              <p className="text-[10px] text-gray-400">{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-300" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
