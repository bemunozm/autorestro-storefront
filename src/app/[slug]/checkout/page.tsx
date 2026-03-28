'use client';

import { useCartStore } from '@/stores/cart-store';
import { useRestaurant } from '@/providers/restaurant-provider';
import { useCreateOrder } from '@/hooks/useCreateOrder';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ShoppingBag, MapPin, Phone, StickyNote, CheckCircle2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import confetti from 'canvas-confetti';

interface ApiError extends Error {
  response?: {
    status: number;
  };
}

const checkoutSchema = z.object({
  type: z.enum(['pickup', 'delivery']),
  customerAddress: z.string().min(5, 'La dirección es obligatoria para delivery').optional().or(z.literal('')),
  customerPhone: z.string().optional(),
  customerNotes: z.string().optional(),
}).refine((data) => {
  if (data.type === 'delivery' && (!data.customerAddress || data.customerAddress.length < 5)) {
    return false;
  }
  return true;
}, {
  message: "La dirección es obligatoria para delivery",
  path: ["customerAddress"],
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, getTotal, clearCart, getItemCount } = useCartStore();
  const { restaurant, slug } = useRestaurant();
  const router = useRouter();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      type: restaurant?.features?.pickup ? 'pickup' : 'delivery',
    }
  });

  const orderType = watch('type');

  useEffect(() => {
    if (getItemCount() === 0 && !isSuccess) {
      router.push(`/${slug}/menu`);
    }
  }, [items, router, slug, getItemCount, isSuccess]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const onSubmit = (values: CheckoutFormValues) => {
    const payload = {
      type: values.type,
      items: items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        comment: item.comment,
      })),
      customerAddress: values.customerAddress,
      customerPhone: values.customerPhone,
      customerNotes: values.customerNotes,
    };

    createOrder(payload, {
      onSuccess: () => {
        setIsSuccess(true);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#10b981', '#3b82f6']
        });
        clearCart();
        setTimeout(() => {
          // In a real app, redirect to order status page
          // router.push(`/${slug}/orders/${data.id}`);
        }, 5000);
      },
      onError: (err: ApiError) => {
        if (err.response?.status === 401) {
          router.push(`/${slug}/auth/login?returnUrl=/${slug}/checkout`);
        } else if (err.response?.status === 403) {
          setError("Debes registrarte en este restaurante primero");
        } else {
          setError("Hubo un error al procesar tu pedido. Por favor intenta nuevamente.");
        }
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-green-100 p-6 rounded-full mb-6 animate-bounce">
          <CheckCircle2 size={64} className="text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">¡Pedido confirmado!</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          Gracias por tu compra. Tu pedido está siendo procesado y te avisaremos cuando esté listo.
        </p>
        <div className="w-full max-w-md bg-gray-50 rounded-2xl p-6 border mb-8">
          <h3 className="font-bold text-lg mb-4 text-left border-b pb-2">Resumen</h3>
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.product.name}</span>
                <span className="font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-lg pt-2 border-t mt-4">
              <span>Total</span>
              <span className="text-[var(--color-primary)]">{formatPrice(getTotal())}</span>
            </div>
          </div>
        </div>
        <Button 
          onClick={() => router.push(`/${slug}/menu`)}
          className="rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)] h-12 px-8"
        >
          Volver al menú
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="h-16 border-b bg-white flex items-center px-4 gap-4 sticky top-0 z-30">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-bold text-lg">Finalizar Pedido</h1>
      </header>

      <main className="max-w-2xl mx-auto p-4 lg:p-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Order Summary Section */}
          <section className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <ShoppingBag size={20} className="text-[var(--color-primary)]" />
              Resumen del Pedido
            </h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0">
                    {item.product.imageUrl ? (
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-100 rounded-lg" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{item.product.name}</h4>
                    <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                    <span className="text-sm font-bold">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t flex justify-between items-center">
                <span className="font-medium text-gray-600">Total a pagar</span>
                <span className="text-2xl font-bold text-[var(--color-primary)]">{formatPrice(getTotal())}</span>
              </div>
            </div>
          </section>

          {/* Delivery Type Section */}
          <section className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-lg font-bold mb-4">Tipo de Entrega</h2>
            <RadioGroup 
              defaultValue={orderType}
              onValueChange={(value) => setValue('type', value as 'pickup' | 'delivery')}
              className="grid grid-cols-2 gap-4"
            >
              {restaurant?.features?.pickup && (
                <div className={`relative flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${orderType === 'pickup' ? 'border-[var(--color-primary)] bg-primary/5' : 'border-gray-100'}`}>
                  <Label htmlFor="pickup" className="flex flex-col cursor-pointer">
                    <span className="font-bold">Retiro en local</span>
                    <span className="text-xs text-gray-500">Sin costo</span>
                  </Label>
                  <RadioGroupItem value="pickup" id="pickup" />
                </div>
              )}
              {restaurant?.features?.delivery && (
                <div className={`relative flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${orderType === 'delivery' ? 'border-[var(--color-primary)] bg-primary/5' : 'border-gray-100'}`}>
                  <Label htmlFor="delivery" className="flex flex-col cursor-pointer">
                    <span className="font-bold">Delivery</span>
                    <span className="text-xs text-gray-500">A tu puerta</span>
                  </Label>
                  <RadioGroupItem value="delivery" id="delivery" />
                </div>
              )}
            </RadioGroup>
          </section>

          {/* Customer Info Section */}
          <section className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
            <h2 className="text-lg font-bold mb-2">Información de Entrega</h2>
            
            {orderType === 'delivery' && (
              <div className="space-y-2">
                <Label htmlFor="customerAddress" className="flex items-center gap-2">
                  <MapPin size={16} /> Dirección de entrega
                </Label>
                <Input
                  id="customerAddress"
                  placeholder="Calle, número, departamento..."
                  {...register('customerAddress')}
                  className={errors.customerAddress ? 'border-red-500' : ''}
                />
                {errors.customerAddress && (
                  <p className="text-red-500 text-xs mt-1">{errors.customerAddress.message}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="customerPhone" className="flex items-center gap-2">
                <Phone size={16} /> Teléfono (opcional)
              </Label>
              <Input
                id="customerPhone"
                type="tel"
                placeholder="+56 9 1234 5678"
                {...register('customerPhone')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerNotes" className="flex items-center gap-2">
                <StickyNote size={16} /> Notas adicionales
              </Label>
              <Textarea
                id="customerNotes"
                placeholder="Indicaciones para el repartidor o el restaurante..."
                {...register('customerNotes')}
                className="resize-none"
              />
            </div>
          </section>

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t lg:relative lg:bg-transparent lg:border-none lg:p-0">
            <Button 
              type="submit"
              disabled={isPending}
              className="w-full h-14 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)] opacity-90 hover:opacity-100 text-xl font-bold shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Procesando...
                </>
              ) : (
                'Confirmar Pedido'
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
