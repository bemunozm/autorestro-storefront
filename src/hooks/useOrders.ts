import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Order } from '@/types/order';

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => api.get<Order[]>('/orders').then(r => r.data),
    staleTime: 30 * 1000,
  });
}
