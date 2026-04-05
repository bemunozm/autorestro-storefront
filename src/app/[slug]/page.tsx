'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRestaurant } from '@/providers/restaurant-provider';
import { templateRegistry } from '@/templates/registry';

export default function StorefrontHome() {
  const { restaurant, isLoading, error } = useRestaurant();
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => { setHasMounted(true); }, []);

  // Show spinner while loading OR before client hydration (React Query doesn't run during SSR)
  if (isLoading || !hasMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
        <div className="animate-spin h-12 w-12 border-4 border-[var(--theme-primary,#111)] border-t-transparent rounded-full shadow-2xl" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
        <div className="text-center space-y-4">
          <p className="text-2xl font-black text-gray-300 dark:text-zinc-800 uppercase tracking-widest">Error 404</p>
          <p className="text-lg font-medium text-gray-500">Restaurante no encontrado</p>
          <div className="h-px w-12 bg-gray-200 dark:bg-zinc-800 mx-auto" />
        </div>
      </div>
    );
  }
  
  const landingConfig = restaurant.landingConfig;
  const templateName = landingConfig?.template || 'hero-centered';
  
  // Resolve template component, fallback to hero-centered
  const TemplateComponent = templateRegistry[templateName] || templateRegistry['hero-centered'];

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
        <div className="animate-spin h-8 w-8 border-4 border-[var(--theme-primary,#111)] border-t-transparent rounded-full" />
      </div>
    }>
      <TemplateComponent 
        restaurant={restaurant} 
        sections={landingConfig?.sections} 
        theme={landingConfig?.theme}
      />
    </Suspense>
  );
}
