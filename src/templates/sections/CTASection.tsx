'use client';

import { SectionProps } from '../types';
import { ScrollReveal } from './ScrollReveal';
import { useRestaurant } from '@/providers/restaurant-provider';

export function CTASection({ restaurant }: SectionProps) {
  const { basePath } = useRestaurant();
  return (
    <section className="relative py-32 px-6 overflow-hidden bg-[var(--theme-primary,#111)]">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 bg-linear-to-br from-black/40 via-transparent to-black/40" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-black/20 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <ScrollReveal direction="up">
          <h2 className="text-4xl md:text-7xl font-black text-white mb-8 font-[var(--theme-heading-font)] tracking-tighter leading-[1.1] drop-shadow-2xl">
            ¿Listo para vivir una <br className="hidden md:block" />
            <span className="text-white/60">experiencia única?</span>
          </h2>
        </ScrollReveal>
        
        <ScrollReveal direction="up" delay={200}>
          <p className="text-xl md:text-2xl text-white/80 mb-12 font-[var(--theme-font)] font-light max-w-2xl mx-auto leading-relaxed">
            Explora nuestra carta, elige tus favoritos y déjanos sorprenderte con los mejores sabores de la zona.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={400}>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href={`${basePath}/menu`}
              className="w-full sm:w-auto px-12 py-6 bg-white text-[var(--theme-primary,#000)] font-black text-2xl rounded-[var(--theme-radius,1rem)] hover:scale-110 active:scale-95 transition-all shadow-2xl hover:shadow-white/20 text-center"
            >
              ¡Ver Menú ahora!
            </a>
            {restaurant.phone && (
              <a
                href={`tel:${restaurant.phone}`}
                className="w-full sm:w-auto px-10 py-5 bg-transparent border-2 border-white/20 backdrop-blur-md text-white font-bold text-xl rounded-[var(--theme-radius,1rem)] hover:bg-white/10 hover:border-white/50 transition-all shadow-xl text-center"
              >
                Reservar Mesa
              </a>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
