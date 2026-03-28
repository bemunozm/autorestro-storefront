import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { MenuResponse } from '@/types/menu';

export function useMenu(slug: string) {
  return useQuery({
    queryKey: ['menu', slug],
    queryFn: () => api.get<MenuResponse>(`/storefront/${slug}/menu`).then(r => r.data),
    enabled: !!slug,
    staleTime: 60 * 1000,
  });
}
