'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { SectionProps } from '../../types';
import { ScrollReveal } from '../../sections/ScrollReveal';
import { useRestaurant } from '@/providers/restaurant-provider';
import { MenuHighlightsContent, MenuDish } from '../../types';

const DEFAULT_DISHES: MenuDish[] = [
  {
    name: 'Shine Roll',
    description: 'Camarón tempura, palta, queso crema, cubierto con salmón y salsa de la casa',
    price: '$7.500',
    imageUrl: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?q=80&w=800',
  },
  {
    name: 'Ceviche Nikkei',
    description: 'Pescado fresco marinado con leche de tigre, ají amarillo y chips de camote',
    price: '$8.900',
    imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800',
  },
  {
    name: 'Tiradito Clásico',
    description: 'Láminas de pescado sobre crema de ají amarillo, cilantro y limón',
    price: '$7.200',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800',
  },
  {
    name: 'Dragon Roll',
    description: 'Pepino, cangrejo real, cubierto con palta laminada y salsa teriyaki',
    price: '$8.200',
    imageUrl: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=800',
  },
  {
    name: 'Promo 40 Rolls',
    description: 'Selección de 40 piezas mixtas para compartir — la mejor relación precio-calidad',
    price: '$10.000',
    imageUrl: 'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?q=80&w=800',
  },
];

export function MenuHighlights({ content, restaurant }: SectionProps) {
  const { basePath } = useRestaurant();
  const typedContent = content as unknown as Partial<MenuHighlightsContent>;
  const dishes = typedContent.dishes && typedContent.dishes.length > 0 ? typedContent.dishes : DEFAULT_DISHES;
  const title = typedContent.title || 'Platos Destacados';
  const ctaText = typedContent.ctaText || 'Ver Menú Completo';

  return (
    <section className="py-24 px-6 bg-gray-950 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up" className="text-center mb-12">
          <p className="text-sm font-bold tracking-widest uppercase mb-3 opacity-70"
            style={{ color: 'var(--theme-accent, #EA580C)' }}>
            Lo mejor de nuestra carta
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight"
            style={{ fontFamily: 'var(--theme-heading-font)' }}>
            {title}
          </h2>
          <div className="h-1.5 w-16 mx-auto rounded-full" style={{ background: 'var(--theme-accent, #EA580C)' }} />
        </ScrollReveal>

        {/* Horizontal scroll carousel with CSS scroll-snap */}
        <div className="overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
          <div
            className="flex gap-6 w-max snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none' }}
          >
            {dishes.map((dish: MenuDish, idx: number) => (
              <div
                key={idx}
                className="snap-center flex-shrink-0 w-72 sm:w-80 rounded-2xl overflow-hidden bg-gray-900 border border-white/10 hover:border-[color:var(--theme-accent,#EA580C)] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group"
              >
                {/* Dish image */}
                <div className="relative h-52 overflow-hidden bg-gray-800">
                  {dish.imageUrl ? (
                    <Image
                      src={dish.imageUrl}
                      alt={dish.name}
                      fill
                      loading="lazy"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <span className="text-4xl">🍱</span>
                    </div>
                  )}
                  {/* Price badge */}
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm font-black text-white shadow-lg"
                    style={{ background: 'var(--theme-accent, #EA580C)' }}>
                    {dish.price}
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-lg font-black text-white mb-2"
                    style={{ fontFamily: 'var(--theme-heading-font)' }}>
                    {dish.name}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                    {dish.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <ScrollReveal direction="up" delay={300} className="text-center mt-10">
          <a
            href={`${basePath}/menu`}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-[var(--theme-radius,0.5rem)] font-bold text-white text-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl group"
            style={{
              background: 'var(--theme-accent, #EA580C)',
              boxShadow: '0 8px 24px color-mix(in srgb, var(--theme-accent, #EA580C) 35%, transparent)',
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
