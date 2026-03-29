'use client';

import { SectionConfig, TemplateProps } from '../types';
import * as Sections from '../sections';

export default function HeroCenteredTemplate({ restaurant, sections = [] }: TemplateProps) {
  // If no sections config, use default order for this template
  const sectionsToRender: SectionConfig[] = sections.length > 0 
    ? [...sections].sort((a, b) => a.order - b.order).filter(s => s.visible)
    : [
        { type: 'hero', order: 0, visible: true, content: {} },
        { type: 'features', order: 1, visible: true, content: {} },
        { type: 'gallery', order: 2, visible: true, content: {} },
        { type: 'testimonials', order: 3, visible: true, content: {} },
        { type: 'contact', order: 4, visible: true, content: {} },
        { type: 'cta', order: 5, visible: true, content: {} },
      ];

  const renderSection = (section: SectionConfig) => {
    switch (section.type) {
      case 'hero': return <Sections.HeroSection key={section.order} content={section.content} restaurant={restaurant} />;
      case 'features': return <Sections.FeaturesSection key={section.order} content={section.content} restaurant={restaurant} />;
      case 'gallery': return <Sections.GallerySection key={section.order} content={section.content} restaurant={restaurant} />;
      case 'testimonials': return <Sections.TestimonialsSection key={section.order} content={section.content} restaurant={restaurant} />;
      case 'contact': return <Sections.ContactSection key={section.order} content={section.content} restaurant={restaurant} />;
      case 'cta': return <Sections.CTASection key={section.order} content={section.content} restaurant={restaurant} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black selection:bg-[var(--theme-primary)] selection:text-white">
      <main>
        {sectionsToRender.map(renderSection)}
      </main>
      
      <footer className="py-20 px-6 bg-gray-50 dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-900 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold font-[var(--theme-heading-font)] text-gray-900 dark:text-white mb-4">
            {restaurant.name}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
            {restaurant.description}
          </p>
          <div className="h-px w-full bg-linear-to-r from-transparent via-gray-200 dark:via-zinc-800 to-transparent mb-8" />
          <p className="text-gray-400 text-sm font-medium">
            © {new Date().getFullYear()} {restaurant.name}. Todos los derechos reservados.
          </p>
          <p className="mt-2 text-gray-300 dark:text-zinc-700 text-xs tracking-widest uppercase">
            Powered by AutoRestro Chile
          </p>
        </div>
      </footer>
    </div>
  );
}
