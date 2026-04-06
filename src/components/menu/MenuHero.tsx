'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Calendar, Clock, MapPin, Phone } from 'lucide-react';
import { useRestaurant } from '@/providers/restaurant-provider';
import { isOpenNow, getTodayHours } from '@/lib/opening-hours';
import { OpeningHoursSheet } from './OpeningHoursSheet';

export function MenuHero() {
  const { restaurant } = useRestaurant();
  const [showSchedule, setShowSchedule] = useState(false);

  if (!restaurant) return null;

  const open = isOpenNow(restaurant.openingHours);
  const todayHours = getTodayHours(restaurant.openingHours);

  const infoOverlay = (
    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
      <div className="flex-1 min-w-0">
        {/* Logo replaces title when available */}
        {restaurant.logoUrl ? (
          <Image
            src={restaurant.logoUrl}
            alt={restaurant.name}
            width={200}
            height={64}
            className="h-12 md:h-16 w-auto max-w-48 md:max-w-64 object-contain drop-shadow-lg"
          />
        ) : (
          <h1 className="text-white text-2xl md:text-4xl font-black leading-tight tracking-tight">
            {restaurant.name}
          </h1>
        )}
          {restaurant.description && (
            <p className="text-white/70 text-sm md:text-base line-clamp-2 mt-1">
              {restaurant.description}
            </p>
          )}

          {/* Info row: status + hours + address + phone */}
          <div className="flex items-center gap-x-3 gap-y-1.5 mt-2.5 flex-wrap">
            {open ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Abierto
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                Cerrado
              </span>
            )}

            {todayHours && (
              <button
                onClick={() => setShowSchedule(true)}
                className="inline-flex items-center gap-1 text-xs text-white/50 hover:text-white/70 transition-colors"
              >
                <Clock size={11} />
                {todayHours}
              </button>
            )}

            {!todayHours && restaurant.openingHours && (
              <button
                onClick={() => setShowSchedule(true)}
                className="inline-flex items-center gap-1 text-xs text-white/50 hover:text-white/70 transition-colors"
              >
                <Calendar size={11} />
                Horarios
              </button>
            )}

            {restaurant.address && (
              <span className="inline-flex items-center gap-1 text-xs text-white/40">
                <MapPin size={11} className="shrink-0" />
                <span className="truncate max-w-40">{restaurant.address}</span>
              </span>
            )}

            {restaurant.phone && (
              <a href={`tel:${restaurant.phone}`} className="inline-flex items-center gap-1 text-xs text-white/40 hover:text-white/60 transition-colors">
                <Phone size={11} className="shrink-0" />
                {restaurant.phone}
              </a>
            )}
          </div>
        </div>
    </div>
  );

  return (
    <>
      {restaurant.coverImageUrl ? (
        <div className="relative h-56 md:h-80 w-full overflow-hidden">
          <Image
            src={restaurant.coverImageUrl}
            alt=""
            fill
            className="object-cover"
            priority
          />
          {/* Gradient más dramático */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/5" />
          {infoOverlay}
        </div>
      ) : (
        <div className="relative h-44 md:h-56 w-full overflow-hidden bg-linear-to-br from-(--color-primary) via-primary/90 to-primary/60">
          {infoOverlay}
        </div>
      )}

      {restaurant.openingHours && (
        <OpeningHoursSheet
          openingHours={restaurant.openingHours}
          isOpen={showSchedule}
          onClose={() => setShowSchedule(false)}
        />
      )}
    </>
  );
}
