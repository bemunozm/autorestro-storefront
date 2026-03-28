import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useRestaurant } from '@/providers/restaurant-provider';

interface CreateOrderPayload {
  type: 'pickup' | 'delivery';
  items: { productId: string; quantity: number; comment?: string }[];
  customerAddress?: string;
  customerPhone?: string;
  customerNotes?: string;
}

export function useCreateOrder() {
  const { slug } = useRestaurant();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => api.post(`/storefront/${slug}/orders`, payload).then(r => r.data),
  });
}
