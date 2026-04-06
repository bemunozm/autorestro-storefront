'use client';

import { useState } from 'react';
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
import { Minus, Plus, Trash2, ShoppingBag, Pencil, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatPrice } from '@/lib/format';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
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
  const { basePath } = useRestaurant();

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [commentDraft, setCommentDraft] = useState('');

  const startEditComment = (productId: string, currentComment: string | undefined) => {
    setEditingCommentId(productId);
    setCommentDraft(currentComment ?? '');
  };

  const saveComment = (productId: string) => {
    updateComment(productId, commentDraft);
    setEditingCommentId(null);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col gap-0 border-l [&>button]:hidden">
        <SheetHeader className="px-6 py-5 border-b flex flex-row items-center justify-between space-y-0">
          <SheetTitle className="text-lg font-bold flex items-center gap-2.5">
            Tu Carrito
            {getItemCount() > 0 && (
              <span className="bg-(--color-primary) text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                {getItemCount()}
              </span>
            )}
          </SheetTitle>
          <button onClick={onClose} className="p-1.5 -mr-1.5 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Cerrar carrito">
            <X size={20} className="text-gray-400" />
          </button>
        </SheetHeader>

        <div className="flex-1 overflow-hidden">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="bg-muted p-6 rounded-full mb-4">
                <ShoppingBag size={48} className="text-muted-foreground/40" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Tu carrito está vacío</h3>
              <p className="text-muted-foreground mb-6">¿Hambre? ¡Agrega algo delicioso!</p>
              <Button
                onClick={onClose}
                className="rounded-full bg-(--color-primary) hover:bg-(--color-primary) opacity-90 hover:opacity-100 px-8"
              >
                Volver al menú
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-full px-6">
              <div className="py-6 space-y-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="relative h-20 w-20 shrink-0">
                      {item.product.imageUrl ? (
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      ) : (
                        <div className="h-full w-full bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-xs">
                          Sin imagen
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-foreground truncate pr-2">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-muted-foreground hover:text-red-500 transition-colors"
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
                          className="w-full text-xs text-muted-foreground border border-border rounded-md px-2 py-1 mb-2 resize-none focus:outline-none focus:ring-1 focus:ring-(--color-primary) bg-background"
                        />
                      ) : (
                        <div className="flex items-start gap-1 mb-2 min-h-5">
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

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-muted rounded-full p-1 border">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:bg-muted/80 rounded-full transition-colors"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-semibold text-sm min-w-3.5 text-center transition-all duration-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:bg-muted/80 rounded-full transition-colors"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            {formatPrice(item.product.price)} c/u
                          </p>
                          <span className="font-bold text-sm">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="p-5 border-t bg-white sm:flex-col sm:space-x-0">
            <div className="space-y-3 w-full">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-xl font-bold">{formatPrice(getTotal())}</span>
              </div>
              <Link href={`${basePath}/checkout`} className="w-full block">
                <Button
                  className="w-full h-12 rounded-full bg-(--color-primary) hover:bg-(--color-primary) opacity-90 hover:opacity-100 text-base font-bold shadow-lg"
                  onClick={onClose}
                >
                  Continuar al pago
                </Button>
              </Link>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
