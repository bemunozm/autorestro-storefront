'use client';

import { Phone, ShoppingBag } from 'lucide-react';
import { SectionProps } from '../../types';
import { ScrollReveal } from '../../sections/ScrollReveal';
import { SHINE_COLORS } from '../data/defaults';
import { useRestaurant } from '@/providers/restaurant-provider';

export function ShineSushiCTA({ content, restaurant }: SectionProps) {
  const { basePath } = useRestaurant();
  const ctaDeliveryText = (content.ctaDeliveryText as string | undefined) || 'Pedir Ahora';
  const ctaReservationText =
    (content.ctaReservationText as string | undefined) || 'Llamar para Reservar';
  const ctaReservationHref =
    (content.ctaReservationHref as string | undefined) || `tel:${restaurant.phone ?? '+56572443313'}`;

  return (
    <section
      style={{
        position: 'relative',
        backgroundColor: SHINE_COLORS.bg,
        overflow: 'hidden',
        padding: 'clamp(100px, 15vh, 160px) clamp(24px, 6vw, 80px)',
      }}
    >
      {/* Horizontal rule top */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(to right, transparent 0%, ${SHINE_COLORS.orange} 30%, ${SHINE_COLORS.orange} 70%, transparent 100%)`,
          opacity: 0.3,
        }}
      />

      {/* Blue glow from center-bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: '-200px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '600px',
          background: `radial-gradient(ellipse at center top, ${SHINE_COLORS.orangeGlow} 0%, transparent 65%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Grid pattern overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(${SHINE_COLORS.border} 1px, transparent 1px),
            linear-gradient(90deg, ${SHINE_COLORS.border} 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          opacity: 0.3,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '900px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        {/* Eyebrow */}
        <ScrollReveal direction="up">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '32px',
            }}
          >
            <div style={{ width: '40px', height: '1px', background: SHINE_COLORS.orange, opacity: 0.5 }} />
            <span
              style={{
                color: SHINE_COLORS.orange,
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.45em',
                textTransform: 'uppercase',
              }}
            >
              Delivery · Takeaway · Dine In
            </span>
            <div style={{ width: '40px', height: '1px', background: SHINE_COLORS.orange, opacity: 0.5 }} />
          </div>
        </ScrollReveal>

        {/* Headline */}
        <ScrollReveal direction="up" delay={60}>
          <h2
            style={{
              margin: '0 0 12px',
              lineHeight: 0.9,
              fontWeight: 900,
              letterSpacing: '-0.04em',
            }}
          >
            <span
              style={{
                display: 'block',
                fontSize: 'clamp(3rem, 8vw, 7rem)',
                color: SHINE_COLORS.cream,
              }}
            >
              ¿Con
            </span>
            <span
              style={{
                display: 'block',
                fontSize: 'clamp(3rem, 8vw, 7rem)',
                color: 'transparent',
                WebkitTextStroke: `1px ${SHINE_COLORS.orange}`,
              }}
            >
              Hambre?
            </span>
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100}>
          <p
            style={{
              color: SHINE_COLORS.muted,
              fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
              lineHeight: 1.7,
              margin: '28px auto 48px',
              maxWidth: '460px',
            }}
          >
            Rolls artesanales y ceviches Nikkei listos en 30–45 minutos.
            Cuatro locales en Iquique y Alto Hospicio.
          </p>
        </ScrollReveal>

        {/* CTAs */}
        <ScrollReveal direction="up" delay={140}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'center',
              marginBottom: '48px',
            }}
          >
            <a
              href={`${basePath}/menu`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: SHINE_COLORS.orange,
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                padding: '18px 44px',
                borderRadius: '2px',
                boxShadow: `0 12px 48px rgba(232,117,26,0.4)`,
                transition: 'all 0.25s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 60px rgba(232,117,26,0.5)`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 48px rgba(232,117,26,0.4)`;
              }}
            >
              <ShoppingBag size={18} />
              {ctaDeliveryText}
            </a>

            <a
              href={ctaReservationHref}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: 'transparent',
                color: SHINE_COLORS.cream,
                fontWeight: 600,
                fontSize: '0.85rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                padding: '18px 40px',
                borderRadius: '2px',
                border: `1px solid ${SHINE_COLORS.border}`,
                transition: 'all 0.25s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = SHINE_COLORS.orange;
                (e.currentTarget as HTMLElement).style.color = SHINE_COLORS.orange;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = SHINE_COLORS.border;
                (e.currentTarget as HTMLElement).style.color = SHINE_COLORS.cream;
              }}
            >
              <Phone size={18} />
              {ctaReservationText}
            </a>
          </div>
        </ScrollReveal>

        {/* Social proof strip */}
        <ScrollReveal direction="up" delay={180}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              flexWrap: 'wrap',
            }}
          >
            {[
              { value: '4.5★', label: 'Google Reviews' },
              { value: '4', label: 'Sucursales' },
              { value: '30–45', label: 'Min delivery' },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  padding: '0 24px',
                  borderRight: i < 2 ? `1px solid ${SHINE_COLORS.border}` : 'none',
                }}
              >
                <span
                  style={{
                    color: SHINE_COLORS.orange,
                    fontSize: '1.1rem',
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {s.value}
                </span>
                <span
                  style={{
                    color: SHINE_COLORS.dim,
                    fontSize: '0.62rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
