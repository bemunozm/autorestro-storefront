'use client';

import Image from 'next/image';
import { ChevronDown, Star } from 'lucide-react';
import { SectionProps } from '../../types';
import { useRestaurant } from '@/providers/restaurant-provider';

export function PremiumHero({ content, restaurant }: SectionProps) {
  const { basePath } = useRestaurant();
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const ctaPrimaryText = (content.ctaPrimaryText as string) || 'Ver Menú';
  const ctaSecondaryText = (content.ctaSecondaryText as string) || 'Reservar Mesa';
  const ctaSecondaryHref = (content.ctaSecondaryHref as string) || `tel:${restaurant.phone}`;
  const socialProofText = (content.socialProofText as string) || '4.0★ TripAdvisor · 200+ reseñas';
  const coverImage = content.coverImage as string | undefined;
  const logo = restaurant.logoUrl;
  const image = coverImage || restaurant.coverImageUrl;

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gray-950">
      {/* Background image with subtle CSS parallax effect */}
      {image ? (
        <div className="absolute inset-0 z-0 scale-110" style={{ transform: 'scale(1.08)' }}>
          <Image
            src={image}
            alt={restaurant.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-950 via-[var(--theme-primary,#1a0a00)] to-black" />
      )}

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20 pb-32">
        {/* Logo */}
        {logo && (
          <div className="relative h-20 w-20 mx-auto mb-8 md:h-28 md:w-28 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 shadow-2xl">
            <Image
              src={logo}
              alt={restaurant.name}
              fill
              className="object-contain p-1"
            />
          </div>
        )}

        {/* Social proof badge — above the fold */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8 text-white/90 text-sm font-medium shadow-lg">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>{socialProofText}</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-[1.0] tracking-tight drop-shadow-2xl"
          style={{ fontFamily: 'var(--theme-heading-font)' }}>
          {title || restaurant.name}
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
          style={{ fontFamily: 'var(--theme-font)' }}>
          {subtitle || restaurant.description}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={`${basePath}/menu`}
            className="w-full sm:w-auto min-h-[52px] px-10 py-4 font-bold text-lg text-white rounded-[var(--theme-radius,0.5rem)] transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl text-center"
            style={{
              backgroundColor: 'var(--theme-accent, #EA580C)',
              boxShadow: '0 8px 32px color-mix(in srgb, var(--theme-accent, #EA580C) 40%, transparent)',
            }}
          >
            {ctaPrimaryText}
          </a>
          <a
            href={ctaSecondaryHref}
            className="w-full sm:w-auto min-h-[52px] px-10 py-4 font-bold text-lg text-white border-2 border-white/40 backdrop-blur-md rounded-[var(--theme-radius,0.5rem)] hover:bg-white/10 hover:border-white/70 transition-all duration-300 text-center"
          >
            {ctaSecondaryText}
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce z-10">
        <ChevronDown size={28} strokeWidth={1.5} />
      </div>
    </section>
  );
}
