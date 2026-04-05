'use client';

import { useRestaurant } from '@/providers/restaurant-provider';
import { StorefrontHeader } from './StorefrontHeader';

export function ConditionalHeader() {
  const { restaurant, isLoading } = useRestaurant();

  // While loading, return null to avoid flashing the generic header on custom template pages
  if (isLoading) return null;

  const template = restaurant?.landingConfig?.template ?? '';

  // Custom templates manage their own branded headers
  if (template.startsWith('custom-')) return null;

  return <StorefrontHeader />;
}
