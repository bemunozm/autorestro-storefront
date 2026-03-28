'use client';

import { useRestaurant } from '@/providers/restaurant-provider';
import { useEffect } from 'react';

export function DynamicTheme({ children }: { children: React.ReactNode }) {
  const { restaurant } = useRestaurant();

  useEffect(() => {
    if (!restaurant) return;
    const root = document.documentElement;
    if (restaurant.primaryColor) root.style.setProperty('--color-primary', restaurant.primaryColor);
    if (restaurant.secondaryColor) root.style.setProperty('--color-secondary', restaurant.secondaryColor);
  }, [restaurant]);

  return <>{children}</>;
}
