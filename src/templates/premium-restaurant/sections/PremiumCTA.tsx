'use client';

import { ArrowRight, TrendingUp } from 'lucide-react';
import { SectionProps } from '../../types';
import { ScrollReveal } from '../../sections/ScrollReveal';
import { useRestaurant } from '@/providers/restaurant-provider';

export function PremiumCTA({ content, restaurant }: SectionProps) {
  const { basePath } = useRestaurant();
  const headline = (content.headline as string) || '¿Listo para vivir la fusión?';
  const subtext = (content.subtext as string) || 'Sushi, ceviches y tiraditos con el alma nikkei que Iquique nunca había probado.';
  const ctaText = (content.ctaText as string) || 'Ver Menú Completo';
  const socialProof = (content.socialProof as string) || 'Más de 500 pedidos este mes';

  return (
    <section className="relative py-28 px-6 overflow-hidden" style={{ background: 'linear-gradient(135deg, #EA580C 0%, #C2410C 50%, #9A3412 100%)' }}>
      {/* Background effects */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-black/20 rounded-full blur-3xl pointer-events-none" />

      {/* Grain texture overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {/* Social proof micro-badge */}
        <ScrollReveal direction="up">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 text-white/90 text-sm font-bold mb-8">
            <TrendingUp className="w-4 h-4" />
            {socialProof}
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100}>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tight"
            style={{ fontFamily: 'var(--theme-heading-font)', textShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
            {headline}
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={200}>
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            {subtext}
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={300}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={`${basePath}/menu`}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 min-h-[56px] px-10 py-4 bg-white font-black text-lg rounded-[var(--theme-radius,0.5rem)] transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl"
              style={{ color: 'var(--theme-accent, #EA580C)' }}
            >
              {ctaText}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            {restaurant.phone && (
              <a
                href={`tel:${restaurant.phone}`}
                className="w-full sm:w-auto inline-flex items-center justify-center min-h-[56px] px-10 py-4 bg-transparent border-2 border-white/40 backdrop-blur-md text-white font-bold text-lg rounded-[var(--theme-radius,0.5rem)] hover:bg-white/10 hover:border-white/70 transition-all duration-300"
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
