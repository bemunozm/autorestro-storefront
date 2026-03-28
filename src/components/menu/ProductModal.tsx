'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types/menu';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cart-store';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState('');
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product, quantity, comment);
    onClose();
    setQuantity(1);
    setComment('');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden p-0 rounded-2xl">
        <div className="relative aspect-video w-full">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>
        <div className="p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold">{product.name}</DialogTitle>
          </DialogHeader>
          {product.description && (
            <p className="text-gray-600 mb-6 text-sm">{product.description}</p>
          )}
          
          <div className="mb-6">
            <h4 className="text-sm font-semibold mb-2 text-gray-700">Comentarios (opcional)</h4>
            <Textarea
              placeholder="Ej: Sin cebolla, extra picante..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="resize-none"
            />
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-lg">{formatPrice(product.price * quantity)}</span>
            <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-full border">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <Minus size={18} />
              </button>
              <span className="font-semibold min-w-[20px] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>
        <DialogFooter className="p-6 bg-white border-t sm:justify-center">
          <Button 
            className="w-full rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)] opacity-90 hover:opacity-100 h-12 flex items-center gap-2 text-base font-bold transition-all"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={20} />
            Agregar al carrito
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
