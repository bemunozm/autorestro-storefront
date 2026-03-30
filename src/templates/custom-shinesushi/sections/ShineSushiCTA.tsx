'use client';

import { Phone, ShoppingBag, Star } from 'lucide-react';
import { SectionProps } from '../../types';
import { ScrollReveal } from '../../sections/ScrollReveal';
import { SHINE_COLORS } from '../data/defaults';

export function ShineSushiCTA({ content, restaurant }: SectionProps) {
  const title =
    (content.title as string | undefined) || '¿Listo para la\nExperiencia Nikkei?';
  const ctaDeliveryText = (content.ctaDeliveryText as string | undefined) || 'Pedir Ahora';
  const ctaReservationText =
    (content.ctaReservationText as string | undefined) || 'Llamar para Reservar';
  const ctaReservationHref =
    (content.ctaReservationHref as string | undefined) || `tel:${restaurant.phone ?? '+56572443313'}`;
  const socialProof =
    (content.socialProof as string | undefined) || '4.0★ TripAdvisor · 3 Sucursales en el Norte';

  return (
    <section
      className="relative py-28 px-6 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${SHINE_COLORS.primary} 0%, #1a0e00 50%, ${SHINE_COLORS.orange}25 100%)`,
      }}
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle, ${SHINE_COLORS.gold} 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${SHINE_COLORS.orange}15 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Gold rule top */}
        <ScrollReveal direction="none">
          <div
            className="h-px w-24 mx-auto mb-10"
            style={{
              background: `linear-gradient(to right, transparent, ${SHINE_COLORS.gold}, transparent)`,
            }}
          />
        </ScrollReveal>

        {/* Title */}
        <ScrollReveal direction="up">
          <h2
            className="font-black text-white mb-8 leading-tight whitespace-pre-line"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
          >
            {title}
          </h2>
        </ScrollReveal>

        {/* Social proof */}
        <ScrollReveal direction="up" delay={100}>
          <div className="flex items-center justify-center gap-2 mb-12">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5"
                style={{
                  fill: i < 4 ? SHINE_COLORS.gold : 'transparent',
                  color: i < 4 ? SHINE_COLORS.gold : `${SHINE_COLORS.gold}30`,
                }}
              />
            ))}
            <span
              className="ml-2 text-sm font-medium tracking-wide"
              style={{ color: `${SHINE_COLORS.gold}CC` }}
            >
              {socialProof}
            </span>
          </div>
        </ScrollReveal>

        {/* CTAs */}
        <ScrollReveal direction="up" delay={150}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Primary: Delivery */}
            <a
              href={`/${restaurant.slug}/menu`}
              className="group w-full sm:w-auto min-h-[56px] px-12 py-4 font-bold text-lg text-white uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
              style={{
                backgroundColor: SHINE_COLORS.orange,
                boxShadow: `0 12px 40px ${SHINE_COLORS.orange}50`,
              }}
            >
              <ShoppingBag className="w-5 h-5" />
              {ctaDeliveryText}
            </a>

            {/* Secondary: Reservar */}
            <a
              href={ctaReservationHref}
              className="w-full sm:w-auto min-h-[56px] px-12 py-4 font-bold text-lg uppercase tracking-wider transition-all duration-300 hover:bg-white/5 active:scale-95 flex items-center justify-center gap-3"
              style={{
                color: SHINE_COLORS.gold,
                border: `2px solid ${SHINE_COLORS.gold}`,
              }}
            >
              <Phone className="w-5 h-5" />
              {ctaReservationText}
            </a>
          </div>
        </ScrollReveal>

        {/* Delivery platforms */}
        <ScrollReveal direction="up" delay={200}>
          <p
            className="mt-10 text-xs tracking-[0.25em] uppercase"
            style={{ color: `${SHINE_COLORS.cream}40` }}
          >
            Disponible en Rappi · Uber Eats
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
