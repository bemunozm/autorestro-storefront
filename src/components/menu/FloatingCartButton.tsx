'use client';

import { useCartStore } from '@/stores/cart-store';
import { ShoppingCart } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { formatPrice } from '@/lib/format';

export function FloatingCartButton() {
  const itemCount = useCartStore((state) => state.getItemCount());
  const total = useCartStore((state) => state.getTotal());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const prevCount = useRef(itemCount);

  useEffect(() => {
    if (itemCount > prevCount.current) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 600);
      return () => clearTimeout(timer);
    }
    prevCount.current = itemCount;
  }, [itemCount]);

  if (itemCount === 0) return null;

  return (
    <>
      <button
        onClick={() => setIsDrawerOpen(true)}
        className={[
          'fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-6 z-50',
          'bg-(--color-primary) text-white p-4 rounded-full shadow-2xl',
          'flex items-center gap-3',
          'hover:scale-105 active:scale-95 transition-all',
          'animate-in fade-in slide-in-from-bottom-4',
          isPulsing ? 'scale-110' : '',
        ].join(' ')}
      >
        <div className="relative">
          <ShoppingCart size={24} />
          <span className="absolute -top-2 -right-2 bg-white text-(--color-primary) text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-(--color-primary)">
            {itemCount}
          </span>
        </div>
        <div className="flex flex-col items-start leading-none pr-1">
          <span className="text-[10px] uppercase font-bold opacity-80">Ver pedido</span>
          <span className="text-sm font-bold">{formatPrice(total)}</span>
        </div>
      </button>

      <CartDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
