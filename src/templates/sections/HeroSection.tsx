'use client';

import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { SectionProps } from '../types';
import { ScrollReveal } from './ScrollReveal';

export function HeroSection({ content, restaurant }: SectionProps) {
  const title = content.title as string | undefined;
  const subtitle = content.subtitle as string | undefined;
  const ctaText = (content.ctaText as string) || 'Ver Menú';
  const coverImage = content.coverImage as string | undefined;
  const logo = restaurant.logoUrl;
  const image = coverImage || restaurant.coverImageUrl;

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background with subtle animation */}
      {image ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={image}
            alt={restaurant.name}
            fill
            className="object-cover opacity-60 scale-105 transition-transform duration-[20000ms] hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-linear-to-br from-[var(--theme-primary,#111)] to-[var(--theme-secondary,#333)] opacity-80" />
      )}

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <ScrollReveal direction="none" delay={200}>
          {logo && (
            <div className="relative h-24 w-24 mx-auto mb-8 md:h-32 md:w-32 bg-white/10 backdrop-blur-md rounded-full p-2 border border-white/20">
               <Image
                 src={logo}
                 alt={restaurant.name}
                 fill
                 className="object-contain p-2"
               />
            </div>
          )}
        </ScrollReveal>

        <ScrollReveal direction="up" delay={400}>
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl font-[var(--theme-heading-font)] tracking-tight">
            {title || restaurant.name}
          </h1>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={600}>
          <p className="text-lg md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-[var(--theme-font)] font-light">
            {subtitle || restaurant.description}
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={800}>
          <a
            href={`/${restaurant.slug}/menu`}
            className="inline-block px-10 py-4 bg-[var(--theme-primary,#000)] text-white font-bold text-xl rounded-[var(--theme-radius,0.5rem)] hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-[var(--theme-primary)]/40"
          >
            {ctaText}
          </a>
        </ScrollReveal>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white animate-bounce">
        <ChevronDown size={32} strokeWidth={1.5} />
      </div>
    </section>
  );
}
