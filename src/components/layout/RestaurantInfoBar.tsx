'use client';

import { MapPin, Phone, Clock } from 'lucide-react';
import { useRestaurant } from '@/providers/restaurant-provider';
import { getTodayHours } from '@/lib/opening-hours';

export function RestaurantInfoBar() {
  const { restaurant } = useRestaurant();

  if (!restaurant) return null;

  const todayHours = getTodayHours(restaurant.openingHours);
  const hasContent = restaurant.address || restaurant.phone || todayHours;

  if (!hasContent) return null;

  return (
    <div className="bg-white border-b py-2 px-4">
      <div className="flex gap-4 overflow-x-auto no-scrollbar items-center">
        {restaurant.address && (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap shrink-0">
            <MapPin size={14} className="shrink-0" />
            {restaurant.address}
          </span>
        )}

        {restaurant.address && (restaurant.phone || todayHours) && (
          <span className="hidden sm:inline text-muted-foreground/40 text-xs select-none">·</span>
        )}

        {restaurant.phone && (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap shrink-0">
            <Phone size={14} className="shrink-0" />
            {restaurant.phone}
          </span>
        )}

        {restaurant.phone && todayHours && (
          <span className="hidden sm:inline text-muted-foreground/40 text-xs select-none">·</span>
        )}

        {todayHours && (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap shrink-0">
            <Clock size={14} className="shrink-0" />
            {todayHours}
          </span>
        )}
      </div>
    </div>
  );
}
