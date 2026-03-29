'use client';

import { Star, Quote } from 'lucide-react';
import { SectionProps } from '../types';
import { ScrollReveal } from './ScrollReveal';

export function TestimonialsSection({ content }: SectionProps) {
  const testimonials = (content.testimonials as { name: string; rating: number; text: string }[]) || [];

  const items = testimonials.length > 0 ? testimonials : [
    { name: 'María Ignacia', rating: 5, text: 'La comida es increíble, el sabor más auténtico que he probado en mucho tiempo.' },
    { name: 'Roberto Carlos', rating: 5, text: 'Excelente servicio y ambiente. Ideal para ir en familia o con amigos.' },
    { name: 'Valentina Soto', rating: 4, text: 'Muy buena experiencia, el delivery llegó rápido y todo muy bien presentado.' }
  ];

  return (
    <section className="py-24 px-6 bg-white dark:bg-black overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal direction="up" className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-[var(--theme-heading-font)] mb-4 text-gray-900 dark:text-white">Lo que dicen nuestros clientes</h2>
          <div className="flex justify-center gap-1">
             {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {items.map((item: { name: string; rating: number; text: string }, idx: number) => (
             <ScrollReveal key={idx} delay={idx * 150} direction="up" className="h-full">
                <div className="group h-full p-10 rounded-[2.5rem] bg-gray-50/50 dark:bg-zinc-900/40 border border-gray-100 dark:border-zinc-800 hover:shadow-2xl hover:bg-white dark:hover:bg-zinc-900 transition-all duration-500 relative flex flex-col">
                   <div className="absolute -top-4 right-10 w-12 h-12 bg-[var(--theme-primary)] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[var(--theme-primary)]/30 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                      <Quote className="w-6 h-6 fill-current" />
                   </div>
                   
                   <div className="flex gap-1 mb-8">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-700'}`} 
                        />
                      ))}
                   </div>
                   
                   <p className="text-gray-700 dark:text-gray-300 text-lg italic mb-10 font-[var(--theme-font)] leading-relaxed flex-grow">
                     &ldquo;{item.text}&rdquo;
                   </p>
                   
                   <div className="flex items-center gap-4 mt-auto">
                      <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[var(--theme-primary)] to-[var(--theme-secondary,#333)] flex items-center justify-center text-white font-bold text-2xl uppercase shadow-md">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-xl">{item.name}</h4>
                        <p className="text-gray-500 dark:text-gray-500 text-sm">Cliente Verificado</p>
                      </div>
                   </div>
                </div>
             </ScrollReveal>
           ))}
        </div>
      </div>
    </section>
  );
}
