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
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Alert, AlertDescription } from '@/components/ui/alert';

const registerSchema = z.object({
  name: z.string().min(2, 'Nombre muy corto'),
  lastname: z.string().min(2, 'Apellido muy corto'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  password_confirmation: z.string().min(6, 'Mínimo 6 caracteres'),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Las contraseñas no coinciden",
  path: ["password_confirmation"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { restaurant, basePath } = useRestaurant();
  const { login } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    if (!restaurant?.id) return;
    setError(null);
    setLoading(true);
    try {
      await api.post('/auth/register-customer', {
        ...data,
        restaurantId: restaurant.id,
      });

      const loginResponse = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      });

      const { access_token, user } = loginResponse.data;
      login(access_token, user);
      router.push(`${basePath}/menu`);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Hubo un error al registrarte');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-4"
      style={{ background: 'color-mix(in srgb, var(--color-primary) 8%, white)' }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {restaurant?.logoUrl && (
            <div className="relative mx-auto h-20 w-20 mb-4">
              <Image
                src={restaurant.logoUrl}
                alt={restaurant.name}
                fill
                className="object-contain"
              />
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-900">Únete a {restaurant?.name}</h1>
        </div>

        <Card className="shadow-sm border-none rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl">Crear Cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" {...register('name')} />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname">Apellido</Label>
                  <Input id="lastname" {...register('lastname')} />
                  {errors.lastname && <p className="text-sm text-red-500">{errors.lastname.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Confirmar Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password_confirmation"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('password_confirmation')}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password_confirmation && (
                  <p className="text-sm text-red-500">{errors.password_confirmation.message}</p>
                )}
              </div>

              {error && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full text-white"
                style={{ backgroundColor: 'var(--color-primary)' }}
                disabled={loading}
              >
                {loading ? (
                  <><Loader2 className="animate-spin mr-2 h-4 w-4" /> Registrando...</>
                ) : (
                  'Registrarse'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t py-4">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link
                href={`${basePath}/auth/login`}
                className="font-medium hover:underline"
                style={{ color: 'var(--color-primary)' }}
              >
                Inicia sesión
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
