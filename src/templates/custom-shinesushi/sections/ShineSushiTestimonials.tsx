'use client';

import { useState, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionProps } from '../../types';
import { ScrollReveal } from '../../sections/ScrollReveal';
import { SHINE_COLORS, DEFAULT_TESTIMONIALS, ShineTestimonial } from '../data/defaults';

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export function ShineSushiTestimonials({ content }: SectionProps) {
  const rawTestimonials = content.testimonials as ShineTestimonial[] | undefined;
  const testimonials =
    rawTestimonials && rawTestimonials.length > 0 ? rawTestimonials : DEFAULT_TESTIMONIALS;

  const [activeIdx, setActiveIdx] = useState(0);

  const prev = useCallback(() => {
    setActiveIdx((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  }, [testimonials.length]);

  const next = useCallback(() => {
    setActiveIdx((i) => (i === testimonials.length - 1 ? 0 : i + 1));
  }, [testimonials.length]);

  const active = testimonials[activeIdx];

  return (
    <section
      style={{
        backgroundColor: SHINE_COLORS.surface,
        padding: 'clamp(80px, 12vh, 140px) clamp(24px, 6vw, 80px)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Background radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '700px',
          background: `radial-gradient(circle, ${SHINE_COLORS.orangeDim} 0%, transparent 65%)`,
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>

        {/* Header — split layout */}
        <ScrollReveal direction="up">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              alignItems: 'flex-end',
              gap: '32px',
              marginBottom: '64px',
              flexWrap: 'wrap',
            }}
            className="testimonials-header"
          >
            <div>
              {/* Google badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: SHINE_COLORS.card,
                  border: `1px solid ${SHINE_COLORS.border}`,
                  padding: '8px 14px',
                  borderRadius: '4px',
                  marginBottom: '20px',
                }}
              >
                <GoogleIcon />
                <div style={{ display: 'flex', gap: '2px' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      style={{ fill: SHINE_COLORS.orange, color: SHINE_COLORS.orange }}
                    />
                  ))}
                </div>
                <span
                  style={{
                    color: SHINE_COLORS.orange,
                    fontWeight: 800,
                    fontSize: '0.85rem',
                  }}
                >
                  4.5
                </span>
                <span
                  style={{
                    color: SHINE_COLORS.dim,
                    fontSize: '0.72rem',
                  }}
                >
                  +500 reseñas
                </span>
              </div>

              <h2
                style={{
                  color: SHINE_COLORS.cream,
                  fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.05,
                  margin: 0,
                }}
              >
                Lo que dicen<br />
                <span style={{ color: 'transparent', WebkitTextStroke: `1px ${SHINE_COLORS.orange}` }}>
                  nuestros clientes
                </span>
              </h2>
            </div>

            {/* Nav controls — desktop */}
            <div
              style={{ display: 'flex', gap: '8px', alignSelf: 'flex-end' }}
              className="testimonial-nav"
            >
              <button
                onClick={prev}
                aria-label="Reseña anterior"
                style={{
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: `1px solid ${SHINE_COLORS.border}`,
                  color: SHINE_COLORS.muted,
                  cursor: 'pointer',
                  borderRadius: '2px',
                  transition: 'all 0.25s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = SHINE_COLORS.orange;
                  (e.currentTarget as HTMLElement).style.color = SHINE_COLORS.orange;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = SHINE_COLORS.border;
                  (e.currentTarget as HTMLElement).style.color = SHINE_COLORS.muted;
                }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                aria-label="Siguiente reseña"
                style={{
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: SHINE_COLORS.orange,
                  border: `1px solid ${SHINE_COLORS.orange}`,
                  color: '#fff',
                  cursor: 'pointer',
                  borderRadius: '2px',
                  transition: 'all 0.25s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = '0.85';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = '1';
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Featured testimonial */}
        <ScrollReveal direction="up" delay={100}>
          <div
            style={{
              position: 'relative',
              background: SHINE_COLORS.card,
              border: `1px solid ${SHINE_COLORS.border}`,
              padding: 'clamp(32px, 5vw, 64px)',
              marginBottom: '24px',
              overflow: 'hidden',
            }}
          >
            {/* Left accent */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '3px',
                height: '100%',
                background: `linear-gradient(to bottom, ${SHINE_COLORS.orange}, transparent)`,
              }}
            />

            {/* Giant quote mark — decorative */}
            <div
              style={{
                position: 'absolute',
                top: '-20px',
                right: '40px',
                fontSize: '12rem',
                fontWeight: 900,
                lineHeight: 1,
                color: `rgba(232,117,26,0.04)`,
                fontFamily: 'Georgia, serif',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            >
              &ldquo;
            </div>

            {/* Stars */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '28px' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  style={{
                    fill: i < active.rating ? SHINE_COLORS.orange : 'transparent',
                    color: i < active.rating ? SHINE_COLORS.orange : SHINE_COLORS.border,
                  }}
                />
              ))}
            </div>

            {/* Quote */}
            <blockquote
              style={{
                color: SHINE_COLORS.cream,
                fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                fontWeight: 300,
                fontStyle: 'italic',
                lineHeight: 1.6,
                margin: '0 0 36px',
                maxWidth: '780px',
              }}
            >
              &ldquo;{active.text}&rdquo;
            </blockquote>

            {/* Author */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: SHINE_COLORS.orangeDim,
                  border: `1px solid ${SHINE_COLORS.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: SHINE_COLORS.orange,
                  fontWeight: 800,
                  fontSize: '1rem',
                  flexShrink: 0,
                }}
              >
                {active.name.charAt(0)}
              </div>
              <div>
                <p
                  style={{
                    color: SHINE_COLORS.cream,
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    margin: '0 0 4px',
                  }}
                >
                  {active.name}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {active.platform === 'google' && <GoogleIcon />}
                  <span
                    style={{
                      color: SHINE_COLORS.dim,
                      fontSize: '0.68rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {active.platform === 'google' ? 'Google Review' : 'Cliente verificado'}
                  </span>
                </div>
              </div>

              {/* Counter */}
              <span
                style={{
                  marginLeft: 'auto',
                  color: SHINE_COLORS.dim,
                  fontSize: '0.7rem',
                  letterSpacing: '0.15em',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {String(activeIdx + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* Dot indicators */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          {testimonials.map((_: ShineTestimonial, idx: number) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              aria-label={`Ir a reseña ${idx + 1}`}
              style={{
                width: activeIdx === idx ? '28px' : '8px',
                height: '4px',
                borderRadius: '2px',
                background: activeIdx === idx ? SHINE_COLORS.orange : SHINE_COLORS.border,
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1), background 0.3s',
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .testimonials-header {
            grid-template-columns: 1fr !important;
          }
          .testimonial-nav {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
