'use client';

import { useCartStore } from '@/stores/cart-store';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { CartDrawer } from '@/components/cart/CartDrawer';

export function FloatingCartButton() {
  const itemCount = useCartStore((state) => state.getItemCount());
  const total = useCartStore((state) => state.getTotal());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (itemCount === 0) return null;

  return (
    <>
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-[var(--color-primary)] text-white p-4 rounded-full shadow-2xl flex items-center gap-3 hover:scale-105 transition-all animate-in fade-in slide-in-from-bottom-4"
      >
        <div className="relative">
          <ShoppingCart size={24} />
          <span className="absolute -top-2 -right-2 bg-white text-[var(--color-primary)] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[var(--color-primary)]">
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
