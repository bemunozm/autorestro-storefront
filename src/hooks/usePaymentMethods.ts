'use client';

import { useQuery } from '@tanstack/react-query';
import { useRestaurant } from '@/providers/restaurant-provider';
import api from '@/lib/api';

export function usePaymentMethods(orderType?: string) {
  const { slug } = useRestaurant();

  return useQuery<string[]>({
    queryKey: ['payment-methods', slug, orderType],
    queryFn: () =>
      api.get(`/storefront/${slug}/payment-methods`, { params: { orderType } }).then(r => r.data),
    enabled: !!slug,
    staleTime: 60 * 1000,
  });
}
