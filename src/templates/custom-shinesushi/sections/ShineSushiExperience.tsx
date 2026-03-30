'use client';

import Image from 'next/image';
import { SectionProps } from '../../types';
import { ScrollReveal } from '../../sections/ScrollReveal';
import { SHINE_COLORS, DEFAULT_EXPERIENCES, ShineExperience } from '../data/defaults';

export function ShineSushiExperience({ content }: SectionProps) {
  const rawExperiences = content.experiences as ShineExperience[] | undefined;
  const experiences =
    rawExperiences && rawExperiences.length > 0 ? rawExperiences : DEFAULT_EXPERIENCES;
  const title = (content.title as string | undefined) || 'La Experiencia Shine';
  const subtitle =
    (content.subtitle as string | undefined) ||
    'Más que sushi — un ambiente único que combina sabor, música y la mejor vista del norte de Chile';

  return (
    <section
      className="py-24 px-6 overflow-hidden"
      style={{ backgroundColor: SHINE_COLORS.surface }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollReveal direction="up" className="text-center mb-16">
          <p
            className="text-xs font-bold tracking-[0.35em] uppercase mb-4"
            style={{ color: SHINE_COLORS.gold }}
          >
            Vive el Momento
          </p>
          <h2
            className="font-black text-white mb-5 leading-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            {title}
          </h2>
          <p
            className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-5"
            style={{ color: `${SHINE_COLORS.cream}99` }}
          >
            {subtitle}
          </p>
          <div
            className="h-px w-20 mx-auto"
            style={{
              background: `linear-gradient(to right, transparent, ${SHINE_COLORS.gold}, transparent)`,
            }}
          />
        </ScrollReveal>

        {/* Experiences grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {experiences.map((exp: ShineExperience, idx: number) => (
            <ScrollReveal key={idx} direction="up" delay={idx * 100}>
              <div
                className="group relative h-80 md:h-96 overflow-hidden cursor-pointer"
                style={{
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                }}
              >
                {/* Image */}
                {exp.imageUrl && (
                  <Image
                    src={exp.imageUrl}
                    alt={exp.title}
                    fill
                    loading="lazy"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}

                {/* Default dark bg if no image */}
                {!exp.imageUrl && (
                  <div
                    className="absolute inset-0"
                    style={{ background: SHINE_COLORS.primary }}
                  />
                )}

                {/* Base overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(to top, ${SHINE_COLORS.primary}E0 0%, ${SHINE_COLORS.primary}40 55%, transparent 100%)`,
                  }}
                />

                {/* Hover overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-8 text-center"
                  style={{
                    background: `${SHINE_COLORS.primary}D0`,
                    backdropFilter: 'blur(2px)',
                  }}
                >
                  {/* Gold accent line */}
                  <div
                    className="h-px w-12 mb-5"
                    style={{ background: SHINE_COLORS.gold }}
                  />
                  <p
                    className="text-base leading-relaxed"
                    style={{ color: `${SHINE_COLORS.cream}E0` }}
                  >
                    {exp.description}
                  </p>
                  <div
                    className="h-px w-12 mt-5"
                    style={{ background: SHINE_COLORS.gold }}
                  />
                </div>

                {/* Title (always visible at bottom) */}
                <div className="absolute bottom-0 left-0 right-0 p-6 transition-all duration-500 group-hover:-translate-y-2">
                  {/* Number decoration */}
                  <p
                    className="text-xs font-bold tracking-[0.3em] uppercase mb-2"
                    style={{ color: `${SHINE_COLORS.gold}90` }}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </p>
                  <h3
                    className="font-black text-white text-2xl"
                  >
                    {exp.title}
                  </h3>
                </div>

                {/* Gold corner accent */}
                <div
                  className="absolute top-0 left-0 w-16 h-0.5 transition-all duration-500 group-hover:w-full"
                  style={{ background: SHINE_COLORS.gold }}
                />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
