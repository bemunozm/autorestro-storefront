'use client';

import Image from 'next/image';
import { ArrowRight, Flame } from 'lucide-react';
import { SectionProps } from '../../types';
import { ScrollReveal } from '../../sections/ScrollReveal';
import { SHINE_COLORS, DEFAULT_DISHES, ShineDish } from '../data/defaults';

export function ShineSushiMenu({ content, restaurant }: SectionProps) {
  const rawDishes = content.dishes as ShineDish[] | undefined;
  const dishes = rawDishes && rawDishes.length > 0 ? rawDishes : DEFAULT_DISHES;
  const title = (content.title as string | undefined) || 'Platos Destacados';
  const ctaText = (content.ctaText as string | undefined) || 'Ver Menú Completo';

  return (
    <section
      className="py-24 px-6 overflow-hidden"
      style={{ backgroundColor: SHINE_COLORS.primary }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollReveal direction="up" className="text-center mb-16">
          <p
            className="text-xs font-bold tracking-[0.35em] uppercase mb-4"
            style={{ color: SHINE_COLORS.gold }}
          >
            Lo mejor de nuestra carta
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

        {/* Dishes grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {dishes.map((dish: ShineDish, idx: number) => (
            <ScrollReveal key={idx} direction="up" delay={idx * 80}>
              <div
                className="group relative rounded-sm overflow-hidden cursor-pointer"
                style={{
                  border: `1px solid ${SHINE_COLORS.gold}20`,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${SHINE_COLORS.gold}60`;
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px ${SHINE_COLORS.gold}30`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${SHINE_COLORS.gold}20`;
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.4)';
                }}
              >
                {/* Image */}
                <div className="relative h-56 md:h-64 overflow-hidden bg-gray-900">
                  {dish.imageUrl ? (
                    <Image
                      src={dish.imageUrl}
                      alt={dish.name}
                      fill
                      loading="lazy"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ background: SHINE_COLORS.surface }}
                    >
                      <span className="text-5xl">🍣</span>
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, ${SHINE_COLORS.primary}E0 0%, transparent 55%)`,
                    }}
                  />

                  {/* Popular badge */}
                  {dish.popular && (
                    <div
                      className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider text-white"
                      style={{
                        backgroundColor: SHINE_COLORS.orange,
                        boxShadow: `0 4px 16px ${SHINE_COLORS.orange}60`,
                      }}
                    >
                      <Flame className="w-3 h-3" />
                      Más Popular
                    </div>
                  )}

                  {/* Price badge */}
                  <div
                    className="absolute top-4 right-4 px-3 py-1.5 rounded-sm text-sm font-black"
                    style={{
                      color: SHINE_COLORS.gold,
                      background: `${SHINE_COLORS.primary}CC`,
                      border: `1px solid ${SHINE_COLORS.gold}40`,
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    {dish.price}
                  </div>

                  {/* Name + description over image bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3
                      className="font-black text-white text-xl mb-1 leading-tight"
                    >
                      {dish.name}
                    </h3>
                    <p
                      className="text-sm leading-relaxed line-clamp-2"
                      style={{ color: `${SHINE_COLORS.cream}99` }}
                    >
                      {dish.description}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal direction="up" delay={200} className="text-center">
          <a
            href={`/${restaurant.slug}/menu`}
            className="inline-flex items-center gap-3 px-10 py-4 font-bold text-white text-base tracking-wider uppercase transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              backgroundColor: SHINE_COLORS.orange,
              boxShadow: `0 8px 32px ${SHINE_COLORS.orange}40`,
            }}
          >
            {ctaText}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
