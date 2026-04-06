'use client';

import { useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { useRestaurant } from '@/providers/restaurant-provider';
import { getActiveOrder } from '@/lib/guest-orders';
import { CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const slug = params.slug as string;
  const { basePath } = useRestaurant();
  // Prefer orderId from query param (MP success URL includes it); fall back to localStorage
  const urlOrderId = searchParams.get('orderId');
  const mpStatus = searchParams.get('status');
  const [status] = useState<'success' | 'pending'>(
    mpStatus === 'pending' ? 'pending' : 'success'
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-sm text-center">
        {status === 'success' && (
          <div className="py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">¡Pago confirmado!</h1>
            <p className="text-sm text-gray-500 mb-6">
              Tu pedido ha sido procesado exitosamente con MercadoPago.
            </p>
            <div className="space-y-3">
              {(() => {
                const trackingId = urlOrderId ?? getActiveOrder(slug)?.orderId;
                if (trackingId) {
                  return (
                    <Link href={`${basePath}/track/${trackingId}`}>
                      <button className="w-full h-11 rounded-xl bg-(--color-primary) text-white text-sm font-semibold hover:opacity-90 transition-all">
                        Ver mi pedido
                      </button>
                    </Link>
                  );
                }
                return null;
              })()}
              <Link href={`${basePath}/menu`}>
                <button className="w-full h-11 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors">
                  Volver al menú
                </button>
              </Link>
            </div>
          </div>
        )}

        {status === 'pending' && (
          <div className="py-8">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <Clock size={32} className="text-amber-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Pago pendiente</h1>
            <p className="text-sm text-gray-500 mb-6">
              Tu pago está siendo procesado. Recibirás una notificación cuando se confirme.
            </p>
            <Link href={`${basePath}/menu`}>
              <button className="w-full h-11 rounded-xl bg-(--color-primary) text-white text-sm font-semibold hover:opacity-90 transition-all">
                Volver al menú
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
