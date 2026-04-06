'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRestaurant } from '@/providers/restaurant-provider';
import api from '@/lib/api';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function PaymentConfirmPage() {
  const searchParams = useSearchParams();
  const { basePath } = useRestaurant();
  const tokenWs = searchParams.get('token_ws');
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');

  useEffect(() => {
    if (!tokenWs) {
      setStatus('failed');
      return;
    }

    api.post('/payments/transbank/confirm', { token_ws: tokenWs })
      .then((res) => {
        setStatus(res.data.status === 'CONFIRMED' ? 'success' : 'failed');
      })
      .catch(() => setStatus('failed'));
  }, [tokenWs]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-sm text-center">
        {status === 'loading' && (
          <div className="py-12">
            <Loader2 size={40} className="animate-spin mx-auto text-gray-300 mb-4" />
            <p className="text-sm text-gray-500">Confirmando tu pago...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">¡Pago confirmado!</h1>
            <p className="text-sm text-gray-500 mb-6">Tu pedido ha sido procesado exitosamente.</p>
            <Link href={`${basePath}/menu`}>
              <button className="w-full h-11 rounded-xl bg-(--color-primary) text-white text-sm font-semibold hover:opacity-90 transition-all">
                Volver al menú
              </button>
            </Link>
          </div>
        )}

        {status === 'failed' && (
          <div className="py-8">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <XCircle size={32} className="text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Pago no procesado</h1>
            <p className="text-sm text-gray-500 mb-6">
              Hubo un problema con tu pago. Tu pedido fue creado y puedes intentar pagar nuevamente.
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
