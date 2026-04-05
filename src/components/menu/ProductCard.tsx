'use client';

import Image from 'next/image';
import { UtensilsCrossed } from 'lucide-react';
import { Product } from '@/types/menu';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ProductModal } from './ProductModal';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <div 
        className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative aspect-square w-full">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-50 flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 8%, white)' }}>
              <UtensilsCrossed className="h-10 w-10" style={{ color: 'color-mix(in srgb, var(--color-primary) 40%, #9ca3af)' }} />
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
          {product.description && (
            <p className="text-gray-500 text-sm line-clamp-2 mb-3 flex-grow">
              {product.description}
            </p>
          )}
          <div className="flex items-center justify-between mt-auto">
            <span className="font-bold text-gray-900">{formatPrice(product.price)}</span>
            <Button 
              size="sm" 
              className="rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)] opacity-90 hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
            >
              Agregar
            </Button>
          </div>
        </div>
      </div>

      <ProductModal 
        product={product} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
