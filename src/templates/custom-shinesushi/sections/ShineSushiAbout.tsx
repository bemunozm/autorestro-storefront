'use client';

import Image from 'next/image';
import { SectionProps } from '../../types';
import { ScrollReveal } from '../../sections/ScrollReveal';
import { SHINE_COLORS } from '../data/defaults';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=900';

export function ShineSushiAbout({ content }: SectionProps) {
  const title = (content.title as string | undefined) || 'Donde el Pacífico\nSe Encuentra';
  const description =
    (content.description as string | undefined) ||
    'Shine Sushi nació de la pasión por unir dos grandes culturas culinarias: la precisión japonesa y la intensidad peruana. Cada plato es una historia de sabores preparados con ingredientes seleccionados y técnicas que han conquistado a Iquique.';
  const imageUrl = (content.imageUrl as string | undefined) || DEFAULT_IMAGE;

  return (
    <section
      id="about"
      style={{
        backgroundColor: SHINE_COLORS.surface,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Subtle background line pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 80px,
            rgba(232,117,26,0.015) 80px,
            rgba(232,117,26,0.015) 81px
          )`,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr',
          minHeight: '560px',
        }}
        className="lg:grid-cols-2"
      >
        {/* Image panel — bleeds to edge */}
        <ScrollReveal direction="left">
          <div
            style={{
              position: 'relative',
              minHeight: '400px',
              height: '100%',
            }}
          >
            <Image
              src={imageUrl}
              alt="Shine Sushi — Experiencia"
              fill
              loading="lazy"
              className="object-cover"
              style={{ objectPosition: 'center 40%' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(to right, transparent 60%, ${SHINE_COLORS.surface} 100%)`,
              }}
              className="hidden lg:block"
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(to top, ${SHINE_COLORS.surface} 0%, transparent 40%)`,
              }}
              className="lg:hidden"
            />

            {/* Floating stat card */}
            <div
              style={{
                position: 'absolute',
                bottom: '40px',
                right: '40px',
                background: 'rgba(12,8,4,0.85)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${SHINE_COLORS.border}`,
                padding: '20px 24px',
                borderRadius: '4px',
              }}
              className="hidden lg:block"
            >
              <div
                style={{
                  color: SHINE_COLORS.orange,
                  fontSize: '2rem',
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                }}
              >
                4.5★
              </div>
              <div
                style={{
                  color: SHINE_COLORS.dim,
                  fontSize: '0.65rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  marginTop: '4px',
                }}
              >
                Google Reviews
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Text panel */}
        <ScrollReveal direction="right">
          <div
            style={{
              padding: 'clamp(48px, 8vw, 96px) clamp(32px, 6vw, 80px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <p
              style={{
                color: SHINE_COLORS.orange,
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              Nuestra Historia
            </p>

            <h2
              style={{
                color: SHINE_COLORS.cream,
                fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                margin: '0 0 24px',
                whiteSpace: 'pre-line',
              }}
            >
              {title}
            </h2>

            <div
              style={{
                width: '40px',
                height: '2px',
                background: SHINE_COLORS.gold,
                marginBottom: '28px',
              }}
            />

            <p
              style={{
                color: SHINE_COLORS.muted,
                fontSize: '1rem',
                lineHeight: 1.8,
                marginBottom: '44px',
                maxWidth: '460px',
              }}
            >
              {description}
            </p>

            {/* Stats row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1px',
                background: SHINE_COLORS.border,
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              {[
                { value: '4.5★', label: 'Google' },
                { value: '4', label: 'Locales' },
                { value: '10+', label: 'Años' },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    background: SHINE_COLORS.card,
                    padding: '20px 16px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      color: SHINE_COLORS.orange,
                      fontSize: '1.4rem',
                      fontWeight: 900,
                      letterSpacing: '-0.02em',
                      lineHeight: 1,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      color: SHINE_COLORS.dim,
                      fontSize: '0.65rem',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      marginTop: '6px',
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
