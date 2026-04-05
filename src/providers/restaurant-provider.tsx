'use client';

import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api, { setApiBasePath } from '@/lib/api';
import { Restaurant } from '@/types/restaurant';

interface RestaurantContextType {
  restaurant: Restaurant | null;
  isLoading: boolean;
  error: Error | null;
  slug: string;
  basePath: string;
}

const RestaurantContext = createContext<RestaurantContextType>({
  restaurant: null,
  isLoading: true,
  error: null,
  slug: '',
  basePath: '',
});

export function useRestaurant() {
  return useContext(RestaurantContext);
}

// Slugs reserved by Next.js or the platform — never valid restaurant slugs
const RESERVED_SLUGS = new Set(['404', '500', '_next', 'api', 'auth']);

export function RestaurantProvider({ slug, basePath, children }: { slug: string; basePath: string; children: ReactNode }) {
  const isValidSlug = !!slug && !RESERVED_SLUGS.has(slug);

  const { data, isLoading, error } = useQuery({
    queryKey: ['restaurant-config', slug],
    queryFn: () => api.get<Restaurant>(`/storefront/${slug}/config`).then(r => r.data),
    enabled: isValidSlug,
    staleTime: 5 * 60 * 1000,
  });


  useEffect(() => {
    setApiBasePath(basePath);
  }, [basePath]);

  return (
    <RestaurantContext.Provider value={{ restaurant: data ?? null, isLoading, error: error as Error | null, slug, basePath }}>
      {children}
    </RestaurantContext.Provider>
  );
}
