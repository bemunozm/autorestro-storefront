import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useRestaurant } from '@/providers/restaurant-provider';
import { useAuthStore } from '@/stores/auth-store';
import type { LoyaltyProgram, LoyaltyBalance, LoyaltyTransaction, LoyaltyReward } from '@/types/loyalty';

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

export function useLoyaltyRewards() {
  const { restaurant } = useRestaurant();
  const slug = restaurant?.slug;
  return useQuery<LoyaltyReward[]>({
    queryKey: ['loyalty-rewards', slug],
    queryFn: () => api.get<LoyaltyReward[]>(`/storefront/${slug}/loyalty/rewards`).then(r => r.data),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRedeemDiscountReward() {
  const { slug } = useRestaurant();
  const queryClient = useQueryClient();

  return useMutation<{ promoCode: string }, Error, { rewardId: string }>({
    mutationFn: async ({ rewardId }) => {
      const { data } = await api.post<{ promoCode: string }>(
        `/storefront/${slug}/loyalty/redeem-discount`,
        { rewardId }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-balance', slug] });
      queryClient.invalidateQueries({ queryKey: ['loyalty-transactions', slug] });
    },
  });
}
