'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '@/types/menu';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cart-store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Minus, Plus, ShoppingCart, Check, UtensilsCrossed } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { formatPrice } from '@/lib/format';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAdded?: () => void;
}

export function ProductModal({ product, isOpen, onClose, onAdded }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  // Reset state whenever the modal opens or the product changes
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setComment('');
      setAddedSuccess(false);
    }
  }, [isOpen, product?.id]);

  const handleAddToCart = () => {
    addItem(product, quantity, comment);
    onAdded?.();
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-106.25 overflow-hidden p-0 rounded-2xl">
        <div className="relative aspect-video w-full">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-(--color-primary)/10 flex items-center justify-center">
              <UtensilsCrossed className="text-primary/40" size={40} />
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
              <span className="font-semibold min-w-5 text-center">{quantity}</span>
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
            className={`w-full rounded-full h-12 flex items-center gap-2 text-base font-bold transition-all duration-300 ${
              addedSuccess
                ? 'bg-green-500 hover:bg-green-500 text-white'
                : 'bg-(--color-primary) hover:bg-(--color-primary) opacity-90 hover:opacity-100'
            }`}
            onClick={handleAddToCart}
            disabled={addedSuccess}
          >
            {addedSuccess ? (
              <>
                <Check size={20} />
                Agregado!
              </>
            ) : (
              <>
                <ShoppingCart size={20} />
                Agregar al carrito · {formatPrice(product.price * quantity)}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
