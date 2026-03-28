'use client';

import { useRestaurant } from '@/providers/restaurant-provider';
import Image from 'next/image';

export default function StorefrontHome() {
  const { restaurant, isLoading } = useRestaurant();
  
  if (isLoading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!restaurant) return <div className="flex items-center justify-center min-h-screen"><p>Restaurante no encontrado</p></div>;
  
  return (
    <div className="min-h-screen">
      <header className="relative h-64 bg-gray-900">
        {restaurant.coverImageUrl && (
          <Image 
            src={restaurant.coverImageUrl} 
            alt={restaurant.name} 
            fill 
            className="object-cover opacity-60" 
            priority
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white relative">
            {restaurant.logoUrl && (
              <div className="h-20 w-20 mx-auto mb-4 relative">
                <Image 
                  src={restaurant.logoUrl} 
                  alt={restaurant.name} 
                  fill 
                  className="object-contain" 
                />
              </div>
            )}
            <h1 className="text-4xl font-bold">{restaurant.name}</h1>
            {restaurant.description && <p className="mt-2 text-lg opacity-90">{restaurant.description}</p>}
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {restaurant.features?.dineIn && <FeatureCard icon="🍽️" title="Comer en local" />}
          {restaurant.features?.pickup && <FeatureCard icon="🥡" title="Retiro en local" />}
          {restaurant.features?.delivery && <FeatureCard icon="🛵" title="Delivery" />}
        </div>
        <div className="mt-8 text-center">
          <a href={`/${restaurant.slug}/menu`} className="inline-block px-8 py-3 rounded-full text-white font-semibold text-lg" style={{ backgroundColor: restaurant.primaryColor || '#000' }}>
            Ver Menú
          </a>
        </div>
        {restaurant.address && <p className="mt-6 text-center text-gray-500">📍 {restaurant.address}</p>}
        {restaurant.phone && <p className="text-center text-gray-500">📞 {restaurant.phone}</p>}
      </main>
    </div>
  );
}

function FeatureCard({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="p-6 rounded-xl border text-center hover:shadow-lg transition">
      <span className="text-3xl">{icon}</span>
      <p className="mt-2 font-medium">{title}</p>
    </div>
  );
}
