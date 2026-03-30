'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { SectionProps } from '../../types';
import { ScrollReveal } from '../../sections/ScrollReveal';

interface GalleryImage {
  src: string;
  alt: string;
  featured?: boolean;
}

const DEFAULT_IMAGES: GalleryImage[] = [
  { src: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?q=80&w=1200', alt: 'Rolls gourmet Shine Sushi', featured: true },
  { src: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=800', alt: 'Sushi plato especial' },
  { src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800', alt: 'Ambiente del local' },
  { src: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800', alt: 'Ceviche nikkei', featured: false },
  { src: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800', alt: 'Bebidas artesanales' },
  { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800', alt: 'Vista interior restaurante' },
];

export function PremiumGallery({ content }: SectionProps) {
  const rawImages = content.images as string[] | GalleryImage[] | undefined;
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const images: GalleryImage[] = rawImages && rawImages.length > 0
    ? (rawImages as string[]).map((src, i) => ({
        src,
        alt: `Galería ${i + 1}`,
        featured: i === 0,
      }))
    : DEFAULT_IMAGES;

  return (
    <section className="py-24 px-6 bg-gray-950 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up" className="text-center mb-16">
          <p className="text-sm font-bold tracking-widest uppercase mb-3 opacity-70"
            style={{ color: 'var(--theme-accent, #EA580C)' }}>
            Nuestra galería
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4"
            style={{ fontFamily: 'var(--theme-heading-font)' }}>
            Momentos Shine
          </h2>
          <div className="h-1.5 w-16 mx-auto rounded-full" style={{ background: 'var(--theme-accent, #EA580C)' }} />
        </ScrollReveal>

        {/* Masonry grid via CSS grid with row-span */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px] md:auto-rows-[220px]">
          {images.slice(0, 6).map((img: GalleryImage, idx: number) => {
            const isFeatured = img.featured || idx === 0;
            return (
              <ScrollReveal
                key={idx}
                delay={idx * 80}
                direction="none"
                className={`relative overflow-hidden group cursor-pointer rounded-2xl shadow-md ${
                  isFeatured ? 'md:row-span-2' : ''
                } ${idx === 3 ? 'md:col-span-2' : ''}`}
              >
                <div
                  className="relative w-full h-full"
                  onClick={() => setLightboxSrc(img.src)}
                  role="button"
                  aria-label={`Ver imagen: ${img.alt}`}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setLightboxSrc(img.src)}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    loading="lazy"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center">
                    <span className="px-4 py-2 rounded-full text-white text-sm font-bold border border-white/50 backdrop-blur-md">
                      Ver foto
                    </span>
                  </div>
                  {/* Bottom gradient for alt text */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-3">
                    <p className="text-white text-xs font-medium truncate">{img.alt}</p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      {/* CSS-only Lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setLightboxSrc(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Vista ampliada de imagen"
        >
          <button
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            onClick={() => setLightboxSrc(null)}
            aria-label="Cerrar imagen"
          >
            <X className="w-5 h-5" />
          </button>
          <div
            className="relative max-w-4xl max-h-[85vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxSrc}
              alt="Imagen ampliada"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
