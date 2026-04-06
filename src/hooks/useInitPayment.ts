'use client';

import { useMutation } from '@tanstack/react-query';
import { useRestaurant } from '@/providers/restaurant-provider';
import api from '@/lib/api';

interface InitPaymentResponse {
  token?: string;
  url?: string;
  preferenceId?: string;
  initPoint?: string;
}

export function useInitPayment() {
  const { slug } = useRestaurant();

  return useMutation({
    mutationFn: (payload: { orderId: string; paymentProvider: string }) =>
      api.post<InitPaymentResponse>(`/storefront/${slug}/payments/init`, payload).then(r => r.data),
  });
}
