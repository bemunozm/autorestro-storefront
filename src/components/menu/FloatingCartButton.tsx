'use client';

import { useCartStore } from '@/stores/cart-store';
import { ShoppingCart } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { formatPrice } from '@/lib/format';

export function FloatingCartButton() {
  const itemCount = useCartStore((state) => state.getItemCount());
  const total = useCartStore((state) => state.getTotal());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const prevCount = useRef(itemCount);
  const pathname = usePathname();

  useEffect(() => { setHasMounted(true); }, []);

  useEffect(() => {
    if (itemCount > prevCount.current) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 600);
      return () => clearTimeout(timer);
    }
    prevCount.current = itemCount;
  }, [itemCount]);

  if (!hasMounted) return null;
  if (pathname?.includes('/checkout')) return null;
  if (pathname?.includes('/auth/')) return null;

  const isEmpty = itemCount === 0;

  return (
    <>
      {/* Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 mb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        {isEmpty ? (
          /* Empty: subtle icon-only pill */
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="ml-auto flex items-center justify-center w-14 h-14 rounded-full bg-primary/80 text-white shadow-lg active:scale-95 transition-all float-right"
          >
            <ShoppingCart size={22} />
          </button>
        ) : (
          /* With items: full-width bar */
          <button
            onClick={() => setIsDrawerOpen(true)}
            className={[
              'w-full h-14 rounded-2xl',
              'bg-(--color-primary) text-white shadow-2xl',
              'flex items-center justify-between px-4',
              'active:scale-[0.98] transition-all',
              isPulsing ? 'scale-[1.02]' : '',
            ].join(' ')}
          >
            <div className="relative shrink-0">
              <ShoppingCart size={22} />
              <span className="absolute -top-2 -right-2 bg-white text-(--color-primary) text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-(--color-primary)">
                {itemCount}
              </span>
            </div>
            <span className="text-sm font-bold tracking-wide">Ver pedido</span>
            <span className="text-sm font-bold shrink-0">{formatPrice(total)}</span>
          </button>
        )}
      </div>

      {/* Desktop */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className={[
          'hidden lg:flex',
          'fixed bottom-6 right-6 z-50',
          'bg-(--color-primary) text-white rounded-full',
          'shadow-[0_8px_32px_rgba(0,0,0,0.25)]',
          'items-center',
          'hover:scale-105 active:scale-95 transition-all',
          isEmpty ? 'w-14 h-14 justify-center' : 'px-5 py-3 gap-3',
          isPulsing ? 'scale-110' : '',
        ].join(' ')}
      >
        {isEmpty ? (
          <ShoppingCart size={22} />
        ) : (
          <>
            <div className="relative">
              <ShoppingCart size={22} />
              <span className="absolute -top-2 -right-2 bg-white text-(--color-primary) text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-(--color-primary)">
                {itemCount}
              </span>
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-[10px] uppercase font-bold opacity-80">Ver pedido</span>
              <span className="text-sm font-bold">{formatPrice(total)}</span>
            </div>
          </>
        )}
      </button>

      <CartDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
