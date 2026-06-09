'use client';

import { useState, useEffect } from 'react';
import { Drawer } from 'vaul';
import { useCartStore } from '@/stores/cart-store';
import { useRestaurant } from '@/providers/restaurant-provider';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag, Pencil, X, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatPrice } from '@/lib/format';
import { getActiveOrdersForSlug, ActiveOrder } from '@/lib/guest-orders';
import { cn } from '@/lib/utils';
import { OrderTrackingTab } from '@/components/cart/OrderTrackingTab';
import { useIsMobile } from '@/hooks/useIsMobile';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DrawerWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function DrawerWrapper({ isOpen, onClose, children }: DrawerWrapperProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer.Root
        open={isOpen}
        onOpenChange={(open) => { if (!open) onClose(); }}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-50 bg-black/60" />
          <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl flex flex-col h-[95dvh]">
            {/* Drag handle */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3 shrink-0" />
            {children}
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg p-0 flex flex-col gap-0 border-l [&>button]:hidden"
      >
        {children}
      </SheetContent>
    </Sheet>
  );
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const {
    items,
    updateQuantity,
    removeItem,
    updateComment,
    getTotal,
    getItemCount,
  } = useCartStore();
  const { basePath, slug } = useRestaurant();

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [commentDraft, setCommentDraft] = useState('');
  const [tab, setTab] = useState<'cart' | 'orders'>('cart');
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => { setHasMounted(true); }, []);

  const activeOrders: ActiveOrder[] = hasMounted && slug ? getActiveOrdersForSlug(slug) : [];
  const hasActiveOrders = activeOrders.length > 0;

  // Auto-switch tab when drawer opens
  useEffect(() => {
    if (!isOpen) return;
    if (items.length === 0 && hasActiveOrders) {
      setTab('orders');
    } else {
      setTab('cart');
    }
  }, [isOpen, items.length, hasActiveOrders]);

  const startEditComment = (productId: string, currentComment: string | undefined) => {
    setEditingCommentId(productId);
    setCommentDraft(currentComment ?? '');
  };

  const saveComment = (productId: string) => {
    updateComment(productId, commentDraft);
    setEditingCommentId(null);
  };

  const drawerContent = (
    <>
      {/* Accessible title for screen readers (always present) */}
      <SheetHeader className="sr-only">
        <SheetTitle>{hasActiveOrders ? 'Tu Actividad' : 'Tu Carrito'}</SheetTitle>
      </SheetHeader>

      {/* Visible header — tabs when has active orders, plain title otherwise */}
      {hasActiveOrders ? (
        <div className="px-6 py-4 border-b shrink-0" role="presentation">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Tu Actividad</h2>
            <button
              onClick={onClose}
              className="p-1.5 -mr-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Cerrar"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setTab('cart')}
              className={cn(
                'flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200',
                tab === 'cart'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              Carrito
              {getItemCount() > 0 && (
                <span
                  className={cn(
                    'ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                    tab === 'cart'
                      ? 'bg-(--color-primary) text-white'
                      : 'bg-gray-200 text-gray-600'
                  )}
                >
                  {getItemCount()}
                </span>
              )}
            </button>
            <button
              onClick={() => setTab('orders')}
              className={cn(
                'flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-1.5',
                tab === 'orders'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              Mi Pedido
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </button>
          </div>
        </div>
      ) : (
        <div className="px-6 py-5 border-b flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold flex items-center gap-2.5">
            Tu Carrito
            {getItemCount() > 0 && (
              <span className="bg-(--color-primary) text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                {getItemCount()}
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 -mr-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Cerrar carrito"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>
      )}

      {/* Content area */}
      <div className="flex-1 overflow-hidden">
        {tab === 'cart' ? (
          /* Cart tab */
          items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="bg-muted p-8 rounded-full mb-4">
                <ShoppingBag size={56} className="text-muted-foreground/40" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Tu carrito está vacío</h3>
              <p className="text-muted-foreground mb-6">¿Hambre? ¡Agrega algo delicioso!</p>
              <Button
                onClick={onClose}
                className="rounded-full bg-(--color-primary) hover:bg-(--color-primary) text-white opacity-90 hover:opacity-100 px-8"
              >
                Volver al menú
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-full px-4">
              <div className="py-4 space-y-4">
                {items.map((item) => {
                  if (item.isLoyaltyReward) {
                    return (
                      <div key={item.product.id} className="bg-amber-50 border border-amber-100 rounded-2xl p-3">
                        <div className="flex gap-4">
                          {/* Reward image or icon placeholder */}
                          <div className="relative h-24 w-24 shrink-0">
                            {item.product.imageUrl ? (
                              <Image
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                fill
                                className="object-cover rounded-xl ring-1 ring-amber-100"
                              />
                            ) : (
                              <div className="h-full w-full bg-amber-100 rounded-xl ring-1 ring-amber-200 flex items-center justify-center">
                                <Star size={28} className="text-amber-400 fill-amber-300" />
                              </div>
                            )}
                            {/* Reward badge over image */}
                            <span className="absolute -top-2 -left-2 bg-amber-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-tight">
                              Reward
                            </span>
                          </div>

                          {/* Reward details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1.5">
                              <h4 className="text-base font-bold text-amber-900 truncate pr-2">
                                {item.product.name}
                              </h4>
                              <button
                                onClick={() => removeItem(item.product.id)}
                                className="text-amber-400 hover:text-red-500 transition-colors shrink-0"
                                aria-label="Eliminar recompensa"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>

                            <p className="text-xs text-amber-700 mb-3">
                              {(item.pointsCost ?? 0)} pts c/u
                            </p>

                            {/* Quantity + cost row */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 bg-amber-100 rounded-full p-1 border border-amber-200">
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  className="p-1.5 hover:bg-amber-200 rounded-full transition-colors"
                                  aria-label="Disminuir cantidad"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="font-semibold text-base min-w-3.5 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  className="p-1.5 hover:bg-amber-200 rounded-full transition-colors"
                                  aria-label="Aumentar cantidad"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-amber-600 font-semibold">
                                  {(item.pointsCost ?? 0) * item.quantity} pts
                                </p>
                                <span className="font-bold text-base text-amber-700">
                                  Gratis
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={item.product.id} className="bg-gray-50/50 rounded-2xl p-3">
                      <div className="flex gap-4">
                        {/* Product image */}
                        <div className="relative h-24 w-24 shrink-0">
                          {item.product.imageUrl ? (
                            <Image
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              fill
                              className="object-cover rounded-xl ring-1 ring-gray-100"
                            />
                          ) : (
                            <div className="h-full w-full bg-muted rounded-xl ring-1 ring-gray-100 flex items-center justify-center text-muted-foreground text-xs">
                              Sin imagen
                            </div>
                          )}
                        </div>

                        {/* Product details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1.5">
                            <h4 className="text-base font-bold text-foreground truncate pr-2">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="text-muted-foreground hover:text-red-500 transition-colors shrink-0"
                              aria-label="Eliminar producto"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {/* Comment section */}
                          {editingCommentId === item.product.id ? (
                            <textarea
                              autoFocus
                              value={commentDraft}
                              onChange={(e) => setCommentDraft(e.target.value)}
                              onBlur={() => saveComment(item.product.id)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  saveComment(item.product.id);
                                }
                                if (e.key === 'Escape') {
                                  setEditingCommentId(null);
                                }
                              }}
                              placeholder="Agrega una nota..."
                              rows={2}
                              className="w-full text-xs text-muted-foreground border border-border rounded-md px-2 py-1 mb-2.5 resize-none focus:outline-none focus:ring-1 focus:ring-(--color-primary) bg-background"
                            />
                          ) : (
                            <div className="flex items-start gap-1 mb-2.5 min-h-5">
                              {item.comment && (
                                <p className="text-xs text-muted-foreground italic line-clamp-1 flex-1">
                                  &quot;{item.comment}&quot;
                                </p>
                              )}
                              <button
                                onClick={() => startEditComment(item.product.id, item.comment)}
                                className="text-muted-foreground/60 hover:text-(--color-primary) transition-colors shrink-0"
                                aria-label="Editar comentario"
                              >
                                <Pencil size={12} />
                              </button>
                            </div>
                          )}

                          {/* Quantity + price row */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 bg-muted rounded-full p-1 border">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="p-1.5 hover:bg-muted/80 rounded-full transition-colors"
                                aria-label="Disminuir cantidad"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="font-semibold text-base min-w-3.5 text-center transition-all duration-200">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="p-1.5 hover:bg-muted/80 rounded-full transition-colors"
                                aria-label="Aumentar cantidad"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">
                                {formatPrice(item.product.price)} c/u
                              </p>
                              <span className="font-bold text-lg">
                                {formatPrice(item.product.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )
        ) : (
          /* Orders tab */
          slug && (
            <OrderTrackingTab
              activeOrders={activeOrders}
              slug={slug}
              basePath={basePath}
              onClose={onClose}
            />
          )
        )}
      </div>

      {/* Footer — only for cart tab when cart has items */}
      {tab === 'cart' && items.length > 0 && (
        <div className="relative shrink-0">
          {/* Gradient shadow at top of footer */}
          <div className="absolute -top-6 left-0 right-0 h-6 bg-linear-to-t from-white to-transparent pointer-events-none" />
          <div className="p-5 border-t bg-white">
            <div className="space-y-3 w-full">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-2xl font-black">{formatPrice(getTotal())}</span>
              </div>
              <Link href={`${basePath}/checkout`} className="w-full block">
                <Button
                  className="w-full h-14 rounded-full bg-(--color-primary) hover:bg-(--color-primary) text-white opacity-90 hover:opacity-100 text-base font-bold shadow-lg"
                  onClick={onClose}
                >
                  Continuar al pago
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <DrawerWrapper isOpen={isOpen} onClose={onClose}>
      {drawerContent}
    </DrawerWrapper>
  );
}
