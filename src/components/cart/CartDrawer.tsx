'use client';

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
import { Minus, Plus, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, getTotal, getItemCount } = useCartStore();
  const { slug } = useRestaurant();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col gap-0 border-l">
        <SheetHeader className="p-6 border-b flex flex-row items-center justify-between space-y-0">
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            Tu Carrito
            {getItemCount() > 0 && (
              <span className="bg-[var(--color-primary)] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {getItemCount()}
              </span>
            )}
          </SheetTitle>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </SheetHeader>

        <div className="flex-1 overflow-hidden">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="bg-gray-50 p-6 rounded-full mb-4">
                <Trash2 size={48} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Tu carrito está vacío</h3>
              <p className="text-gray-500 mb-6">¿Hambre? ¡Agrega algo delicioso!</p>
              <Button 
                onClick={onClose}
                className="rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)] opacity-90 hover:opacity-100 px-8"
              >
                Volver al menú
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-full px-6">
              <div className="py-6 space-y-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0">
                      {item.product.imageUrl ? (
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-gray-900 truncate pr-2">
                          {item.product.name}
                        </h4>
                        <button 
                          onClick={() => removeItem(item.product.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      {item.comment && (
                        <p className="text-xs text-gray-500 italic line-clamp-1 mb-2">
                          &quot;{item.comment}&quot;
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-gray-50 rounded-full p-1 border">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-semibold text-sm min-w-[14px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="font-bold text-sm">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="p-6 border-t bg-gray-50 sm:flex-col sm:space-x-0">
            <div className="space-y-4 w-full">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-xl font-bold">{formatPrice(getTotal())}</span>
              </div>
              <Link href={`/${slug}/checkout`} passHref className="w-full">
                <Button 
                  className="w-full h-12 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)] opacity-90 hover:opacity-100 text-lg font-bold shadow-lg"
                  onClick={onClose}
                >
                  Ir a pagar
                </Button>
              </Link>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
