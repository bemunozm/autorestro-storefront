'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useRestaurant } from '@/providers/restaurant-provider';
import api from '@/lib/api';

export default function ConfirmAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { restaurant, basePath } = useRestaurant();
  const [status, setStatus] = useState<'checking' | 'confirmed' | 'error' | 'no-token'>(
    token ? 'checking' : 'no-token'
  );

  useEffect(() => {
    if (!token) return;

    api.post('/auth/confirm-email', { token })
      .then(() => {
        setStatus('confirmed');
        setTimeout(() => router.push(`${basePath}/auth/login`), 4000);
      })
      .catch(() => {
        setStatus('error');
      });
  }, [token, basePath, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-linear-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-sm">
        {/* Logo or name */}
        <div className="text-center mb-8">
          {restaurant?.logoUrl ? (
            <img
              src={restaurant.logoUrl}
              alt={restaurant?.name}
              className="h-12 w-auto max-w-48 object-contain mx-auto"
            />
          ) : (
            <h1 className="text-2xl font-black tracking-tight text-gray-900">{restaurant?.name}</h1>
          )}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            {status === 'checking' && (
              <div className="text-center py-8">
                <Loader2 size={32} className="animate-spin mx-auto text-gray-300 mb-4" />
                <p className="text-sm text-gray-400">Verificando tu cuenta...</p>
              </div>
            )}

            {status === 'confirmed' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-emerald-500" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Cuenta confirmada</h2>
                <p className="text-sm text-gray-400">Redirigiendo al inicio de sesión...</p>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                  <XCircle size={32} className="text-red-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Enlace inválido o expirado</h2>
                  <p className="text-sm text-gray-400">
                    El enlace de confirmación no es válido o ya fue utilizado.
                  </p>
                </div>
                <Link href={`${basePath}/auth/login`}>
                  <button className="w-full h-11 rounded-xl bg-(--color-primary) text-white text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all">
                    Ir a iniciar sesión
                  </button>
                </Link>
              </div>
            )}

            {status === 'no-token' && (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                  <XCircle size={32} className="text-gray-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Enlace inválido</h2>
                  <p className="text-sm text-gray-400">
                    No se encontró un token de confirmación válido.
                  </p>
                </div>
                <Link href={`${basePath}/auth/login`}>
                  <button className="w-full h-11 rounded-xl bg-(--color-primary) text-white text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all">
                    Ir al inicio de sesión
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
