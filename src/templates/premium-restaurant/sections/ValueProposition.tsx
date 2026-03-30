'use client';

import { Flame, MapPin, Truck } from 'lucide-react';
import { SectionProps } from '../../types';
import { ScrollReveal } from '../../sections/ScrollReveal';
import { ValuePropositionContent, ValuePropositionItem } from '../../types';

const ICON_MAP: Record<string, React.ReactNode> = {
  flame: <Flame className="w-7 h-7" />,
  mapPin: <MapPin className="w-7 h-7" />,
  truck: <Truck className="w-7 h-7" />,
};

const DEFAULT_ITEMS: ValuePropositionItem[] = [
  {
    icon: 'flame',
    title: 'Fusión Nikkei Premium',
    description: 'Sabores japoneses y peruanos fusionados en cada plato. Rolls gourmet, ceviches y tiraditos únicos en Iquique.',
  },
  {
    icon: 'mapPin',
    title: '3 Sucursales en Iquique',
    description: 'Playa Brava, Mall Zofri y Alto Hospicio. Siempre cerca de ti con el mismo estándar de calidad.',
  },
  {
    icon: 'truck',
    title: 'Restobar & Delivery',
    description: 'Vive la experiencia en el local o pide a domicilio vía Rappi y Uber Eats. Sabor sin fronteras.',
  },
];

export function ValueProposition({ content }: SectionProps) {
  const typedContent = content as unknown as Partial<ValuePropositionContent>;
  const items = typedContent.items && typedContent.items.length > 0 ? typedContent.items : DEFAULT_ITEMS;
  const title = typedContent.title || 'Por qué elegirnos';

  return (
    <section className="py-24 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #fff8f3 0%, #fff 50%, #fff5ee 100%)' }}>
      {/* Decorative warm gradient blobs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'var(--theme-accent, #EA580C)' }} />
      <div className="absolute -bottom-32 -left-32 w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'var(--theme-primary, #c2410c)' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal direction="up" className="text-center mb-16">
          <p className="text-sm font-bold tracking-widest uppercase mb-3 opacity-60"
            style={{ color: 'var(--theme-accent, #EA580C)' }}>
            Nuestra diferencia
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 leading-tight"
            style={{ fontFamily: 'var(--theme-heading-font)' }}>
            {title}
          </h2>
          <div className="h-1.5 w-16 mx-auto rounded-full" style={{ background: 'var(--theme-accent, #EA580C)' }} />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item: ValuePropositionItem, idx: number) => (
            <ScrollReveal key={idx} delay={idx * 150} direction="up" className="h-full">
              <div className="group h-full p-8 rounded-2xl bg-white border border-orange-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
                {/* Card accent gradient */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--theme-accent, #EA580C) 4%, transparent), transparent)' }} />

                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 relative z-10"
                  style={{ background: 'var(--theme-accent, #EA580C)' }}>
                  {ICON_MAP[item.icon] ?? <Flame className="w-7 h-7" />}
                </div>

                <h3 className="text-xl font-black text-gray-900 mb-3 relative z-10"
                  style={{ fontFamily: 'var(--theme-heading-font)' }}>
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed relative z-10 text-base">
                  {item.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
