'use client';

import React, { useState } from 'react';
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
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Alert, AlertDescription } from '@/components/ui/alert';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { restaurant, basePath } = useRestaurant();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setError(null);
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', {
        email: data.email,
        redirectUrl: `${window.location.origin}${basePath}`,
      });
      setSuccess(true);
    } catch {
      setError('Hubo un error al enviar el correo. Intenta nuevamente.');
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
          <h1 className="text-2xl font-bold text-gray-900">{restaurant?.name}</h1>
        </div>

        <Card className="shadow-sm border-none rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl">Recuperar contraseña</CardTitle>
          </CardHeader>
          <CardContent>
            {success ? (
              <Alert className="py-3 border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Si el email existe, recibirás un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y spam.
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <p className="text-sm text-gray-600">
                  Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                </p>
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
                    <><Loader2 className="animate-spin mr-2 h-4 w-4" /> Enviando...</>
                  ) : (
                    'Enviar enlace'
                  )}
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
