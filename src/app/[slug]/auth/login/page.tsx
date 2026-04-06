'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRestaurant } from '@/providers/restaurant-provider';
import { useAuthStore } from '@/stores/auth-store';
import api from '@/lib/api';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

// The error message the backend sends for unconfirmed emails (403 EMAIL_NOT_CONFIRMED).
// The api.ts interceptor wraps all errors into plain Error objects using response.data.message,
// so we detect the 403 case by matching the message string rather than response.status.
const EMAIL_NOT_CONFIRMED_MSG = 'Debes confirmar tu correo electrónico antes de iniciar sesión';

const inputClass =
  'w-full h-11 px-4 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20 focus:border-(--color-primary) transition-shadow';

const labelClass = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { restaurant, basePath } = useRestaurant();
  const returnUrl = searchParams.get('returnUrl') || `${basePath}/menu`;
  const { login } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    setShowResend(false);
    setResendSuccess(false);
    setLoading(true);
    try {
      const response = await api.post('/auth/login', data);
      const { access_token, user } = response.data;
      login(access_token, user);
      router.push(returnUrl);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '';
      if (message === EMAIL_NOT_CONFIRMED_MSG) {
        setError('Tu email no ha sido confirmado. Revisa tu bandeja de entrada.');
        setShowResend(true);
      } else if (message.toLowerCase().includes('contraseña') || message.toLowerCase().includes('correo')) {
        setError('Email o contraseña incorrectos');
      } else {
        setError('Hubo un error al iniciar sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    const email = watch('email');
    if (!email) return;
    try {
      await api.post('/auth/resend-confirmation', {
        email,
        redirectUrl: `${window.location.origin}${basePath}`,
      });
      setError(null);
      setShowResend(false);
      setResendSuccess(true);
    } catch {
      // Silently succeed to prevent email enumeration
    }
  };

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
            <h2 className="text-xl font-bold text-gray-900 mb-1">Bienvenido</h2>
            <p className="text-sm text-gray-400 mb-6">Inicia sesión para continuar</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  autoComplete="email"
                  className={inputClass}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Contraseña
                  </label>
                  <Link
                    href={`${basePath}/auth/forgot-password`}
                    className="text-xs text-gray-400 hover:text-(--color-primary) transition-colors"
                  >
                    ¿La olvidaste?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={inputClass}
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                )}
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {showResend && (
                <button
                  type="button"
                  onClick={handleResendConfirmation}
                  className="text-sm font-medium text-(--color-primary) hover:underline"
                >
                  Reenviar correo de confirmación
                </button>
              )}

              {resendSuccess && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-600">
                  Correo de confirmación reenviado. Revisa tu bandeja.
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-(--color-primary) text-white text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? 'Ingresando...' : 'Iniciar sesión'}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-400">
          ¿No tienes cuenta?{' '}
          <Link
            href={`${basePath}/auth/register`}
            className="font-medium text-(--color-primary) hover:underline"
          >
            Crear cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}
