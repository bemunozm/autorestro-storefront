'use client';

import { SectionConfig, TemplateProps } from '../types';
import { ShineSushiHero } from './sections/ShineSushiHero';
import { ShineSushiAbout } from './sections/ShineSushiAbout';
import { ShineSushiMenu } from './sections/ShineSushiMenu';
import { ShineSushiExperience } from './sections/ShineSushiExperience';
import { ShineSushiLocations } from './sections/ShineSushiLocations';
import { ShineSushiTestimonials } from './sections/ShineSushiTestimonials';
import { ShineSushiCTA } from './sections/ShineSushiCTA';
import { ShineSushiFooter } from './sections/ShineSushiFooter';
import { SHINE_COLORS } from './data/defaults';

// Conversion-optimized section order for Shine Sushi:
// Hero → About → Menu → Experience → Testimonials → CTA → Locations → Footer
const DEFAULT_SECTIONS: SectionConfig[] = [
  { type: 'hero', order: 0, visible: true, content: {} },
  { type: 'about', order: 1, visible: true, content: {} },
  { type: 'menu', order: 2, visible: true, content: {} },
  { type: 'experience', order: 3, visible: true, content: {} },
  { type: 'testimonials', order: 4, visible: true, content: {} },
  { type: 'cta', order: 5, visible: true, content: {} },
  { type: 'locations', order: 6, visible: true, content: {} },
  { type: 'footer', order: 7, visible: true, content: {} },
];

// Default export required for lazy(() => import('./custom-shinesushi')) in registry.ts
export default function ShineSushiTemplate({ restaurant, sections = [] }: TemplateProps) {
  const sectionsToRender: SectionConfig[] =
    sections.length > 0
      ? [...sections].sort((a, b) => a.order - b.order).filter((s) => s.visible)
      : DEFAULT_SECTIONS;

  const renderSection = (section: SectionConfig) => {
    const props = { content: section.content, restaurant };

    switch (section.type) {
      case 'hero':
        return <ShineSushiHero key={section.order} {...props} />;
      case 'about':
        return <ShineSushiAbout key={section.order} {...props} />;
      case 'menu':
        return <ShineSushiMenu key={section.order} {...props} />;
      case 'experience':
        return <ShineSushiExperience key={section.order} {...props} />;
      case 'locations':
        return <ShineSushiLocations key={section.order} {...props} />;
      case 'testimonials':
        return <ShineSushiTestimonials key={section.order} {...props} />;
      case 'cta':
        return <ShineSushiCTA key={section.order} {...props} />;
      case 'footer':
        return <ShineSushiFooter key={section.order} {...props} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        backgroundColor: SHINE_COLORS.primary,
        '--selection-bg': SHINE_COLORS.gold,
        '--selection-color': SHINE_COLORS.primary,
      } as React.CSSProperties}
    >
      <main>
        {sectionsToRender.map(renderSection)}
      </main>
    </div>
  );
}
