'use client';

import { SectionConfig, TemplateProps } from '../types';
import * as SharedSections from '../sections';
import { PremiumHero } from './sections/PremiumHero';
import { ValueProposition } from './sections/ValueProposition';
import { MenuHighlights } from './sections/MenuHighlights';
import { SocialProofBar } from './sections/SocialProofBar';
import { LocationsMap } from './sections/LocationsMap';
import { PremiumGallery } from './sections/PremiumGallery';
import { PremiumCTA } from './sections/PremiumCTA';
import { PremiumContact } from './sections/PremiumContact';

// Default section order optimized for conversion:
// Hero → Value Prop → Menu Highlights → Social Proof → Features → Gallery → CTA → Locations → Contact
const DEFAULT_SECTIONS: SectionConfig[] = [
  { type: 'hero', order: 0, visible: true, content: {} },
  { type: 'value-proposition', order: 1, visible: true, content: {} },
  { type: 'menu-highlights', order: 2, visible: true, content: {} },
  { type: 'social-proof', order: 3, visible: true, content: {} },
  { type: 'features', order: 4, visible: true, content: {} },
  { type: 'gallery', order: 5, visible: true, content: {} },
  { type: 'cta', order: 6, visible: true, content: {} },
  { type: 'locations', order: 7, visible: true, content: {} },
  { type: 'contact', order: 8, visible: true, content: {} },
];

// Default export required for compatibility with lazy(() => import('./premium-restaurant')) in registry.ts
export default function PremiumRestaurantTemplate({ restaurant, sections = [] }: TemplateProps) {
  const sectionsToRender: SectionConfig[] =
    sections.length > 0
      ? [...sections].sort((a, b) => a.order - b.order).filter((s) => s.visible)
      : DEFAULT_SECTIONS;

  const renderSection = (section: SectionConfig) => {
    const props = { key: section.order, content: section.content, restaurant };

    switch (section.type) {
      case 'hero':
        return <PremiumHero {...props} />;
      case 'value-proposition':
        return <ValueProposition {...props} />;
      case 'menu-highlights':
        return <MenuHighlights {...props} />;
      case 'social-proof':
        return <SocialProofBar {...props} />;
      case 'features':
        return <SharedSections.FeaturesSection {...props} />;
      case 'gallery':
        return <PremiumGallery {...props} />;
      case 'cta':
        return <PremiumCTA {...props} />;
      case 'locations':
        return <LocationsMap {...props} />;
      case 'contact':
        return <PremiumContact {...props} />;
      case 'testimonials':
        return <SharedSections.TestimonialsSection {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-[var(--theme-accent,#EA580C)] selection:text-white">
      <main>
        {sectionsToRender.map(renderSection)}
      </main>

      <footer className="py-16 px-6 bg-gray-950 border-t border-white/5 text-center">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-xl font-black text-white mb-3"
            style={{ fontFamily: 'var(--theme-heading-font)' }}
          >
            {restaurant.name}
          </h2>
          {restaurant.description && (
            <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm leading-relaxed">
              {restaurant.description}
            </p>
          )}
          <div className="h-px w-full max-w-xs mx-auto mb-6"
            style={{ background: 'linear-gradient(to right, transparent, color-mix(in srgb, var(--theme-accent, #EA580C) 40%, transparent), transparent)' }} />
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} {restaurant.name}. Todos los derechos reservados.
          </p>
          <p className="mt-2 text-gray-700 text-xs tracking-widest uppercase">
            Powered by AutoRestro Chile
          </p>
        </div>
      </footer>
    </div>
  );
}
