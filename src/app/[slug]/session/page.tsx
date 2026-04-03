'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useRestaurant } from '@/providers/restaurant-provider';
import { useDineInMode } from '@/hooks/useDineInMode';
import api from '@/lib/api';
import { io, Socket } from 'socket.io-client';
import { 
  Loader2, 
  Users, 
  ShoppingBag, 
  Bell, 
  UtensilsCrossed, 
  ChevronRight, 
  Clock,
  CheckCircle2,
  ChefHat,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Image from 'next/image';

interface Guest {
  id: string;
  name: string;
}

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  price: number;
}

interface Order {
  id: string;
  guestId: string;
  guestName: string;
  items: OrderItem[];
  createdAt: string;
}

interface SessionData {
  id: string;
  tableId: string;
  guests: Guest[];
  orders: Order[];
}

export default function SessionPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { isDineIn, sessionId, tableId } = useDineInMode();
  const { token } = useAuthStore();
  const { restaurant, basePath } = useRestaurant();

  const [session, setSession] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setSocket] = useState<Socket | null>(null);
  const [assistanceModalOpen, setAssistanceModalOpen] = useState(false);
  const [isRequestingAssistance, setIsRequestingAssistance] = useState(false);

  const fetchSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/storefront/${slug}/sessions/${sessionId}`);
      setSession(res.data);
    } catch (error) {
      console.error('Error fetching session:', error);
    } finally {
      setIsLoading(false);
    }
  }, [slug, sessionId]);

  useEffect(() => {
    if (!isDineIn) {
      router.push(basePath || '/');
      return;
    }
    fetchSession();
  }, [isDineIn, sessionId, router, basePath, fetchSession]);

  useEffect(() => {
    if (!token || !sessionId) return;

    const s = io(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/orders`, {
      auth: { token },
      transports: ['websocket'],
    });

    s.on('connect', () => {
      s.emit('join:session', { sessionId });
    });

    s.on('order:new', (newOrder: Order) => {
      setSession(prev => {
        if (!prev) return null;
        return { ...prev, orders: [newOrder, ...prev.orders] };
      });
    });

    s.on('order:item:updated', (data: { orderId: string, itemId: string, status: OrderItem['status'] }) => {
      setSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          orders: prev.orders.map(order => {
            if (order.id !== data.orderId) return order;
            return {
              ...order,
              items: order.items.map(item => {
                if (item.id !== data.itemId) return item;
                return { ...item, status: data.status };
              })
            };
          })
        };
      });
    });

    s.on('session:closed', () => {
      router.push(`${basePath}/session-finished`);
    });

    setSocket(s);
    return () => { s.disconnect(); };
  }, [token, sessionId, basePath, router]);

  const handleRequestAssistance = async (type: string) => {
    try {
      setIsRequestingAssistance(true);
      await api.post(`/storefront/${slug}/assistance`, { sessionId, tableId, type });
      setAssistanceModalOpen(false);
    } catch (error) {
      console.error('Error requesting assistance:', error);
    } finally {
      setIsRequestingAssistance(false);
    }
  };

  const getStatusBadge = (status: OrderItem['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 gap-1.5"><Clock className="w-3 h-3" /> Pendiente</Badge>;
      case 'preparing':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 gap-1.5"><ChefHat className="w-3 h-3" /> En preparación</Badge>;
      case 'ready':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 gap-1.5"><CheckCircle2 className="w-3 h-3" /> Listo</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      {/* Header */}
      <header className="bg-white border-b px-4 py-4 sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-sm overflow-hidden relative">
            {restaurant?.logoUrl ? (
              <Image src={restaurant.logoUrl} alt="" fill className="object-cover" />
            ) : (
              <UtensilsCrossed size={20} />
            )}
          </div>
          <div>
            <h1 className="font-bold text-lg">Mesa #{tableId}</h1>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Sessión Activa
            </div>
          </div>
        </div>
        <Badge variant="secondary" className="rounded-full px-3 py-1 flex items-center gap-1.5 font-bold">
          <Users size={14} />
          {session?.guests.length}
        </Badge>
      </header>

      <main className="p-4 max-w-2xl mx-auto">
        <Tabs defaultValue="pedidos" className="w-full">
          <TabsList className="w-full grid grid-cols-2 h-12 rounded-2xl p-1 bg-muted/50 mb-6">
            <TabsTrigger value="pedidos" className="rounded-xl font-bold transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="personas" className="rounded-xl font-bold transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Users className="w-4 h-4 mr-2" />
              Personas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pedidos" className="space-y-4">
            {session?.orders.length === 0 ? (
              <Card className="border-none bg-white/50 rounded-3xl p-8 text-center border-2 border-dashed border-muted">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag size={32} className="text-muted-foreground/30" />
                </div>
                <h3 className="text-lg font-bold text-muted-foreground mb-2">Aún no hay pedidos</h3>
                <p className="text-sm text-muted-foreground mb-6">Explora el menú y haz el primer pedido de la mesa.</p>
                <Button onClick={() => router.push(`${basePath}/menu`)} className="rounded-xl h-11 px-8 font-bold">
                  Ver Menú
                </Button>
              </Card>
            ) : (
              session?.orders.map((order) => (
                <Card key={order.id} className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                  <div className="px-4 py-3 bg-muted/20 border-b flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-[10px] font-bold">
                        {order.guestName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-sm">{order.guestName}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <CardContent className="p-0">
                    <div className="divide-y divide-muted/50">
                      {order.items.map((item) => (
                        <div key={item.id} className="p-4 flex items-start gap-3">
                          <div className="bg-muted w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0">
                            {item.quantity}x
                          </div>
                          <div className="flex-1 min-w-0 space-y-2">
                            <h4 className="text-sm font-bold truncate">{item.productName}</h4>
                            <div className="flex justify-between items-center">
                              {getStatusBadge(item.status)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="personas" className="space-y-3">
            {session?.guests.map((guest) => (
              <div key={guest.id} className="bg-white rounded-2xl p-4 flex items-center justify-between border-none shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {guest.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{guest.name}</p>
                    <p className="text-[10px] text-muted-foreground">En la mesa</p>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500" />
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </main>

      {/* Floating Assistance Button */}
      <div className="fixed bottom-24 right-4 z-40">
        <Dialog open={assistanceModalOpen} onOpenChange={setAssistanceModalOpen}>
          <DialogTrigger asChild>
            <Button size="icon" className="w-14 h-14 rounded-full shadow-2xl animate-pulse ring-4 ring-primary/20">
              <Bell size={24} className="animate-bounce" />
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl max-w-[90vw]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Solicitar Asistencia</DialogTitle>
              <DialogDescription>
                ¿En qué podemos ayudarte? Notificaremos al personal de inmediato.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-4">
              <Button 
                variant="outline" 
                className="h-16 rounded-2xl justify-between px-6 text-base font-bold border-2 hover:border-primary hover:bg-primary/5 group"
                onClick={() => handleRequestAssistance('waiter')}
                disabled={isRequestingAssistance}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Llamar al garzón
                </div>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                className="h-16 rounded-2xl justify-between px-6 text-base font-bold border-2 hover:border-primary hover:bg-primary/5 group"
                onClick={() => handleRequestAssistance('bill')}
                disabled={isRequestingAssistance}
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  Pedir la cuenta
                </div>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-2 flex items-center justify-between z-40 pb-safe">
        <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2 px-0 w-20 text-muted-foreground hover:text-primary hover:bg-transparent" onClick={() => router.push(`${basePath}/menu`)}>
          <UtensilsCrossed size={20} />
          <span className="text-[10px] font-bold">Menú</span>
        </Button>
        <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2 px-0 w-20 text-primary hover:bg-transparent font-bold">
          <ShoppingBag size={20} />
          <span className="text-[10px]">Pedidos</span>
          <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />
        </Button>
        <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2 px-0 w-20 text-muted-foreground hover:text-primary hover:bg-transparent" onClick={() => router.push(`${basePath}/checkout`)}>
          <ShoppingBag size={20} />
          <span className="text-[10px] font-bold">Carrito</span>
        </Button>
      </nav>
    </div>
  );
}
