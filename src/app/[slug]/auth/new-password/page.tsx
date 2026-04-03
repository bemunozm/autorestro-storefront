'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRestaurant } from '@/providers/restaurant-provider';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Las contraseñas no coinciden',
  path: ['password_confirmation'],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function NewPasswordPage() {
  const params = useParams();
  const slug = params.slug as string;
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
      setTimeout(() => router.push(`${basePath}/auth/login`), 2000);
    } catch {
      setError('El enlace es inválido o ha expirado. Solicita uno nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-sm border-none rounded-xl">
            <CardContent className="pt-6 text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Enlace inválido</h2>
              <p className="text-sm text-gray-600 mb-4">
                El enlace de recuperación no es válido o ya expiró.
              </p>
              <Link href={`${basePath}/auth/forgot-password`}>
                <Button
                  className="w-full text-white"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  Solicitar nuevo enlace
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900">{restaurant?.name}</h1>
        </div>

        <Card className="shadow-sm border-none rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl">Nueva contraseña</CardTitle>
          </CardHeader>
          <CardContent>
            {success ? (
              <Alert className="py-3 border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Contraseña actualizada. Redirigiendo al inicio de sesión...
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Nueva contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">Confirmar contraseña</Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    placeholder="Repite tu contraseña"
                    {...register('password_confirmation')}
                  />
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
                  {loading ? 'Actualizando...' : 'Establecer contraseña'}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t py-4">
            <Link
              href={`${basePath}/auth/login`}
              className="text-sm font-medium hover:underline"
              style={{ color: 'var(--color-primary)' }}
            >
              Volver al inicio de sesión
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
