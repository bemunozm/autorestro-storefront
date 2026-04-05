'use client';

import Image from 'next/image';
import { Product } from '@/types/menu';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ProductModal } from './ProductModal';
import { formatPrice } from '@/lib/format';
import { Check, UtensilsCrossed } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleAddedFeedback = () => {
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <>
      <div
        className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full group"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative aspect-square w-full overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="h-full w-full bg-(--color-primary)/10 flex items-center justify-center">
              <UtensilsCrossed className="text-primary/40" size={32} />
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col grow">
          <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
          {product.description && (
            <p className="text-gray-500 text-sm line-clamp-2 mb-3 grow">
              {product.description}
            </p>
          )}
          <div className="flex items-center justify-between mt-auto">
            <span className="text-lg font-black text-(--color-primary)">
              {formatPrice(product.price)}
            </span>
            <Button
              size="sm"
              className={`rounded-full transition-all duration-300 ${
                justAdded
                  ? 'bg-green-500 hover:bg-green-500 text-white gap-1'
                  : 'bg-(--color-primary) hover:bg-(--color-primary) opacity-90 hover:opacity-100'
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
