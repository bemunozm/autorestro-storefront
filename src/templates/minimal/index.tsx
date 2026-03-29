'use client';

import { TemplateProps } from '../types';
import { FeaturesSection, CTASection, ContactSection, ScrollReveal } from '../sections';

export default function MinimalTemplate({ restaurant }: TemplateProps) {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black selection:bg-[var(--theme-primary)] selection:text-white font-[var(--theme-font)]">
      {/* Compact Hero UI - Custom for Minimal */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center p-10 md:p-32 overflow-hidden bg-white dark:bg-black">
        <div className="max-w-5xl w-full text-center relative z-10">
           <ScrollReveal direction="up" className="space-y-10">
              <div className="h-0.5 w-16 bg-[var(--theme-primary)] mx-auto mb-10" />
              <h1 className="text-5xl md:text-9xl font-light font-[var(--theme-heading-font)] text-gray-900 dark:text-white tracking-tighter leading-none mb-8">
                {restaurant.name}
              </h1>
              <p className="text-xl md:text-3xl text-gray-400 dark:text-gray-500 max-w-2xl mx-auto font-light leading-relaxed mb-12">
                {restaurant.description || 'Simplicidad en cada detalle.'}
              </p>
              <div className="flex justify-center items-center gap-8">
                <a
                  href={`/${restaurant.slug}/menu`}
                  className="px-12 py-5 bg-gray-900 dark:bg-white text-white dark:text-black font-bold text-xl rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                  Ver Menú
                </a>
                <a
                  href="#info"
                  className="px-10 py-5 bg-transparent border border-gray-200 dark:border-zinc-800 text-gray-500 font-medium text-lg rounded-full hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all"
                >
                  Información
                </a>
              </div>
           </ScrollReveal>
        </div>
        
        {/* Subtle background lines */}
        <div className="absolute inset-0 flex justify-between pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
           <div className="w-px h-full bg-black dark:bg-white" />
           <div className="w-px h-full bg-black dark:bg-white" />
           <div className="w-px h-full bg-black dark:bg-white hidden md:block" />
           <div className="w-px h-full bg-black dark:bg-white hidden md:block" />
        </div>
      </section>

      <main className="divide-y divide-gray-50 dark:divide-zinc-900">
         <div className="max-w-7xl mx-auto px-4 md:px-10">
            <FeaturesSection content={{}} restaurant={restaurant} />
         </div>
         <CTASection content={{}} restaurant={restaurant} />
         <div id="info" className="max-w-7xl mx-auto px-4 md:px-10">
            <ContactSection content={{}} restaurant={restaurant} />
         </div>
      </main>

      <footer className="py-32 px-10 text-center space-y-8">
         <div className="h-0.5 w-12 bg-gray-200 dark:bg-zinc-800 mx-auto" />
         <h3 className="text-2xl font-light font-[var(--theme-heading-font)] text-gray-900 dark:text-white tracking-tight uppercase">
            {restaurant.name}
         </h3>
         <div className="flex flex-col items-center gap-4">
            <p className="text-gray-400 font-medium">Chile • {new Date().getFullYear()}</p>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-300 dark:text-zinc-800 font-black">
               AutoRestro Digital Presence
            </p>
         </div>
      </footer>
    </div>
  );
}
