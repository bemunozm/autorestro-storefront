'use client';

import Image from 'next/image';
import { ChevronDown, Star } from 'lucide-react';
import { SectionProps } from '../../types';
import { SHINE_COLORS } from '../data/defaults';

export function ShineSushiHero({ content, restaurant }: SectionProps) {
  const title = (content.title as string | undefined) || restaurant.name;
  const subtitle = (content.subtitle as string | undefined) || 'Restobar & Delivery · Fusión Nikkei';
  const ctaPrimaryText = (content.ctaPrimaryText as string) || 'Ver Menú';
  const ctaSecondaryText = (content.ctaSecondaryText as string) || 'Reservar Mesa';
  const ctaSecondaryHref = (content.ctaSecondaryHref as string) || `tel:${restaurant.phone ?? '+56572443313'}`;
  const coverImage = (content.coverImage as string | undefined) || restaurant.coverImageUrl;
  const logo = restaurant.logoUrl;

  return (
    <section
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: SHINE_COLORS.primary }}
    >
      {/* Background image */}
      {coverImage ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={coverImage}
            alt={restaurant.name}
            fill
            className="object-cover"
            priority
          />
          {/* Cinematic lateral gradient — dark on left, lighter center, dark on right + bottom */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(105deg, rgba(13,13,13,0.92) 0%, rgba(13,13,13,0.55) 45%, rgba(13,13,13,0.75) 100%), linear-gradient(to top, rgba(13,13,13,0.9) 0%, transparent 50%)',
            }}
          />
        </div>
      ) : (
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `radial-gradient(ellipse at 30% 60%, ${SHINE_COLORS.gold}18 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, ${SHINE_COLORS.orange}12 0%, transparent 55%), ${SHINE_COLORS.primary}`,
          }}
        />
      )}

      {/* Decorative gold grain texture overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          backgroundSize: '200px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-24 pb-40">
        {/* Logo */}
        {logo && (
          <div
            className="relative h-24 w-24 mx-auto mb-10 md:h-32 md:w-32 rounded-2xl p-2 shadow-2xl"
            style={{
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${SHINE_COLORS.gold}40`,
              boxShadow: `0 8px 40px ${SHINE_COLORS.gold}25`,
            }}
          >
            <Image src={logo} alt={restaurant.name} fill className="object-contain p-1" />
          </div>
        )}

        {/* Social proof badge */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-10 text-sm font-semibold"
          style={{
            background: `${SHINE_COLORS.gold}18`,
            backdropFilter: 'blur(12px)',
            border: `1px solid ${SHINE_COLORS.gold}50`,
            color: SHINE_COLORS.gold,
          }}
        >
          <Star className="w-4 h-4" style={{ fill: SHINE_COLORS.gold, color: SHINE_COLORS.gold }} />
          <span>4.0★ TripAdvisor · Fusión Nikkei Premium</span>
        </div>

        {/* Headline */}
        <h1
          className="font-black text-white leading-none tracking-widest uppercase mb-5 drop-shadow-2xl"
          style={{
            fontSize: 'clamp(3rem, 10vw, 7rem)',
            letterSpacing: '0.12em',
            textShadow: `0 0 80px ${SHINE_COLORS.gold}30`,
          }}
        >
          {title}
        </h1>

        {/* Gold horizontal rule */}
        <div
          className="h-px w-48 mx-auto mb-5"
          style={{
            background: `linear-gradient(to right, transparent, ${SHINE_COLORS.gold}, transparent)`,
          }}
        />

        {/* Subtitle */}
        <p
          className="text-lg md:text-2xl font-light tracking-[0.25em] uppercase mb-14"
          style={{ color: SHINE_COLORS.gold, letterSpacing: '0.22em' }}
        >
          {subtitle}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={`/${restaurant.slug}/menu`}
            className="w-full sm:w-auto min-h-[52px] px-10 py-4 font-bold text-lg text-white rounded-sm transition-all duration-300 hover:scale-105 active:scale-95 text-center tracking-wider uppercase"
            style={{
              backgroundColor: SHINE_COLORS.orange,
              boxShadow: `0 8px 32px ${SHINE_COLORS.orange}50`,
            }}
          >
            {ctaPrimaryText}
          </a>
          <a
            href={ctaSecondaryHref}
            className="w-full sm:w-auto min-h-[52px] px-10 py-4 font-bold text-lg rounded-sm hover:bg-white/5 transition-all duration-300 text-center tracking-wider uppercase"
            style={{
              color: SHINE_COLORS.gold,
              border: `2px solid ${SHINE_COLORS.gold}`,
            }}
          >
            {ctaSecondaryText}
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10 flex flex-col items-center gap-1"
        style={{ color: `${SHINE_COLORS.gold}80` }}
      >
        <span className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: `${SHINE_COLORS.gold}60` }}>
          Explorar
        </span>
        <ChevronDown size={22} strokeWidth={1.5} />
      </div>
    </section>
  );
}
