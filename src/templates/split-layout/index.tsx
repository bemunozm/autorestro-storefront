'use client';

import Image from 'next/image';
import { TemplateProps } from '../types';
import * as Sections from '../sections';
import { ScrollReveal } from '../sections/ScrollReveal';
import { useRestaurant } from '@/providers/restaurant-provider';

export default function SplitLayoutTemplate({ restaurant }: TemplateProps) {
  const { basePath } = useRestaurant();
  const image = restaurant.coverImageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000';

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black selection:bg-[var(--theme-primary)] selection:text-white">
      {/* Split Hero Section */}
      <section className="relative flex flex-col md:flex-row min-h-screen">
        <div className="w-full md:w-1/2 min-h-[50vh] md:h-screen relative">
          <Image
            src={image}
            alt={restaurant.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white dark:to-black hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black to-transparent md:hidden" />
        </div>
        
        <div className="w-full md:w-1/2 flex items-center justify-center p-10 md:p-24 bg-white dark:bg-black text-center md:text-left relative z-10">
          <div className="max-w-2xl">
             <ScrollReveal direction="right" className="space-y-8">
                {restaurant.logoUrl && (
                  <div className="relative h-24 w-24 mb-10 mx-auto md:mx-0 shadow-2xl rounded-3xl overflow-hidden bg-white/50 backdrop-blur-md p-4 border border-white/20">
                    <Image src={restaurant.logoUrl} alt={restaurant.name} fill className="object-contain p-2" />
                  </div>
                )}
                <h1 className="text-6xl md:text-9xl font-black font-[var(--theme-heading-font)] mb-6 tracking-tighter leading-[0.8] text-gray-900 dark:text-white uppercase italic">
                   {restaurant.name}
                </h1>
                <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 mb-12 font-[var(--theme-font)] leading-relaxed max-w-lg mx-auto md:mx-0">
                   {restaurant.description || 'Descubre los sabores que nos hacen únicos en la ciudad.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start">
                  <a
                    href={`${basePath}/menu`}
                    className="px-12 py-6 bg-[var(--theme-primary)] text-white font-black text-2xl rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-2xl hover:shadow-[var(--theme-primary)]/40 text-center"
                  >
                    Ver Menú
                  </a>
                  <a
                    href={`#ubicacion`}
                    className="px-10 py-5 bg-transparent border-2 border-gray-100 dark:border-zinc-800 text-gray-900 dark:text-white font-bold text-xl rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all text-center"
                  >
                    Ubicación
                  </a>
                </div>
             </ScrollReveal>
          </div>
        </div>
      </section>

      <main>
        {/* Use shared sections but with a different layout style if needed */}
        <Sections.FeaturesSection content={{}} restaurant={restaurant} />
        <Sections.GallerySection content={{}} restaurant={restaurant} />
        <Sections.TestimonialsSection content={{}} restaurant={restaurant} />
        <div id="ubicacion">
          <Sections.ContactSection content={{}} restaurant={restaurant} />
        </div>
        <Sections.CTASection content={{}} restaurant={restaurant} />
      </main>

      <footer className="py-24 px-10 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
           <div className="max-w-md">
              <h2 className="text-4xl font-black font-[var(--theme-heading-font)] text-gray-900 dark:text-white mb-6 uppercase tracking-tighter italic">
                {restaurant.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-10 leading-relaxed font-medium text-lg">
                {restaurant.description}
              </p>
              <div className="flex gap-4">
                 {/* Social placeholders */}
                 {[1,2,3].map(i => (
                   <div key={i} className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-gray-400 hover:text-[var(--theme-primary)] transition-colors cursor-pointer shadow-sm">
                      <div className="w-5 h-5 rounded-md bg-current opacity-20" />
                   </div>
                 ))}
              </div>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-3 gap-16 w-full md:w-auto">
              <div>
                <h4 className="font-black text-gray-900 dark:text-white mb-8 uppercase text-xs tracking-[0.2em] opacity-50">Explora</h4>
                <ul className="space-y-5 text-gray-500 dark:text-gray-400 font-bold">
                   <li><a href={`${basePath}/menu`} className="hover:text-[var(--theme-primary)] transition-colors">Nuestra Carta</a></li>
                   <li><a href="#ubicacion" className="hover:text-[var(--theme-primary)] transition-colors">Dónde Estamos</a></li>
                   <li><a href="#" className="hover:text-[var(--theme-primary)] transition-colors">Gift Cards</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-black text-gray-900 dark:text-white mb-8 uppercase text-xs tracking-[0.2em] opacity-50">Soporte</h4>
                <ul className="space-y-5 text-gray-500 dark:text-gray-400 font-bold">
                   <li><a href="#" className="hover:text-[var(--theme-primary)] transition-colors">Contacto</a></li>
                   <li><a href="#" className="hover:text-[var(--theme-primary)] transition-colors">Reservas</a></li>
                   <li><a href="#" className="hover:text-[var(--theme-primary)] transition-colors">PQR</a></li>
                </ul>
              </div>
              <div className="col-span-2 md:col-span-1">
                <h4 className="font-black text-gray-900 dark:text-white mb-8 uppercase text-xs tracking-[0.2em] opacity-50">AutoRestro</h4>
                <div className="p-6 rounded-2xl bg-linear-to-br from-[var(--theme-primary)] to-[var(--theme-secondary,#333)] text-white">
                   <p className="font-bold mb-4 text-sm">Gestiona tu restaurante con nosotros.</p>
                   <button className="w-full py-3 bg-white text-[var(--theme-primary)] rounded-xl font-black text-xs uppercase tracking-widest shadow-xl">Únete</button>
                </div>
              </div>
           </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-8">
           <p className="text-gray-400 text-sm font-medium italic">© {new Date().getFullYear()} {restaurant.name} • Autorestro Storefront</p>
           <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-gray-300 dark:text-zinc-700 text-xs tracking-widest font-black uppercase">Service Status: Operational</p>
           </div>
        </div>
      </footer>
    </div>
  );
}
