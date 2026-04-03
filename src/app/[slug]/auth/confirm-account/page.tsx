'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import { useRestaurant } from '@/providers/restaurant-provider';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ConfirmAccountPage() {
  const params = useParams();
  const slug = params.slug as string;
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
        setTimeout(() => router.push(`${basePath}/auth/login`), 2000);
      })
      .catch(() => {
        setStatus('error');
      });
  }, [token, slug, router]);

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
          <CardContent className="pt-6">
            {status === 'checking' && (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Verificando tu cuenta...</p>
              </div>
            )}

            {status === 'confirmed' && (
              <div className="text-center py-8">
                <Alert className="py-3 border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    Tu cuenta ha sido confirmada. Redirigiendo al inicio de sesión...
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center py-6 space-y-4">
                <Alert variant="destructive" className="py-3">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    El enlace de confirmación es inválido o ha expirado.
                  </AlertDescription>
                </Alert>
                <Link href={`${basePath}/auth/login`}>
                  <Button
                    className="w-full text-white"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    Volver al inicio de sesión
                  </Button>
                </Link>
              </div>
            )}

            {status === 'no-token' && (
              <div className="text-center py-6 space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Enlace inválido</h2>
                <p className="text-sm text-gray-600">
                  No se encontró un token de confirmación válido.
                </p>
                <Link href={`${basePath}/auth/login`}>
                  <Button
                    className="w-full text-white"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    Ir al inicio de sesión
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
