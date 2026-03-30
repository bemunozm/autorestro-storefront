'use client';

import { useState, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { SectionProps } from '../../types';
import { ScrollReveal } from '../../sections/ScrollReveal';
import { SHINE_COLORS, DEFAULT_TESTIMONIALS, ShineTestimonial } from '../data/defaults';

export function ShineSushiTestimonials({ content }: SectionProps) {
  const rawTestimonials = content.testimonials as ShineTestimonial[] | undefined;
  const testimonials =
    rawTestimonials && rawTestimonials.length > 0 ? rawTestimonials : DEFAULT_TESTIMONIALS;
  const title = (content.title as string | undefined) || 'Lo Que Dicen Nuestros Clientes';

  const [activeIdx, setActiveIdx] = useState(0);

  const prev = useCallback(() => {
    setActiveIdx((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  }, [testimonials.length]);

  const next = useCallback(() => {
    setActiveIdx((i) => (i === testimonials.length - 1 ? 0 : i + 1));
  }, [testimonials.length]);

  const active = testimonials[activeIdx];

  return (
    <section
      className="py-24 px-6 overflow-hidden"
      style={{ backgroundColor: SHINE_COLORS.surface }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <ScrollReveal direction="up" className="text-center mb-16">
          <p
            className="text-xs font-bold tracking-[0.35em] uppercase mb-4"
            style={{ color: SHINE_COLORS.gold }}
          >
            Opiniones Reales
          </p>
          <h2
            className="font-black text-white mb-5 leading-tight"
            style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)' }}
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

        {/* Featured testimonial */}
        <ScrollReveal direction="up" delay={100}>
          <div
            className="relative p-8 md:p-12 mb-8"
            style={{
              background: SHINE_COLORS.primary,
              border: `1px solid ${SHINE_COLORS.gold}20`,
              boxShadow: `0 16px 60px rgba(0,0,0,0.5), 0 0 0 1px ${SHINE_COLORS.gold}08`,
            }}
          >
            {/* Quote icon */}
            <Quote
              className="absolute top-8 right-8 opacity-10"
              style={{ color: SHINE_COLORS.gold, width: 64, height: 64 }}
            />

            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5"
                  style={{
                    fill: i < active.rating ? SHINE_COLORS.gold : 'transparent',
                    color: i < active.rating ? SHINE_COLORS.gold : `${SHINE_COLORS.gold}30`,
                  }}
                />
              ))}
            </div>

            {/* Text */}
            <blockquote
              className="text-xl md:text-2xl font-light italic leading-relaxed mb-8"
              style={{ color: `${SHINE_COLORS.cream}E0` }}
            >
              &ldquo;{active.text}&rdquo;
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-4">
              {/* Avatar placeholder or image */}
              {active.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={active.avatar}
                  alt={active.name}
                  className="w-12 h-12 rounded-full object-cover"
                  style={{ border: `2px solid ${SHINE_COLORS.gold}40` }}
                />
              ) : (
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{
                    background: `${SHINE_COLORS.gold}20`,
                    color: SHINE_COLORS.gold,
                    border: `2px solid ${SHINE_COLORS.gold}40`,
                  }}
                >
                  {active.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-bold text-white">{active.name}</p>
                <p
                  className="text-xs tracking-wider uppercase"
                  style={{ color: `${SHINE_COLORS.gold}80` }}
                >
                  Cliente verificado
                </p>
              </div>
            </div>

            {/* Gold left accent bar */}
            <div
              className="absolute top-0 left-0 w-1 h-full"
              style={{
                background: `linear-gradient(to bottom, ${SHINE_COLORS.gold}, transparent)`,
              }}
            />
          </div>
        </ScrollReveal>

        {/* Controls */}
        <div className="flex items-center justify-between">
          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={prev}
              className="w-10 h-10 flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{
                background: `${SHINE_COLORS.gold}15`,
                color: SHINE_COLORS.gold,
                border: `1px solid ${SHINE_COLORS.gold}30`,
              }}
              aria-label="Reseña anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{
                background: `${SHINE_COLORS.gold}15`,
                color: SHINE_COLORS.gold,
                border: `1px solid ${SHINE_COLORS.gold}30`,
              }}
              aria-label="Siguiente reseña"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex gap-2">
            {testimonials.map((_: ShineTestimonial, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className="transition-all duration-300"
                style={{
                  width: activeIdx === idx ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: activeIdx === idx ? SHINE_COLORS.gold : `${SHINE_COLORS.gold}30`,
                }}
                aria-label={`Ir a reseña ${idx + 1}`}
              />
            ))}
          </div>

          {/* Counter */}
          <p
            className="text-sm font-medium tabular-nums"
            style={{ color: `${SHINE_COLORS.cream}60` }}
          >
            {String(activeIdx + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
          </p>
        </div>
      </div>
    </section>
  );
}
