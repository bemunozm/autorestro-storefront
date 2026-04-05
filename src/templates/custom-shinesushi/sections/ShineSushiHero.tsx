'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { SectionProps } from '../../types';
import { SHINE_COLORS } from '../data/defaults';
import { useRestaurant } from '@/providers/restaurant-provider';

export function ShineSushiHero({ content, restaurant }: SectionProps) {
  const { basePath } = useRestaurant();
  const coverImage = (content.coverImage as string | undefined) || restaurant.coverImageUrl ||
    'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1600';

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100dvh',
        width: '100%',
        overflow: 'hidden',
        background: SHINE_COLORS.bg,
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      {/* Full-bleed background image */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image
          src={coverImage}
          alt={restaurant.name}
          fill
          className="object-cover"
          priority
          style={{ objectPosition: 'center 30%' }}
        />
        {/* Layered gradients for cinematic depth */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              linear-gradient(to right, rgba(12,8,4,0.97) 0%, rgba(12,8,4,0.7) 55%, rgba(12,8,4,0.3) 100%),
              linear-gradient(to top, rgba(12,8,4,1) 0%, rgba(12,8,4,0.4) 40%, transparent 70%)
            `,
          }}
        />
        {/* Warm orange haze from bottom-left */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at 0% 100%, rgba(232,117,26,0.08) 0%, transparent 60%)`,
          }}
        />
      </div>

      {/* Vertical label — desktop only */}
      <div
        className="hidden lg:flex"
        style={{
          position: 'absolute',
          right: '32px',
          top: '50%',
          transform: 'translateY(-50%) rotate(90deg)',
          transformOrigin: 'center',
          alignItems: 'center',
          gap: '12px',
          zIndex: 10,
        }}
      >
        <div style={{ width: '40px', height: '1px', background: SHINE_COLORS.border }} />
        <span
          style={{
            color: SHINE_COLORS.dim,
            fontSize: '0.6rem',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          Iquique, Chile
        </span>
        <div style={{ width: '40px', height: '1px', background: SHINE_COLORS.border }} />
      </div>

      {/* Main content — left-aligned editorial layout */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          padding: 'clamp(100px, 15vh, 160px) clamp(24px, 6vw, 96px) clamp(64px, 10vh, 120px)',
          maxWidth: '860px',
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '28px',
          }}
        >
          <div style={{ width: '32px', height: '1px', background: SHINE_COLORS.orange }} />
          <span
            style={{
              color: SHINE_COLORS.orange,
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
            }}
          >
            Fusión Nikkei · Iquique
          </span>
        </div>

        {/* Hero headline — editorial split */}
        <h1
          style={{
            margin: '0 0 24px',
            lineHeight: 0.92,
            fontWeight: 900,
          }}
        >
          <span
            style={{
              display: 'block',
              fontSize: 'clamp(3.5rem, 9vw, 8rem)',
              color: SHINE_COLORS.cream,
              letterSpacing: '-0.03em',
            }}
          >
            La Fusión
          </span>
          <span
            style={{
              display: 'block',
              fontSize: 'clamp(3.5rem, 9vw, 8rem)',
              color: 'transparent',
              WebkitTextStroke: `1px ${SHINE_COLORS.orange}`,
              letterSpacing: '-0.03em',
            }}
          >
            Perfecta
          </span>
          <span
            style={{
              display: 'block',
              fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
              color: SHINE_COLORS.muted,
              fontWeight: 300,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginTop: '8px',
            }}
          >
            de Sabores
          </span>
        </h1>

        {/* Divider */}
        <div
          style={{
            width: '64px',
            height: '2px',
            background: `linear-gradient(to right, ${SHINE_COLORS.orange}, transparent)`,
            marginBottom: '28px',
          }}
        />

        {/* Tagline */}
        <p
          style={{
            color: SHINE_COLORS.muted,
            fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)',
            lineHeight: 1.7,
            maxWidth: '480px',
            marginBottom: '44px',
            fontWeight: 400,
          }}
        >
          Rolls artesanales, ceviches Nikkei y tiraditos con ingredientes del Pacífico.
          Cuatro locales en Iquique y Alto Hospicio.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <a
            href={`${basePath}/menu`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: SHINE_COLORS.orange,
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.82rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              padding: '16px 32px',
              borderRadius: '2px',
              boxShadow: `0 8px 40px rgba(232,117,26,0.3)`,
              transition: 'all 0.25s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 56px rgba(232,117,26,0.4)`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 40px rgba(232,117,26,0.3)`;
            }}
          >
            Pedir Ahora
            <ArrowRight size={16} />
          </a>

          <a
            href="#menu"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              color: SHINE_COLORS.cream,
              fontWeight: 600,
              fontSize: '0.82rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              padding: '16px 0',
              borderBottom: `1px solid ${SHINE_COLORS.border}`,
              transition: 'border-color 0.25s, color 0.25s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = SHINE_COLORS.orange;
              (e.currentTarget as HTMLElement).style.borderBottomColor = SHINE_COLORS.orange;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = SHINE_COLORS.cream;
              (e.currentTarget as HTMLElement).style.borderBottomColor = SHINE_COLORS.border;
            }}
          >
            Ver Menú
          </a>
        </div>

        {/* Bottom stats strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
            marginTop: '56px',
            paddingTop: '32px',
            borderTop: `1px solid rgba(239,246,255,0.06)`,
            flexWrap: 'wrap',
          }}
        >
          {[
            { value: '4.5★', label: '+500 reseñas' },
            { value: '4', label: 'Sucursales' },
            { value: '10+', label: 'Años' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span
                style={{
                  color: SHINE_COLORS.orange,
                  fontSize: '1.3rem',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
              >
                {s.value}
              </span>
              <span
                style={{
                  color: SHINE_COLORS.dim,
                  fontSize: '0.68rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div
        style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          zIndex: 10,
          animation: 'bounce 2s infinite',
        }}
      >
        <span
          style={{
            color: SHINE_COLORS.dim,
            fontSize: '0.6rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: '1px',
            height: '40px',
            background: `linear-gradient(to bottom, ${SHINE_COLORS.orange}, transparent)`,
          }}
        />
      </div>
    </section>
  );
}
