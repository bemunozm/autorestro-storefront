'use client';

import Image from 'next/image';
import { ArrowRight, Flame } from 'lucide-react';
import { SectionProps } from '../../types';
import { ScrollReveal } from '../../sections/ScrollReveal';
import { SHINE_COLORS, DEFAULT_DISHES, ShineDish } from '../data/defaults';
import { useRestaurant } from '@/providers/restaurant-provider';

export function ShineSushiMenu({ content, restaurant: _restaurant }: SectionProps) {
  const { basePath } = useRestaurant();
  const rawDishes = content.dishes as ShineDish[] | undefined;
  const dishes = rawDishes && rawDishes.length > 0 ? rawDishes : DEFAULT_DISHES;
  const title = (content.title as string | undefined) || 'Platos Destacados';

  const featured = dishes[0];
  const rest = dishes.slice(1);

  return (
    <section
      id="menu"
      style={{
        backgroundColor: SHINE_COLORS.bg,
        padding: 'clamp(80px, 12vh, 140px) clamp(24px, 6vw, 80px)',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Section header */}
        <ScrollReveal direction="up">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '56px',
              flexWrap: 'wrap',
              gap: '24px',
            }}
          >
            <div>
              <p
                style={{
                  color: SHINE_COLORS.orange,
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}
              >
                Lo mejor de nuestra carta
              </p>
              <h2
                style={{
                  color: SHINE_COLORS.cream,
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  margin: 0,
                }}
              >
                {title}
              </h2>
            </div>
            <a
              href={`${basePath}/menu`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: SHINE_COLORS.orange,
                textDecoration: 'none',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                paddingBottom: '4px',
                borderBottom: `1px solid ${SHINE_COLORS.border}`,
                transition: 'border-color 0.25s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderBottomColor = SHINE_COLORS.orange; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderBottomColor = SHINE_COLORS.border; }}
            >
              Ver todo el menú <ArrowRight size={14} />
            </a>
          </div>
        </ScrollReveal>

        {/* Magazine grid: 1 large + 4 small */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '12px',
          }}
        >
          {/* Featured dish — spans 7 columns */}
          {featured && (
            <ScrollReveal direction="left" className="col-span-12 lg:col-span-7">
              <div
                style={{
                  position: 'relative',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  aspectRatio: '16/10',
                  cursor: 'pointer',
                  background: SHINE_COLORS.surface,
                }}
                className="group"
              >
                <Image
                  src={featured.imageUrl}
                  alt={featured.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Cinematic gradient */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(to top, rgba(12,8,4,0.95) 0%, rgba(12,8,4,0.4) 55%, transparent 100%)`,
                  }}
                />

                {featured.popular && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '20px',
                      left: '20px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: SHINE_COLORS.orange,
                      color: '#fff',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      padding: '6px 14px',
                      borderRadius: '2px',
                    }}
                  >
                    <Flame size={11} /> Plato Insignia
                  </div>
                )}

                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px' }}>
                  <div
                    style={{
                      display: 'inline-block',
                      background: SHINE_COLORS.goldDim,
                      border: `1px solid ${SHINE_COLORS.borderGold}`,
                      color: SHINE_COLORS.gold,
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      padding: '4px 12px',
                      borderRadius: '2px',
                      marginBottom: '10px',
                    }}
                  >
                    {featured.price}
                  </div>
                  <h3
                    style={{
                      color: SHINE_COLORS.cream,
                      fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                      fontWeight: 900,
                      letterSpacing: '-0.02em',
                      lineHeight: 1.1,
                      margin: '0 0 8px',
                    }}
                  >
                    {featured.name}
                  </h3>
                  <p
                    style={{
                      color: SHINE_COLORS.muted,
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      margin: 0,
                      maxWidth: '420px',
                    }}
                  >
                    {featured.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Side dishes — 5 columns, 2-row grid */}
          <div
            style={{
              gridColumn: 'span 12',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
            }}
            className="lg:col-span-5"
          >
            {rest.slice(0, 4).map((dish, idx) => (
              <ScrollReveal key={idx} direction="up" delay={idx * 60}>
                <div
                  style={{
                    position: 'relative',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    aspectRatio: '4/3',
                    cursor: 'pointer',
                    background: SHINE_COLORS.surface,
                  }}
                  className="group"
                >
                  <Image
                    src={dish.imageUrl}
                    alt={dish.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(to top, rgba(12,8,4,0.92) 0%, transparent 60%)`,
                    }}
                  />

                  {dish.popular && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: SHINE_COLORS.orange,
                        color: '#fff',
                        fontSize: '0.55rem',
                        fontWeight: 800,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        padding: '4px 8px',
                        borderRadius: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Flame size={9} />
                      Popular
                    </div>
                  )}

                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px' }}>
                    <div
                      style={{
                        color: SHINE_COLORS.gold,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        marginBottom: '4px',
                      }}
                    >
                      {dish.price}
                    </div>
                    <h3
                      style={{
                        color: SHINE_COLORS.cream,
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        letterSpacing: '-0.01em',
                        lineHeight: 1.2,
                        margin: '0 0 4px',
                      }}
                    >
                      {dish.name}
                    </h3>
                    <p
                      style={{
                        color: SHINE_COLORS.dim,
                        fontSize: '0.72rem',
                        lineHeight: 1.4,
                        margin: 0,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical' as const,
                      }}
                    >
                      {dish.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
