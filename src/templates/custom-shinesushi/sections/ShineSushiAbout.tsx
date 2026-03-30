'use client';

import Image from 'next/image';
import { SectionProps } from '../../types';
import { ScrollReveal } from '../../sections/ScrollReveal';
import { SHINE_COLORS } from '../data/defaults';

interface StatItem {
  value: string;
  label: string;
}

const DEFAULT_STATS: StatItem[] = [
  { value: '4.0★', label: 'TripAdvisor' },
  { value: '3', label: 'Sucursales' },
  { value: '100%', label: 'Fusión Única' },
];

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=900';

export function ShineSushiAbout({ content }: SectionProps) {
  const title = (content.title as string | undefined) || 'Fusión Nikkei Premium';
  const description =
    (content.description as string | undefined) ||
    'Shine Sushi nació de la pasión por unir dos grandes culturas culinarias: la precisión japonesa y la intensidad peruana. Cada plato es una historia de sabores que viajan desde el Pacífico, preparados con ingredientes seleccionados y técnicas que han conquistado a Iquique y sus alrededores.';
  const imageUrl = (content.imageUrl as string | undefined) || DEFAULT_IMAGE;
  const rawStats = content.stats as StatItem[] | undefined;
  const stats = rawStats && rawStats.length > 0 ? rawStats : DEFAULT_STATS;

  return (
    <section
      className="py-24 px-6 overflow-hidden"
      style={{ backgroundColor: SHINE_COLORS.surface }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Image */}
        <ScrollReveal direction="left">
          <div
            className="relative h-[420px] md:h-[520px] rounded-sm overflow-hidden"
            style={{
              boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px ${SHINE_COLORS.gold}20`,
            }}
          >
            <Image
              src={imageUrl}
              alt="Shine Sushi — Fusión Nikkei"
              fill
              loading="lazy"
              className="object-cover"
            />
            {/* Overlay gradient bottom */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, ${SHINE_COLORS.primary}80 0%, transparent 60%)`,
              }}
            />
            {/* Gold accent corner */}
            <div
              className="absolute top-0 left-0 w-24 h-1"
              style={{ background: SHINE_COLORS.gold }}
            />
            <div
              className="absolute top-0 left-0 w-1 h-24"
              style={{ background: SHINE_COLORS.gold }}
            />
          </div>
        </ScrollReveal>

        {/* Text */}
        <ScrollReveal direction="right">
          <div>
            {/* Eyebrow */}
            <p
              className="text-xs font-bold tracking-[0.35em] uppercase mb-4"
              style={{ color: SHINE_COLORS.gold }}
            >
              Nuestra Historia
            </p>

            {/* Title */}
            <h2
              className="font-black text-white mb-6 leading-tight"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
            >
              {title}
            </h2>

            {/* Gold rule */}
            <div
              className="h-px w-16 mb-8"
              style={{ background: SHINE_COLORS.gold }}
            />

            {/* Description */}
            <p
              className="text-lg leading-relaxed mb-10"
              style={{ color: `${SHINE_COLORS.cream}CC` }}
            >
              {description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat: StatItem, i: number) => (
                <div
                  key={i}
                  className="text-center py-4 px-2 rounded-sm"
                  style={{
                    background: `${SHINE_COLORS.gold}0C`,
                    border: `1px solid ${SHINE_COLORS.gold}25`,
                  }}
                >
                  <p
                    className="text-2xl font-black mb-1"
                    style={{ color: SHINE_COLORS.gold }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="text-xs font-medium tracking-wider uppercase"
                    style={{ color: `${SHINE_COLORS.cream}80` }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
