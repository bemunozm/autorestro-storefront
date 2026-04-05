import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useRestaurant } from '@/providers/restaurant-provider';
import { useAuthStore } from '@/stores/auth-store';
import type { LoyaltyProgram, LoyaltyBalance, LoyaltyTransaction } from '@/types/loyalty';

export function useLoyaltyProgram() {
  const { slug, restaurant } = useRestaurant();
  return useQuery<LoyaltyProgram | null>({
    queryKey: ['loyalty-program', slug],
    queryFn: async () => {
      const { data } = await api.get(`/storefront/${slug}/loyalty/program`);
      return data;
    },
    // Only fetch once the restaurant config has loaded (prevents requests for invalid slugs like "404")
    enabled: !!slug && !!restaurant,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLoyaltyBalance() {
  const { slug, restaurant } = useRestaurant();
  const { isAuthenticated } = useAuthStore();
  return useQuery<LoyaltyBalance>({
    queryKey: ['loyalty-balance', slug],
    queryFn: async () => {
      const { data } = await api.get(`/storefront/${slug}/loyalty/balance`);
      return data;
    },
    enabled: !!slug && !!restaurant && isAuthenticated,
    staleTime: 30 * 1000,
  });
}

export function useLoyaltyTransactions(limit = 20) {
  const { slug, restaurant } = useRestaurant();
  const { isAuthenticated } = useAuthStore();
  return useQuery<LoyaltyTransaction[]>({
    queryKey: ['loyalty-transactions', slug, limit],
    queryFn: async () => {
      const { data } = await api.get(`/storefront/${slug}/loyalty/transactions`, { params: { limit } });
      return data;
    },
    enabled: !!slug && !!restaurant && isAuthenticated,
    staleTime: 30 * 1000,
  });
}
