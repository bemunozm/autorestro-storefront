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
} from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Minus, Plus, Check, MessageSquare } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { formatPrice } from '@/lib/format';
import { useIsMobile } from '@/hooks/useIsMobile';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAdded?: () => void;
}

interface ModalContentProps {
  product: Product;
  quantity: number;
  comment: string;
  addedSuccess: boolean;
  isMobile: boolean;
  onQuantityChange: (qty: number) => void;
  onCommentChange: (comment: string) => void;
  onAddToCart: () => void;
}

function ModalContent({
  product,
  quantity,
  comment,
  addedSuccess,
  isMobile,
  onQuantityChange,
  onCommentChange,
  onAddToCart,
}: ModalContentProps) {
  const [showComment, setShowComment] = useState(!!comment);

  // Sync showComment when comment is reset from outside (modal re-open)
  useEffect(() => {
    if (!comment) setShowComment(false);
  }, [comment]);

  const quantitySelector = (
    <div className="flex items-center bg-gray-100 rounded-full h-11 shrink-0">
      <button
        onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
        className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors active:scale-90"
        disabled={quantity <= 1}
        aria-label="Disminuir cantidad"
      >
        <Minus size={18} className={quantity <= 1 ? 'text-gray-300' : 'text-gray-700'} />
      </button>
      <span className="w-8 text-center font-bold text-base select-none">{quantity}</span>
      <button
        onClick={() => onQuantityChange(quantity + 1)}
        className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors active:scale-90"
        aria-label="Aumentar cantidad"
      >
        <Plus size={18} className="text-gray-700" />
      </button>
    </div>
  );

  const commentSection = (
    <div className={isMobile ? 'px-5 mt-4' : 'mt-4'}>
      {!showComment ? (
        <button
          onClick={() => setShowComment(true)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          <MessageSquare size={14} />
          Agregar instrucciones especiales
        </button>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Instrucciones
            </label>
            <button
              onClick={() => {
                setShowComment(false);
                onCommentChange('');
              }}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Quitar
            </button>
          </div>
          <Textarea
            autoFocus
            placeholder="Ej: Sin cebolla, extra picante..."
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            className="resize-none rounded-xl text-sm h-20"
            maxLength={200}
          />
        </div>
      )}
    </div>
  );

  // ─── MOBILE LAYOUT ────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="pb-safe">
        {/* Product image — only when available */}
        {product.imageUrl && (
          <div className="aspect-4/3 rounded-xl mx-5 mt-2 overflow-hidden relative">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw"
            />
          </div>
        )}

        {/* Name + price */}
        <div className="px-5 mt-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-xl font-bold text-gray-900 leading-tight">{product.name}</h2>
            <span className="text-lg font-bold text-(--color-primary) shrink-0 mt-0.5">
              {formatPrice(product.price)}
            </span>
          </div>
          {product.description && (
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">{product.description}</p>
          )}
        </div>

        {/* Collapsible comment section */}
        {commentSection}

        {/* Sticky footer: quantity + add button */}
        <div className="sticky bottom-0 bg-white border-t px-5 py-4 mt-4">
          <div className="flex items-center gap-3">
            {quantitySelector}
            <Button
              className={`flex-1 h-11 rounded-full font-bold text-sm transition-all duration-300 ${
                addedSuccess
                  ? 'bg-emerald-500 hover:bg-emerald-500 text-white scale-[1.02]'
                  : 'bg-(--color-primary) hover:bg-(--color-primary) opacity-90 hover:opacity-100'
              }`}
              onClick={onAddToCart}
              disabled={addedSuccess}
            >
              {addedSuccess ? (
                <span className="flex items-center gap-2">
                  <Check size={18} />
                  Agregado!
                </span>
              ) : (
                `Agregar · ${formatPrice(product.price * quantity)}`
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ─── DESKTOP WITH IMAGE — two-column layout ───────────────────────────────
  if (product.imageUrl) {
    return (
      <div className="flex min-h-105">
        {/* Left: image */}
        <div className="relative w-1/2 shrink-0">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 50vw"
          />
        </div>

        {/* Right: content */}
        <div className="w-1/2 p-6 flex flex-col">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl font-bold leading-tight">{product.name}</DialogTitle>
          </DialogHeader>

          <span className="text-2xl font-bold text-(--color-primary) mb-3">
            {formatPrice(product.price)}
          </span>

          {product.description && (
            <p className="text-gray-500 text-sm mb-2 leading-relaxed">{product.description}</p>
          )}

          {/* Collapsible comments */}
          {commentSection}

          {/* Push footer to bottom */}
          <div className="flex-1" />

          {/* Footer: quantity + add button */}
          <div className="flex items-center gap-3 pt-4 border-t mt-4">
            {quantitySelector}
            <Button
              className={`flex-1 h-12 rounded-full font-bold text-sm transition-all duration-300 ${
                addedSuccess
                  ? 'bg-emerald-500 hover:bg-emerald-500 text-white scale-[1.02]'
                  : 'bg-(--color-primary) hover:bg-(--color-primary) opacity-90 hover:opacity-100'
              }`}
              onClick={onAddToCart}
              disabled={addedSuccess}
            >
              {addedSuccess ? (
                <span className="flex items-center gap-2">
                  <Check size={18} />
                  Agregado!
                </span>
              ) : (
                `Agregar · ${formatPrice(product.price * quantity)}`
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ─── DESKTOP WITHOUT IMAGE — single column ────────────────────────────────
  return (
    <div className="p-6 flex flex-col">
      <DialogHeader className="mb-3">
        <DialogTitle className="text-xl font-bold leading-tight">{product.name}</DialogTitle>
      </DialogHeader>

      <span className="text-2xl font-bold text-(--color-primary) mb-3">
        {formatPrice(product.price)}
      </span>

      {product.description && (
        <p className="text-gray-500 text-sm mb-2 leading-relaxed">{product.description}</p>
      )}

      {/* Collapsible comments */}
      {commentSection}

      {/* Footer: quantity + add button */}
      <div className="flex items-center gap-3 pt-4 border-t mt-5">
        {quantitySelector}
        <Button
          className={`flex-1 h-12 rounded-full font-bold text-sm transition-all duration-300 ${
            addedSuccess
              ? 'bg-emerald-500 hover:bg-emerald-500 text-white scale-[1.02]'
              : 'bg-(--color-primary) hover:bg-(--color-primary) opacity-90 hover:opacity-100'
          }`}
          onClick={onAddToCart}
          disabled={addedSuccess}
        >
          {addedSuccess ? (
            <span className="flex items-center gap-2">
              <Check size={18} />
              Agregado!
            </span>
          ) : (
            `Agregar · ${formatPrice(product.price * quantity)}`
          )}
        </Button>
      </div>
    </div>
  );
}

export function ProductModal({ product, isOpen, onClose, onAdded }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const isMobile = useIsMobile();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Reset state whenever the modal opens or the product changes
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setComment('');
      setAddedSuccess(false);
      // showComment in ModalContent resets automatically via the useEffect
      // that watches `comment`, which becomes '' here
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

  const contentProps: ModalContentProps = {
    product,
    quantity,
    comment,
    addedSuccess,
    isMobile,
    onQuantityChange: setQuantity,
    onCommentChange: setComment,
    onAddToCart: handleAddToCart,
  };

  // Always render Dialog on server (hasMounted=false) to avoid hydration mismatch,
  // then switch to Sheet on mobile after client hydration
  if (hasMounted && isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl max-h-[85vh] overflow-auto p-0 [&>button]:hidden"
          aria-label={product.name}
        >
          {/* Visually hidden SheetTitle for Radix accessibility requirement */}
          <SheetTitle className="sr-only">{product.name}</SheetTitle>

          {/* Drag handle */}
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3" />

          <ModalContent {...contentProps} />
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: dialog width adapts based on whether product has an image
  const dialogSizeClass = product.imageUrl
    ? 'sm:max-w-2xl'
    : 'sm:max-w-lg';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${dialogSizeClass} overflow-hidden p-0 rounded-2xl`}>
        <ModalContent {...contentProps} />
      </DialogContent>
    </Dialog>
  );
}
