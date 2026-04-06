'use client';

import { useCartStore } from '@/stores/cart-store';
import { useRestaurant } from '@/providers/restaurant-provider';
import { useCreateOrder } from '@/hooks/useCreateOrder';
import { useDineInMode } from '@/hooks/useDineInMode';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  ShoppingBag,
  MapPin,
  CheckCircle2,
  Loader2,
  UtensilsCrossed,
  User,
  Tag,
} from 'lucide-react';
import { LoyaltyRedemption } from '@/components/loyalty/LoyaltyRedemption';
import { PaymentMethodSelector } from '@/components/checkout/PaymentMethodSelector';
import { useInitPayment } from '@/hooks/useInitPayment';
import { useAuthStore } from '@/stores/auth-store';
import Image from 'next/image';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { formatPrice } from '@/lib/format';

const checkoutSchema = z.object({
  type: z.enum(['pickup', 'delivery', 'dine_in']),
  customerAddress: z.string().optional().or(z.literal('')),
  customerPhone: z.string().optional(),
  customerNotes: z.string().optional(),
  discountCode: z.string().optional(),
  // Guest fields
  guestName: z.string().optional(),
  guestEmail: z.string().optional(),
  guestPhone: z.string().optional(),
  // isGuest is set dynamically to drive conditional validation
  isGuest: z.boolean().optional(),
}).refine((data) => {
  if (data.type === 'delivery' && (!data.customerAddress || data.customerAddress.length < 5)) {
    return false;
  }
  return true;
}, {
  message: "La dirección es obligatoria para delivery",
  path: ["customerAddress"],
}).refine((data) => {
  if (!data.isGuest) return true;
  return !!data.guestName && data.guestName.length >= 2;
}, {
  message: "Tu nombre es requerido",
  path: ["guestName"],
}).refine((data) => {
  if (!data.isGuest) return true;
  return !!data.guestEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.guestEmail);
}, {
  message: "Un email válido es requerido",
  path: ["guestEmail"],
}).refine((data) => {
  if (!data.isGuest) return true;
  return !!data.guestPhone && data.guestPhone.length >= 8;
}, {
  message: "Tu teléfono es requerido",
  path: ["guestPhone"],
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const inputClass =
  'w-full h-11 px-4 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20 focus:border-(--color-primary) transition-shadow bg-white';
const labelClass = 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5';
const sectionHeaderClass = 'text-xs font-bold text-gray-400 uppercase tracking-wider mb-3';

export default function CheckoutPage() {
  const { items, getTotal, clearCart, getItemCount } = useCartStore();
  const { restaurant, basePath } = useRestaurant();
  const { isDineIn, sessionId, tableId } = useDineInMode();
  const router = useRouter();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const { mutate: initPayment, isPending: isInitingPayment } = useInitPayment();
  const { isAuthenticated } = useAuthStore();
  const isGuest = !isAuthenticated && !isDineIn;
  const queryClient = useQueryClient();
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loyaltyDiscount, setLoyaltyDiscount] = useState({ points: 0, amount: 0 });
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [discountApplied, setDiscountApplied] = useState<{ code: string; amount: number } | null>(null);
  const [discountLoading, setDiscountLoading] = useState(false);
  const [discountError, setDiscountError] = useState<string | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      type: isDineIn ? 'dine_in' : (restaurant?.features?.pickup ? 'pickup' : 'delivery'),
      customerNotes: '',
      isGuest,
    }
  });

  const orderType = watch('type');

  useEffect(() => {
    if (getItemCount() === 0 && !isSuccess) {
      router.push(`${basePath}/menu`);
    }
  }, [items, router, basePath, getItemCount, isSuccess]);

  const onSubmit = (values: CheckoutFormValues) => {
    if (!paymentMethod) {
      setError('Selecciona un método de pago');
      return;
    }

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
      ...(loyaltyDiscount.points > 0 && { loyaltyPoints: loyaltyDiscount.points }),
      // Guest fields — only sent when user is not authenticated and not in dine-in mode
      ...(isGuest && {
        guestName: values.guestName,
        guestEmail: values.guestEmail,
        guestPhone: values.guestPhone,
      }),
    };

    createOrder(payload, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['loyalty-balance'] });
        queryClient.invalidateQueries({ queryKey: ['loyalty-transactions'] });

        if (paymentMethod === 'cash') {
          // Cash: show success immediately
          setIsSuccess(true);
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#22c55e', '#10b981', '#3b82f6'],
          });
          clearCart();
        } else {
          // Online payment: init payment flow then redirect
          initPayment(
            { orderId: data.id, paymentProvider: paymentMethod },
            {
              onSuccess: (paymentData) => {
                clearCart();
                if (paymentMethod === 'webpay' && paymentData.url && paymentData.token) {
                  window.location.href = `${paymentData.url}?token_ws=${paymentData.token}`;
                } else if (paymentMethod === 'mercadopago' && paymentData.initPoint) {
                  window.location.href = paymentData.initPoint;
                }
              },
              onError: () => {
                setError('Error al iniciar el pago. Tu pedido fue creado, intenta pagar de nuevo.');
              },
            }
          );
        }
      },
      onError: (err: unknown) => {
        const message = err instanceof Error ? err.message : '';
        if (message.includes('registrarte') || message.includes('registrar')) {
          setError("Debes registrarte en este restaurante primero");
        } else {
          setError(message || "Hubo un error al procesar tu pedido.");
        }
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
          <CheckCircle2 size={40} className="text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Pedido confirmado!</h1>
        <p className="text-sm text-gray-500 text-center max-w-xs mb-8">
          {isDineIn
            ? "Tu pedido fue enviado a la cocina. Te avisaremos cuando esté listo."
            : "Tu pedido está siendo procesado. Te avisaremos cuando esté listo."}
        </p>
        <div className="flex flex-col w-full max-w-xs gap-3">
          <button
            onClick={() => router.push(`${basePath}/menu`)}
            className="w-full h-12 rounded-xl bg-(--color-primary) text-white font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
          >
            {isDineIn ? 'Pedir algo más' : 'Volver al menú'}
          </button>
          {isDineIn && (
            <button
              onClick={() => router.push(`${basePath}/session`)}
              className="w-full h-12 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Ver estado de pedidos
            </button>
          )}
          {isGuest && (
            <Link href={`${basePath}/auth/register`} className="block">
              <button className="w-full h-12 rounded-xl border-2 border-(--color-primary) text-(--color-primary) font-semibold hover:bg-primary/5 transition-colors">
                Crear cuenta y acumular puntos
              </button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-0">
      {/* Spacer for sticky storefront header */}

      <main className="max-w-lg mx-auto p-4 lg:p-6">
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 font-medium mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Order summary — always open */}
            <div>
              <h2 className={sectionHeaderClass}>Tu pedido</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      {item.product.imageUrl ? (
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <ShoppingBag size={14} className="text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                      {item.comment && (
                        <p className="text-[11px] text-gray-400 truncate italic">{item.comment}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold">{formatPrice(item.product.price * item.quantity)}</p>
                      <p className="text-[11px] text-gray-400">x{item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dine-in badge */}
            {isDineIn && (
              <div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
                  <UtensilsCrossed size={18} className="text-(--color-primary) shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-(--color-primary)">Mesa #{tableId}</p>
                    <p className="text-[11px] text-gray-400">Se servirá directamente en tu mesa</p>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery type — only when not dine-in */}
            {!isDineIn && (
              <div>
                <h2 className={sectionHeaderClass}>Tipo de entrega</h2>
                <div className="flex gap-2">
                  {restaurant?.features?.pickup && (
                    <button
                      type="button"
                      onClick={() => setValue('type', 'pickup')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                        orderType === 'pickup'
                          ? 'border-(--color-primary) bg-primary/5 text-(--color-primary)'
                          : 'border-gray-100 text-gray-500'
                      }`}
                    >
                      <ShoppingBag size={16} />
                      Retiro
                    </button>
                  )}
                  {restaurant?.features?.delivery && (
                    <button
                      type="button"
                      onClick={() => setValue('type', 'delivery')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                        orderType === 'delivery'
                          ? 'border-(--color-primary) bg-primary/5 text-(--color-primary)'
                          : 'border-gray-100 text-gray-500'
                      }`}
                    >
                      <MapPin size={16} />
                      Delivery
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Customer data + delivery info unified */}
            <div>
              <h2 className={sectionHeaderClass}>
                {isDineIn ? 'Notas' : isGuest ? 'Tus datos' : 'Datos de entrega'}
              </h2>
              <div className="space-y-3">
                {/* Guest fields: name + email in row, phone full width */}
                {isGuest && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Nombre</label>
                        <input
                          type="text"
                          placeholder="Juan Pérez"
                          className={inputClass}
                          {...register('guestName')}
                        />
                        {errors.guestName && (
                          <p className="text-xs text-red-500 mt-1">{errors.guestName.message}</p>
                        )}
                      </div>
                      <div>
                        <label className={labelClass}>Email</label>
                        <input
                          type="email"
                          placeholder="tu@correo.com"
                          className={inputClass}
                          {...register('guestEmail')}
                        />
                        {errors.guestEmail && (
                          <p className="text-xs text-red-500 mt-1">{errors.guestEmail.message}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Teléfono</label>
                      <input
                        type="tel"
                        placeholder="+56 9 1234 5678"
                        className={inputClass}
                        {...register('guestPhone')}
                      />
                      {errors.guestPhone && (
                        <p className="text-xs text-red-500 mt-1">{errors.guestPhone.message}</p>
                      )}
                    </div>
                  </>
                )}

                {/* Delivery address */}
                {!isDineIn && orderType === 'delivery' && (
                  <div>
                    <label className={labelClass}>Dirección de entrega</label>
                    <input
                      type="text"
                      placeholder="Calle, número, departamento..."
                      className={inputClass}
                      {...register('customerAddress')}
                    />
                    {errors.customerAddress && (
                      <p className="text-xs text-red-500 mt-1">{errors.customerAddress.message}</p>
                    )}
                  </div>
                )}

                {/* Phone for authenticated non-dine-in users */}
                {!isDineIn && !isGuest && (
                  <div>
                    <label className={labelClass}>
                      Teléfono <span className="normal-case font-normal">(opcional)</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="+56 9 1234 5678"
                      className={inputClass}
                      {...register('customerPhone')}
                    />
                  </div>
                )}

                {/* Notes — always */}
                <div>
                  <label className={labelClass}>
                    {isDineIn ? 'Preferencias o alergias' : 'Notas'}{' '}
                    <span className="normal-case font-normal">(opcional)</span>
                  </label>
                  <textarea
                    placeholder={
                      isDineIn
                        ? 'Ej: Sin cebolla, extra servilletas...'
                        : 'Indicaciones adicionales...'
                    }
                    rows={2}
                    className={`${inputClass} h-auto py-3 resize-none`}
                    {...register('customerNotes')}
                  />
                </div>
              </div>

              {/* Guest CTA */}
              {isGuest && (
                <Link href={`${basePath}/auth/register`} className="block mt-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-(--color-primary)/10 flex items-center justify-center shrink-0">
                      <User size={14} className="text-(--color-primary)" />
                    </div>
                    <p className="text-xs text-gray-500">
                      <span className="font-semibold text-gray-700">¿Quieres acumular puntos?</span>{' '}
                      Crea tu cuenta gratis
                    </p>
                  </div>
                </Link>
              )}
            </div>

            {/* Discount code */}
            <div>
              <h2 className={sectionHeaderClass}>Código de descuento</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ingresa tu código"
                  className={`${inputClass} flex-1`}
                  {...register('discountCode')}
                  disabled={!!discountApplied}
                />
                {discountApplied ? (
                  <button
                    type="button"
                    onClick={() => { setDiscountApplied(null); setDiscountError(null); setValue('discountCode', ''); }}
                    className="px-4 h-11 rounded-xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors shrink-0"
                  >
                    Quitar
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={discountLoading}
                    onClick={() => {
                      const code = watch('discountCode');
                      if (!code) return;
                      setDiscountLoading(true);
                      setDiscountError(null);
                      // TODO: call backend endpoint to validate discount code
                      // For now, show as not found
                      setTimeout(() => {
                        setDiscountError('Código no válido o expirado');
                        setDiscountLoading(false);
                      }, 500);
                    }}
                    className="px-4 h-11 rounded-xl bg-(--color-primary) text-white text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all shrink-0 disabled:opacity-50"
                  >
                    {discountLoading ? <Loader2 size={16} className="animate-spin" /> : <Tag size={16} />}
                  </button>
                )}
              </div>
              {discountApplied && (
                <p className="text-xs text-emerald-600 font-medium mt-2">
                  Código &quot;{discountApplied.code}&quot; aplicado · -{formatPrice(discountApplied.amount)}
                </p>
              )}
              {discountError && (
                <p className="text-xs text-red-500 mt-2">{discountError}</p>
              )}
            </div>

            {/* Payment method */}
            <div>
              <h2 className={sectionHeaderClass}>Método de pago</h2>
              <PaymentMethodSelector
                orderType={orderType}
                value={paymentMethod}
                onChange={(method) => {
                  setPaymentMethod(method);
                  setError(null);
                }}
              />
            </div>

            {/* Loyalty — authenticated non-dine-in only */}
            {isAuthenticated && !isDineIn && (
              <div>
                <LoyaltyRedemption
                  appliedPoints={loyaltyDiscount.points}
                  onRedeem={(points, amount) => setLoyaltyDiscount({ points, amount })}
                  onClear={() => setLoyaltyDiscount({ points: 0, amount: 0 })}
                />
              </div>
            )}

            {/* Total breakdown */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">{formatPrice(getTotal())}</span>
                </div>
                {discountApplied && (
                  <div className="flex items-center justify-between text-sm text-emerald-600">
                    <span>Código &quot;{discountApplied.code}&quot;</span>
                    <span>-{formatPrice(discountApplied.amount)}</span>
                  </div>
                )}
                {loyaltyDiscount.amount > 0 && (
                  <div className="flex items-center justify-between text-sm text-emerald-600">
                    <span>Descuento puntos</span>
                    <span>-{formatPrice(loyaltyDiscount.amount)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-(--color-primary)">
                    {formatPrice(Math.max(0, getTotal() - loyaltyDiscount.amount - (discountApplied?.amount ?? 0)))}
                  </span>
                </div>
              </div>
            </div>

          {/* Submit button — fixed on mobile, inline on desktop */}
          <div className="pb-24 lg:pb-0 mt-4">
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-t lg:relative lg:bg-transparent lg:border-none lg:p-0 lg:pt-2">
              <button
                type="submit"
                disabled={isPending || isInitingPayment}
                className="w-full h-13 rounded-2xl bg-(--color-primary) text-white font-bold shadow-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isPending || isInitingPayment ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    {isInitingPayment ? 'Redirigiendo al pago...' : 'Procesando...'}
                  </>
                ) : paymentMethod === 'cash' ? (
                  `Confirmar · ${formatPrice(Math.max(0, getTotal() - loyaltyDiscount.amount - (discountApplied?.amount ?? 0)))}`
                ) : paymentMethod ? (
                  `Pagar · ${formatPrice(Math.max(0, getTotal() - loyaltyDiscount.amount - (discountApplied?.amount ?? 0)))}`
                ) : (
                  'Selecciona un método de pago'
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
