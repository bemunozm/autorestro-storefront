'use client';

import { useState } from 'react';
import { MapPin, Phone, Clock, Navigation, Sparkles } from 'lucide-react';
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
      className="py-24 px-6 overflow-hidden"
      style={{ backgroundColor: SHINE_COLORS.primary }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <ScrollReveal direction="up" className="text-center mb-14">
          <p
            className="text-xs font-bold tracking-[0.35em] uppercase mb-4"
            style={{ color: SHINE_COLORS.gold }}
          >
            Encuéntranos
          </p>
          <h2
            className="font-black text-white mb-5 leading-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            {title}
          </h2>
          <div
            className="h-px w-20 mx-auto"
            style={{
              background: `linear-gradient(to right, transparent, ${SHINE_COLORS.gold}, transparent)`,
            }}
          />
        </ScrollReveal>

        {/* Tabs */}
        <ScrollReveal direction="up" delay={100}>
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {locations.map((loc: ShineLocation, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className="px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-300"
                style={
                  activeIdx === idx
                    ? {
                        backgroundColor: 'transparent',
                        color: SHINE_COLORS.gold,
                        border: `2px solid ${SHINE_COLORS.gold}`,
                        boxShadow: `0 0 20px ${SHINE_COLORS.gold}20`,
                      }
                    : {
                        backgroundColor: 'transparent',
                        color: `${SHINE_COLORS.cream}60`,
                        border: `2px solid ${SHINE_COLORS.cream}15`,
                      }
                }
              >
                <MapPin className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5" />
                {loc.name}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Location card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Details */}
          <ScrollReveal direction="left" key={`info-${activeIdx}`}>
            <div
              className="h-full p-8 rounded-sm"
              style={{
                background: SHINE_COLORS.surface,
                border: `1px solid ${SHINE_COLORS.gold}20`,
                boxShadow: `0 8px 40px rgba(0,0,0,0.4)`,
              }}
            >
              {/* Location header */}
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="w-10 h-10 flex items-center justify-center"
                  style={{ backgroundColor: SHINE_COLORS.gold, color: SHINE_COLORS.primary }}
                >
                  <MapPin className="w-5 h-5" />
                </div>
                <h3
                  className="text-xl font-black text-white"
                >
                  Sucursal {active.name}
                </h3>
              </div>

              <div className="space-y-6 mb-8">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div
                    className="w-9 h-9 flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background: `${SHINE_COLORS.gold}12`,
                      color: SHINE_COLORS.gold,
                    }}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p
                      className="text-xs font-bold uppercase tracking-[0.2em] mb-1"
                      style={{ color: `${SHINE_COLORS.cream}50` }}
                    >
                      Dirección
                    </p>
                    <p className="font-medium" style={{ color: SHINE_COLORS.cream }}>
                      {active.address}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div
                    className="w-9 h-9 flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background: `${SHINE_COLORS.gold}12`,
                      color: SHINE_COLORS.gold,
                    }}
                  >
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p
                      className="text-xs font-bold uppercase tracking-[0.2em] mb-1"
                      style={{ color: `${SHINE_COLORS.cream}50` }}
                    >
                      Teléfono
                    </p>
                    <a
                      href={`tel:${active.phone}`}
                      className="font-medium transition-colors hover:underline"
                      style={{ color: SHINE_COLORS.cream }}
                    >
                      {active.phone}
                    </a>
                  </div>
                </div>

                {/* Schedule */}
                <div className="flex items-start gap-4">
                  <div
                    className="w-9 h-9 flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background: `${SHINE_COLORS.gold}12`,
                      color: SHINE_COLORS.gold,
                    }}
                  >
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p
                      className="text-xs font-bold uppercase tracking-[0.2em] mb-1"
                      style={{ color: `${SHINE_COLORS.cream}50` }}
                    >
                      Horarios
                    </p>
                    <p className="font-medium" style={{ color: SHINE_COLORS.cream }}>
                      {active.schedule}
                    </p>
                  </div>
                </div>
              </div>

              {/* Features */}
              {active.features.length > 0 && (
                <div className="mb-8">
                  <p
                    className="text-xs font-bold uppercase tracking-[0.2em] mb-3"
                    style={{ color: `${SHINE_COLORS.cream}50` }}
                  >
                    Características
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {active.features.map((feat: string, i: number) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide"
                        style={{
                          color: SHINE_COLORS.gold,
                          background: `${SHINE_COLORS.gold}10`,
                          border: `1px solid ${SHINE_COLORS.gold}25`,
                        }}
                      >
                        <Sparkles className="w-3 h-3" />
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
                className="w-full inline-flex items-center justify-center gap-2 py-4 font-bold text-sm uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-95"
                style={{
                  backgroundColor: SHINE_COLORS.orange,
                  color: '#fff',
                  boxShadow: `0 8px 24px ${SHINE_COLORS.orange}40`,
                }}
              >
                <Navigation className="w-4 h-4" />
                Cómo Llegar — Google Maps
              </a>
            </div>
          </ScrollReveal>

          {/* Map placeholder with animated pin */}
          <ScrollReveal direction="right" className="min-h-[400px]">
            <div
              className="h-full relative overflow-hidden group min-h-[400px]"
              style={{
                background: SHINE_COLORS.surface,
                border: `1px solid ${SHINE_COLORS.gold}15`,
                boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
              }}
            >
              {/* Grid pattern */}
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage: `radial-gradient(circle, ${SHINE_COLORS.gold} 1px, transparent 1px)`,
                  backgroundSize: '28px 28px',
                }}
              />

              {/* Ping marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="relative">
                  <div
                    className="absolute -inset-6 rounded-full animate-ping opacity-20"
                    style={{ background: SHINE_COLORS.gold }}
                  />
                  <div
                    className="absolute -inset-3 rounded-full opacity-30"
                    style={{ background: SHINE_COLORS.gold }}
                  />
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-2xl"
                    style={{
                      background: SHINE_COLORS.gold,
                      color: SHINE_COLORS.primary,
                      boxShadow: `0 0 40px ${SHINE_COLORS.gold}60`,
                    }}
                  >
                    <MapPin className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Location label */}
              <div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2 text-sm font-bold whitespace-nowrap z-10"
                style={{
                  background: SHINE_COLORS.primary,
                  color: SHINE_COLORS.gold,
                  border: `1px solid ${SHINE_COLORS.gold}30`,
                }}
              >
                {active.name} · {active.address}
              </div>

              {/* Hover overlay */}
              <a
                href={active.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
                style={{
                  background: `${SHINE_COLORS.primary}D8`,
                  backdropFilter: 'blur(4px)',
                }}
              >
                <span
                  className="flex items-center gap-2 font-bold text-lg tracking-wider uppercase"
                  style={{ color: SHINE_COLORS.gold }}
                >
                  <Navigation className="w-5 h-5" />
                  Ver en Google Maps
                </span>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
