'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRestaurant } from '@/providers/restaurant-provider';
import { useAuthStore } from '@/stores/auth-store';
import api from '@/lib/api';

const registerSchema = z.object({
  name: z.string().min(2, 'Nombre muy corto'),
  lastname: z.string().min(2, 'Apellido muy corto'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(8, 'Teléfono requerido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  password_confirmation: z.string().min(8, 'Mínimo 8 caracteres'),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Las contraseñas no coinciden',
  path: ['password_confirmation'],
});

type RegisterForm = z.infer<typeof registerSchema>;

// The backend returns 'Ya tienes cuenta en este restaurante' (409 ConflictException)
// which arrives as a plain Error message via the api.ts interceptor.
const CONFLICT_MSG_FRAGMENT = 'ya tienes cuenta';

const inputClass =
  'w-full h-11 px-4 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20 focus:border-(--color-primary) transition-shadow';

const labelClass = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5';

export default function RegisterPage() {
  const router = useRouter();
  const { restaurant, basePath } = useRestaurant();
  const { login } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    if (!restaurant?.id) {
      setError('No se pudo identificar el restaurante. Recarga la página.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await api.post('/auth/register-customer', {
        ...data,
        restaurantId: restaurant.id,
      });

      // On success, auto-login
      const loginResponse = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      });

      const { access_token, user } = loginResponse.data;
      login(access_token, user);
      router.push(`${basePath}/menu`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '';
      if (message.toLowerCase().includes(CONFLICT_MSG_FRAGMENT)) {
        setError('Ya tienes una cuenta en este restaurante. Intenta iniciar sesión.');
      } else if (message) {
        setError(message);
      } else {
        setError('Hubo un error al registrarte');
      }
    } finally {
      setLoading(false);
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
            <h2 className="text-xl font-bold text-gray-900 mb-1">Crear cuenta</h2>
            <p className="text-sm text-gray-400 mb-6">Regístrate para hacer pedidos y acumular puntos</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name + Lastname */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Nombre
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Juan"
                    autoComplete="given-name"
                    className={inputClass}
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastname" className={labelClass}>
                    Apellido
                  </label>
                  <input
                    id="lastname"
                    type="text"
                    placeholder="García"
                    autoComplete="family-name"
                    className={inputClass}
                    {...register('lastname')}
                  />
                  {errors.lastname && (
                    <p className="text-xs text-red-500 mt-1">{errors.lastname.message}</p>
                  )}
                </div>
              </div>

              {/* Email */}
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

              {/* Phone */}
              <div>
                <label htmlFor="phone" className={labelClass}>
                  Teléfono
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+56 9 1234 5678"
                  autoComplete="tel"
                  className={inputClass}
                  {...register('phone')}
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                <p className="text-[11px] text-gray-300 mt-1">
                  Para acumular puntos cuando pidas por WhatsApp
                </p>
              </div>

              {/* Password + Confirm */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="password" className={labelClass}>
                    Contraseña
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
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
                    Confirmar
                  </label>
                  <input
                    id="password_confirmation"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className={inputClass}
                    {...register('password_confirmation')}
                  />
                  {errors.password_confirmation && (
                    <p className="text-xs text-red-500 mt-1">{errors.password_confirmation.message}</p>
                  )}
                </div>
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
                {loading ? 'Registrando...' : 'Crear cuenta'}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-400">
          ¿Ya tienes cuenta?{' '}
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
