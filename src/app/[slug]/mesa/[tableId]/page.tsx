'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useRestaurant } from '@/providers/restaurant-provider';
import { useSessionStore } from '@/stores/session-store';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Utensils } from 'lucide-react';

export default function TableJoinPage() {
  const params = useParams();
  const slug = params.slug as string;
  const tableId = params.tableId as string;
  const router = useRouter();
  const { restaurant, isLoading } = useRestaurant();
  const { setTable } = useSessionStore();

  useEffect(() => {
    if (tableId) {
      setTable(tableId);
      sessionStorage.setItem('tableId', tableId);
    }
  }, [tableId, setTable]);

  const handleVerMenu = () => {
    router.push(`/${slug}/menu`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <Card className="w-full max-w-sm shadow-sm border-none rounded-2xl overflow-hidden">
        <div 
          className="h-24 flex items-center justify-center"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          {restaurant?.logoUrl ? (
            <img src={restaurant.logoUrl} alt={restaurant.name} className="h-16 w-auto" />
          ) : (
            <Utensils className="h-12 w-12 text-white" />
          )}
        </div>
        <CardHeader className="text-center pt-8">
          <CardTitle className="text-2xl">Bienvenido a {restaurant?.name}</CardTitle>
          <p className="text-gray-500 mt-2">Mesa #{tableId}</p>
        </CardHeader>
        <CardContent className="pb-8">
          <Button 
            onClick={handleVerMenu}
            className="w-full h-12 text-lg font-semibold text-white rounded-xl shadow-md"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            Ver Menú
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
