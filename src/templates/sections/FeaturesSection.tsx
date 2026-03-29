'use client';

import { Utensils, Truck, Store } from 'lucide-react';
import { SectionProps } from '../types';
import { ScrollReveal } from './ScrollReveal';

export function FeaturesSection({ restaurant }: SectionProps) {
  const { features } = restaurant;

  const cards = [
    {
      id: 'dineIn',
      icon: <Utensils className="w-8 h-8 text-[var(--theme-primary,#111)]" />,
      title: 'Comer en el local',
      description: 'Disfruta de nuestra experiencia completa con el mejor servicio y ambiente.',
      active: features?.dineIn
    },
    {
      id: 'delivery',
      icon: <Truck className="w-8 h-8 text-[var(--theme-primary,#111)]" />,
      title: 'Delivery',
      description: 'Llevamos tus platos favoritos directamente a la puerta de tu casa.',
      active: features?.delivery
    },
    {
      id: 'pickup',
      icon: <Store className="w-8 h-8 text-[var(--theme-primary,#111)]" />,
      title: 'Para llevar',
      description: 'Pide online y retira en el local sin esperas, siempre fresco y caliente.',
      active: features?.pickup
    }
  ].filter(c => c.active);

  if (cards.length === 0) return null;

  return (
    <section className="py-24 px-6 bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal direction="up" className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-[var(--theme-heading-font)] mb-4 text-gray-900 dark:text-white">Nuestros Servicios</h2>
          <div className="h-1.5 w-24 bg-[var(--theme-primary,#111)] mx-auto rounded-full" />
        </ScrollReveal>

        <div className={`grid grid-cols-1 gap-8 ${cards.length === 3 ? 'md:grid-cols-3' : cards.length === 2 ? 'md:grid-cols-2' : ''}`}>
          {cards.map((card, idx) => (
            <ScrollReveal key={card.id} delay={idx * 150} direction="up" className="h-full">
              <div className="group h-full p-10 rounded-3xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900 hover:bg-white dark:hover:bg-gray-800/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden">
                {/* Hover gradient accent */}
                <div className="absolute inset-0 bg-linear-to-br from-[var(--theme-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 shadow-md flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform relative z-10">
                  {card.icon}
                </div>
                
                <h3 className="text-2xl font-bold font-[var(--theme-heading-font)] mb-4 text-gray-900 dark:text-white relative z-10">{card.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 font-[var(--theme-font)] leading-relaxed relative z-10 text-lg">
                  {card.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
