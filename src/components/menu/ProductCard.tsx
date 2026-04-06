'use client';

import Image from 'next/image';
import { Product } from '@/types/menu';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ProductModal } from './ProductModal';
import { formatPrice } from '@/lib/format';
import { Check, Plus, UtensilsCrossed } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddedFeedback = () => {
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  // Mobile: quick-add directly to cart (no modal)
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
    handleAddedFeedback();
  };

  // Desktop: open modal to select quantity / comments
  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        className="flex gap-4 p-3.5 md:flex-col md:p-0 md:gap-0 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer group h-full md:hover:shadow-md md:transition-shadow md:duration-200"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Image */}
        <div className="w-24 h-24 rounded-xl shrink-0 overflow-hidden relative md:w-full md:h-auto md:rounded-none md:aspect-square">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover md:group-hover:scale-105 md:transition-transform md:duration-300"
            />
          ) : (
            <div className="h-full w-full bg-primary/8 flex items-center justify-center">
              <UtensilsCrossed className="text-primary/20" size={28} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col md:p-4 md:grow">
          <div className="flex-1">
            <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 md:text-base md:line-clamp-1 md:mb-1">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-xs text-gray-400 line-clamp-1 mt-0.5 md:text-sm md:text-gray-500 md:line-clamp-2 md:mb-3">
                {product.description}
              </p>
            )}
          </div>

          {/* Price row */}
          <div className="flex items-center justify-between mt-auto pt-2">
            <span className="text-base font-bold text-(--color-primary) md:text-lg md:font-black">
              {formatPrice(product.price)}
            </span>

            {/* Mobile: quick-add circle button */}
            <button
              aria-label="Agregar al carrito"
              onClick={handleQuickAdd}
              className={`md:hidden w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 ${
                justAdded
                  ? 'bg-green-500 text-white scale-110'
                  : 'bg-(--color-primary) text-white'
              }`}
            >
              {justAdded ? <Check size={16} /> : <Plus size={16} />}
            </button>

            {/* Desktop: "Agregar" button (opens modal) */}
            <Button
              size="sm"
              className={`hidden md:flex rounded-full transition-all duration-300 ${
                justAdded
                  ? 'bg-green-500 hover:bg-green-500 text-white gap-1'
                  : 'bg-(--color-primary) hover:bg-(--color-primary) text-white opacity-90 hover:opacity-100'
              }`}
              onClick={handleAdd}
            >
              {justAdded ? (
                <>
                  <Check size={14} />
                  Agregado!
                </>
              ) : (
                'Agregar'
              )}
            </Button>
          </div>
        </div>
      </div>

      <ProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdded={handleAddedFeedback}
      />
    </>
  );
}
