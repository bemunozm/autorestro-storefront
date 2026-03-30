'use client';

import { useState } from 'react';
import { MapPin, Phone, Clock, Navigation, Sparkles } from 'lucide-react';
import { SectionProps } from '../../types';
import { ScrollReveal } from '../../sections/ScrollReveal';
import { LocationsContent, Location } from '../../types';

const DEFAULT_LOCATIONS: Location[] = [
  {
    name: 'Playa Brava',
    address: 'Av. Arturo Prat 3286, Iquique',
    phone: '+56 57 244 3313',
    features: ['Vista Playa Brava', 'Outdoor Seating', 'Música en Vivo', 'Estacionamiento'],
    schedule: 'Lun–Dom: 12:30 – 00:00',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Av.+Arturo+Prat+3286+Iquique',
  },
  {
    name: 'Mall Zofri',
    address: 'Mall Zofri, Local 302, Iquique',
    phone: '+56 57 244 3313',
    features: ['Local en Mall', 'Estacionamiento Gratis', 'CMR Falabella'],
    schedule: 'Dom–Jue: 12:30–23:00 / Vie–Sáb: 12:30–00:00',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mall+Zofri+Iquique',
  },
  {
    name: 'Alto Hospicio',
    address: 'Av. Los Cóndores 3110, Alto Hospicio',
    phone: '+56 57 244 3313',
    features: ['Barrio Residencial', 'Menú del día', 'Para llevar'],
    schedule: 'Lun–Sáb: 11:00 – 19:00',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Av.+Los+Condores+3110+Alto+Hospicio',
  },
];

export function LocationsMap({ content }: SectionProps) {
  const typedContent = content as unknown as Partial<LocationsContent>;
  const locations = typedContent.locations && typedContent.locations.length > 0
    ? typedContent.locations
    : DEFAULT_LOCATIONS;
  const title = typedContent.title || 'Nuestras Sucursales';

  const [activeIdx, setActiveIdx] = useState(0);
  const active = locations[activeIdx];

  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal direction="up" className="text-center mb-16">
          <p className="text-sm font-bold tracking-widest uppercase mb-3 opacity-60"
            style={{ color: 'var(--theme-accent, #EA580C)' }}>
            Encuéntranos
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4"
            style={{ fontFamily: 'var(--theme-heading-font)' }}>
            {title}
          </h2>
          <div className="h-1.5 w-16 mx-auto rounded-full" style={{ background: 'var(--theme-accent, #EA580C)' }} />
        </ScrollReveal>

        {/* Tab selector */}
        <ScrollReveal direction="up" delay={100}>
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {locations.map((loc: Location, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 border-2 ${
                  activeIdx === idx
                    ? 'text-white border-transparent shadow-lg scale-105'
                    : 'bg-transparent text-gray-600 border-gray-200 hover:border-orange-300'
                }`}
                style={activeIdx === idx ? { background: 'var(--theme-accent, #EA580C)', borderColor: 'var(--theme-accent, #EA580C)' } : {}}
              >
                <MapPin className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5" />
                {loc.name}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Location details + map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Info card */}
          <ScrollReveal direction="left" className="h-full">
            <div className="h-full p-8 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3"
                style={{ fontFamily: 'var(--theme-heading-font)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                  style={{ background: 'var(--theme-accent, #EA580C)' }}>
                  <MapPin className="w-5 h-5" />
                </div>
                Sucursal {active.name}
              </h3>

              <div className="space-y-5 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0"
                    style={{ color: 'var(--theme-accent, #EA580C)' }}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-0.5">Dirección</p>
                    <p className="text-gray-800 font-medium">{active.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0"
                    style={{ color: 'var(--theme-accent, #EA580C)' }}>
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-0.5">Teléfono</p>
                    <a href={`tel:${active.phone}`} className="text-gray-800 font-medium hover:underline">
                      {active.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0"
                    style={{ color: 'var(--theme-accent, #EA580C)' }}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-0.5">Horarios</p>
                    <p className="text-gray-800 font-medium">{active.schedule}</p>
                  </div>
                </div>
              </div>

              {/* Features */}
              {active.features.length > 0 && (
                <div className="mb-8">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Características</p>
                  <div className="flex flex-wrap gap-2">
                    {active.features.map((feat: string, i: number) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-orange-50 border border-orange-100"
                        style={{ color: 'var(--theme-accent, #EA580C)' }}>
                        <Sparkles className="w-3 h-3" />
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <a
                href={active.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-[var(--theme-radius,0.5rem)] font-bold text-white transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg"
                style={{ background: 'var(--theme-accent, #EA580C)' }}
              >
                <Navigation className="w-5 h-5" />
                Cómo llegar (Google Maps)
              </a>
            </div>
          </ScrollReveal>

          {/* Map placeholder */}
          <ScrollReveal direction="right" className="h-full min-h-[400px]">
            <div className="h-full rounded-2xl overflow-hidden relative group shadow-xl border border-gray-100 min-h-[380px]">
              {/* Decorative map placeholder */}
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{ backgroundImage: 'radial-gradient(circle, #888 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              </div>
              {/* Animated ping marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="relative">
                  <div className="absolute -inset-4 rounded-full animate-ping opacity-25"
                    style={{ background: 'var(--theme-accent, #EA580C)' }} />
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-xl"
                    style={{ background: 'var(--theme-accent, #EA580C)' }}>
                    <MapPin className="w-5 h-5" />
                  </div>
                </div>
              </div>
              {/* Location label */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg text-sm font-bold text-gray-800 whitespace-nowrap border border-gray-100 z-10">
                {active.name} — {active.address}
              </div>
              {/* Hover overlay */}
              <a
                href={active.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
                style={{ background: 'color-mix(in srgb, var(--theme-accent, #EA580C) 80%, black)' }}
              >
                <span className="flex items-center gap-2 text-white font-bold text-lg">
                  <Navigation className="w-6 h-6" />
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
