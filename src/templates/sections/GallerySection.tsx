'use client';

import Image from 'next/image';
import { SectionProps } from '../types';
import { ScrollReveal } from './ScrollReveal';

export function GallerySection({ content }: SectionProps) {
  const images = (content.images as string[]) || [];

  // Fallback images if none provided
  const galleryImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1000',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1000',
    'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000'
  ];

  return (
    <section className="py-24 px-4 bg-gray-50 dark:bg-zinc-950 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up" className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-[var(--theme-heading-font)] mb-4 text-gray-900 dark:text-white">Nuestra Galería</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto font-[var(--theme-font)]">
            Echa un vistazo a nuestros platos preparados con los mejores ingredientes y el ambiente de nuestro local.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[250px]">
          {galleryImages.slice(0, 6).map((src: string, idx: number) => (
            <ScrollReveal
              key={idx}
              delay={idx * 100}
              direction="none"
              className={`relative overflow-hidden group rounded-2xl md:rounded-3xl shadow-md 
                ${idx === 0 ? 'md:col-span-2 md:row-span-2' : ''} 
                ${idx === 3 ? 'md:col-span-2' : ''}`}
            >
              <Image
                src={src}
                alt={`Galería ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-1000 ease-in-out group-hover:scale-115"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
                 <div className="bg-white/20 border border-white/50 backdrop-blur-md px-6 py-2 text-white font-medium rounded-full translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                   Ver más
                 </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
