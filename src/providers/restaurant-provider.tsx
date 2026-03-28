'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Restaurant } from '@/types/restaurant';

interface RestaurantContextType {
  restaurant: Restaurant | null;
  isLoading: boolean;
  error: Error | null;
  slug: string;
}

const RestaurantContext = createContext<RestaurantContextType>({
  restaurant: null,
  isLoading: true,
  error: null,
  slug: '',
});

export function useRestaurant() {
  return useContext(RestaurantContext);
}

export function RestaurantProvider({ slug, children }: { slug: string; children: ReactNode }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['restaurant-config', slug],
    queryFn: () => api.get<Restaurant>(`/storefront/${slug}/config`).then(r => r.data),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <RestaurantContext.Provider value={{ restaurant: data ?? null, isLoading, error: error as Error | null, slug }}>
      {children}
    </RestaurantContext.Provider>
  );
}
