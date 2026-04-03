'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
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
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { restaurant, basePath } = useRestaurant();
  const returnUrl = searchParams.get('returnUrl') || `${basePath}/menu`;
  const { login } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    setLoading(true);
    try {
      const response = await api.post('/auth/login', data);
      const { access_token, user } = response.data;
      login(access_token, user);
      router.push(returnUrl);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError('Email o contraseña incorrectos');
      } else {
        setError('Hubo un error al iniciar sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {restaurant?.logoUrl && (
            <img 
              src={restaurant.logoUrl} 
              alt={restaurant.name} 
              className="mx-auto h-20 w-auto mb-4"
            />
          )}
          <h1 className="text-2xl font-bold text-gray-900">Bienvenido a {restaurant?.name}</h1>
        </div>

        <Card className="shadow-sm border-none rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl">Iniciar Sesión</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
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
                {loading ? 'Cargando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-3 border-t py-4">
            <Link
              href={`${basePath}/auth/forgot-password`}
              className="text-sm text-gray-500 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link
                href={`${basePath}/auth/register`}
                className="font-medium hover:underline"
                style={{ color: 'var(--color-primary)' }}
              >
                Regístrate aquí
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
