'use client';

import { useState } from 'react';
import { MapPin, Phone, Clock, Navigation, ChevronRight } from 'lucide-react';
import { SectionProps } from '../../types';
import { ScrollReveal } from '../../sections/ScrollReveal';
import { SHINE_COLORS, DEFAULT_LOCATIONS, ShineLocation } from '../data/defaults';

export function ShineSushiLocations({ content }: SectionProps) {
  const rawLocations = content.locations as ShineLocation[] | undefined;
  const locations =
    rawLocations && rawLocations.length > 0 ? rawLocations : DEFAULT_LOCATIONS;
  const title = (content.title as string | undefined) || 'Nuestras Sucursales';

  const [activeIdx, setActiveIdx] = useState(0);
  const active = locations[activeIdx];

  return (
    <section
      id="locations"
      style={{
        backgroundColor: SHINE_COLORS.surface,
        padding: 'clamp(80px, 12vh, 140px) clamp(24px, 6vw, 80px)',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Header */}
        <ScrollReveal direction="up">
          <div style={{ marginBottom: '64px' }}>
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
              Encuéntranos
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
        </ScrollReveal>

        {/* Main layout: location list + detail panel */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2px',
          }}
          className="locations-grid"
        >
          {/* Location selector list */}
          <ScrollReveal direction="left">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              {locations.map((loc: ShineLocation, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '20px 24px',
                    background: activeIdx === idx ? SHINE_COLORS.card : SHINE_COLORS.bg,
                    border: 'none',
                    borderLeft: `3px solid ${activeIdx === idx ? SHINE_COLORS.orange : 'transparent'}`,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.25s',
                    width: '100%',
                  }}
                  onMouseEnter={(e) => {
                    if (activeIdx !== idx) {
                      (e.currentTarget as HTMLElement).style.background = SHINE_COLORS.card;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeIdx !== idx) {
                      (e.currentTarget as HTMLElement).style.background = SHINE_COLORS.bg;
                    }
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: activeIdx === idx ? SHINE_COLORS.orange : SHINE_COLORS.orangeDim,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: activeIdx === idx ? '#fff' : SHINE_COLORS.orange,
                      flexShrink: 0,
                      transition: 'all 0.25s',
                    }}
                  >
                    <MapPin size={15} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        color: activeIdx === idx ? SHINE_COLORS.cream : SHINE_COLORS.muted,
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        margin: '0 0 2px',
                        transition: 'color 0.25s',
                      }}
                    >
                      {loc.name}
                    </p>
                    <p
                      style={{
                        color: SHINE_COLORS.dim,
                        fontSize: '0.72rem',
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {loc.address}
                    </p>
                  </div>
                  <ChevronRight
                    size={16}
                    style={{
                      color: activeIdx === idx ? SHINE_COLORS.orange : SHINE_COLORS.dim,
                      flexShrink: 0,
                      transition: 'color 0.25s',
                    }}
                  />
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Detail panel */}
          <ScrollReveal direction="right" key={`detail-${activeIdx}`}>
            <div
              style={{
                background: SHINE_COLORS.card,
                border: `1px solid ${SHINE_COLORS.border}`,
                padding: 'clamp(28px, 4vw, 48px)',
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
              }}
            >
              {/* Blue corner accent */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '2px',
                  background: `linear-gradient(to right, ${SHINE_COLORS.orange}, transparent)`,
                }}
              />

              {/* Location name */}
              <div style={{ marginBottom: '32px' }}>
                <span
                  style={{
                    color: SHINE_COLORS.orange,
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    letterSpacing: '0.35em',
                    textTransform: 'uppercase',
                  }}
                >
                  Sucursal
                </span>
                <h3
                  style={{
                    color: SHINE_COLORS.cream,
                    fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    margin: '4px 0 0',
                    lineHeight: 1.1,
                  }}
                >
                  {active.name}
                </h3>
              </div>

              {/* Info rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      background: SHINE_COLORS.orangeDim,
                      border: `1px solid ${SHINE_COLORS.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: SHINE_COLORS.orange,
                      flexShrink: 0,
                    }}
                  >
                    <MapPin size={14} />
                  </div>
                  <div>
                    <p
                      style={{
                        color: SHINE_COLORS.dim,
                        fontSize: '0.62rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        margin: '0 0 4px',
                      }}
                    >
                      Dirección
                    </p>
                    <p style={{ color: SHINE_COLORS.cream, fontSize: '0.9rem', margin: 0 }}>
                      {active.address}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      background: SHINE_COLORS.orangeDim,
                      border: `1px solid ${SHINE_COLORS.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: SHINE_COLORS.orange,
                      flexShrink: 0,
                    }}
                  >
                    <Clock size={14} />
                  </div>
                  <div>
                    <p
                      style={{
                        color: SHINE_COLORS.dim,
                        fontSize: '0.62rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        margin: '0 0 4px',
                      }}
                    >
                      Horarios
                    </p>
                    <p style={{ color: SHINE_COLORS.cream, fontSize: '0.9rem', margin: 0 }}>
                      {active.schedule}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      background: SHINE_COLORS.orangeDim,
                      border: `1px solid ${SHINE_COLORS.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: SHINE_COLORS.orange,
                      flexShrink: 0,
                    }}
                  >
                    <Phone size={14} />
                  </div>
                  <div>
                    <p
                      style={{
                        color: SHINE_COLORS.dim,
                        fontSize: '0.62rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        margin: '0 0 4px',
                      }}
                    >
                      Teléfono
                    </p>
                    <a
                      href={`tel:${active.phone}`}
                      style={{
                        color: SHINE_COLORS.cream,
                        fontSize: '0.9rem',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = SHINE_COLORS.orange; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = SHINE_COLORS.cream; }}
                    >
                      {active.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Features */}
              {active.features.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {active.features.map((feat: string, i: number) => (
                      <span
                        key={i}
                        style={{
                          color: SHINE_COLORS.orange,
                          background: SHINE_COLORS.orangeDim,
                          border: `1px solid ${SHINE_COLORS.border}`,
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                          padding: '5px 12px',
                        }}
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <a
                href={active.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: SHINE_COLORS.orange,
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  padding: '14px 28px',
                  borderRadius: '2px',
                  boxShadow: `0 8px 32px rgba(232,117,26,0.3)`,
                  transition: 'all 0.25s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 48px rgba(232,117,26,0.4)`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px rgba(232,117,26,0.3)`;
                }}
              >
                <Navigation size={15} />
                Ver en Google Maps
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .locations-grid {
            grid-template-columns: 360px 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
