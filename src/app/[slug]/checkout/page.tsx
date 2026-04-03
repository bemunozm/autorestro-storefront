'use client';

import { useCartStore } from '@/stores/cart-store';
import { useRestaurant } from '@/providers/restaurant-provider';
import { useCreateOrder } from '@/hooks/useCreateOrder';
import { useDineInMode } from '@/hooks/useDineInMode';
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
import { ChevronLeft, ShoppingBag, MapPin, Phone, StickyNote, CheckCircle2, Loader2, UtensilsCrossed } from 'lucide-react';
import Image from 'next/image';
import confetti from 'canvas-confetti';

interface ApiError extends Error {
  response?: {
    status: number;
  };
}

const checkoutSchema = z.object({
  type: z.enum(['pickup', 'delivery', 'dine_in']),
  customerAddress: z.string().optional().or(z.literal('')),
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
  const { restaurant, basePath } = useRestaurant();
  const { isDineIn, sessionId, tableId } = useDineInMode();
  const router = useRouter();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      type: isDineIn ? 'dine_in' : (restaurant?.features?.pickup ? 'pickup' : 'delivery'),
    }
  });

  const orderType = watch('type');

  useEffect(() => {
    if (getItemCount() === 0 && !isSuccess) {
      router.push(`${basePath}/menu`);
    }
  }, [items, router, basePath, getItemCount, isSuccess]);

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
      sessionId: isDineIn ? sessionId : null,
      tableId: isDineIn ? tableId : null,
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
      },
      onError: (err: ApiError) => {
        if (err.response?.status === 401 && !isDineIn) {
          router.push(`${basePath}/auth/login?returnUrl=${basePath}/checkout`);
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
          {isDineIn 
            ? "Tu pedido ha sido enviado a la cocina. Te avisaremos cuando esté listo en tu mesa."
            : "Gracias por tu compra. Tu pedido está siendo procesado y te avisaremos cuando esté listo."}
        </p>
        
        <div className="flex flex-col w-full max-w-md gap-3">
          <Button 
            onClick={() => router.push(`${basePath}/menu`)}
            className="w-full h-14 rounded-2xl bg-[var(--color-primary)] hover:bg-[var(--color-primary)] text-lg font-bold shadow-lg"
          >
            {isDineIn ? 'Pedir algo más' : 'Volver al menú'}
          </Button>
          {isDineIn && (
            <Button 
              variant="outline"
              onClick={() => router.push(`${basePath}/session`)}
              className="w-full h-14 rounded-2xl text-lg font-bold"
            >
              Ver estado de mis pedidos
            </Button>
          )}
        </div>
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
          {/* Dine-in Info Badge */}
          {isDineIn && (
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-sm">
                <UtensilsCrossed size={24} />
              </div>
              <div>
                <p className="font-bold text-primary">Pedido para Mesa #{tableId}</p>
                <p className="text-xs text-primary/70">Tu pedido se servirá directamente en tu mesa.</p>
              </div>
            </div>
          )}

          {/* Order Summary Section */}
          <section className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <ShoppingBag size={20} className="text-[var(--color-primary)]" />
              Resumen del Pedido
            </h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                    {item.product.imageUrl ? (
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <ShoppingBag size={24} className="text-muted-foreground/30" />
                      </div>
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

          {/* Delivery Type Section - Hidden for Dine-in */}
          {!isDineIn && (
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
          )}

          {/* Customer Info Section */}
          <section className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
            <h2 className="text-lg font-bold mb-2">
              {isDineIn ? 'Notas del pedido' : 'Información de Entrega'}
            </h2>
            
            {!isDineIn && orderType === 'delivery' && (
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

            {!isDineIn && (
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
            )}

            <div className="space-y-2">
              <Label htmlFor="customerNotes" className="flex items-center gap-2">
                <StickyNote size={16} /> {isDineIn ? '¿Alguna preferencia o alergia?' : 'Notas adicionales'}
              </Label>
              <Textarea
                id="customerNotes"
                placeholder={isDineIn ? "Ej: Sin cebolla, extra servilletas..." : "Indicaciones para el repartidor o el restaurante..."}
                {...register('customerNotes')}
                className="resize-none rounded-xl"
              />
            </div>
          </section>

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t lg:relative lg:bg-transparent lg:border-none lg:p-0">
            <Button 
              type="submit"
              disabled={isPending}
              className="w-full h-14 rounded-2xl bg-[var(--color-primary)] hover:bg-[var(--color-primary)] text-xl font-bold shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
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
