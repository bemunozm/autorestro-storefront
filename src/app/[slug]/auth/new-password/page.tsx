'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2 } from 'lucide-react';
import { useRestaurant } from '@/providers/restaurant-provider';
import api from '@/lib/api';

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Las contraseñas no coinciden',
  path: ['password_confirmation'],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

const inputClass =
  'w-full h-11 px-4 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20 focus:border-(--color-primary) transition-shadow';

const labelClass = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5';

export default function NewPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { restaurant, basePath } = useRestaurant();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) return;
    setError(null);
    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        token,
        password: data.password,
      });
      setSuccess(true);
      setTimeout(() => router.push(`${basePath}/auth/login`), 4000);
    } catch {
      setError('El enlace es inválido o ha expirado. Solicita uno nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // No token — show invalid link state without logo
  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-linear-to-b from-gray-50 to-gray-100">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8 text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Enlace inválido</h2>
              <p className="text-sm text-gray-400 mb-6">
                El enlace de recuperación no es válido o ya expiró.
              </p>
              <Link href={`${basePath}/auth/forgot-password`}>
                <button className="w-full h-11 rounded-xl bg-(--color-primary) text-white text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all">
                  Solicitar nuevo enlace
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            {success ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-emerald-500" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Contraseña actualizada</h2>
                <p className="text-sm text-gray-400">Redirigiendo al inicio de sesión...</p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Nueva contraseña</h2>
                <p className="text-sm text-gray-400 mb-6">Establece una nueva contraseña para tu cuenta</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label htmlFor="password" className={labelClass}>
                      Nueva contraseña
                    </label>
                    <input
                      id="password"
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      autoComplete="new-password"
                      className={inputClass}
                      {...register('password')}
                    />
                    {errors.password && (
                      <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="password_confirmation" className={labelClass}>
                      Confirmar contraseña
                    </label>
                    <input
                      id="password_confirmation"
                      type="password"
                      placeholder="Repite tu contraseña"
                      autoComplete="new-password"
                      className={inputClass}
                      {...register('password_confirmation')}
                    />
                    {errors.password_confirmation && (
                      <p className="text-xs text-red-500 mt-1">{errors.password_confirmation.message}</p>
                    )}
                  </div>

                  {error && (
                    <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-xl bg-(--color-primary) text-white text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {loading ? 'Actualizando...' : 'Establecer contraseña'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-400">
          ¿Recordaste tu contraseña?{' '}
          <Link
            href={`${basePath}/auth/login`}
            className="font-medium text-(--color-primary) hover:underline"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
