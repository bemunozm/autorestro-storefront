'use client';

import { SectionConfig, TemplateProps } from '../types';
import { ShineSushiHeader } from './sections/ShineSushiHeader';
import { ShineSushiHero } from './sections/ShineSushiHero';
import { ShineSushiInfoBar } from './sections/ShineSushiInfoBar';
import { ShineSushiAbout } from './sections/ShineSushiAbout';
import { ShineSushiMenu } from './sections/ShineSushiMenu';
import { ShineSushiExperience } from './sections/ShineSushiExperience';
import { ShineSushiTestimonials } from './sections/ShineSushiTestimonials';
import { ShineSushiCTA } from './sections/ShineSushiCTA';
import { ShineSushiLocations } from './sections/ShineSushiLocations';
import { ShineSushiFooter } from './sections/ShineSushiFooter';
import { ShineSushiFloatingCTA } from './sections/ShineSushiFloatingCTA';
import { SHINE_COLORS } from './data/defaults';

// Conversion-optimized section order:
// Hero → InfoBar → Menu → About → Experience → Testimonials → CTA → Locations → Footer
const DEFAULT_SECTIONS: SectionConfig[] = [
  { type: 'hero',         order: 0, visible: true, content: {} },
  { type: 'infobar',      order: 1, visible: true, content: {} },
  { type: 'menu',         order: 2, visible: true, content: {} },
  { type: 'about',        order: 3, visible: true, content: {} },
  { type: 'experience',   order: 4, visible: true, content: {} },
  { type: 'testimonials', order: 5, visible: true, content: {} },
  { type: 'cta',          order: 6, visible: true, content: {} },
  { type: 'locations',    order: 7, visible: true, content: {} },
  { type: 'footer',       order: 8, visible: true, content: {} },
];

// Default export required for lazy(() => import('./custom-shinesushi')) in registry.ts
export default function ShineSushiTemplate({ restaurant, sections = [] }: TemplateProps) {
  const sectionsToRender: SectionConfig[] =
    sections.length > 0
      ? [...sections].sort((a, b) => a.order - b.order).filter((s) => s.visible)
      : DEFAULT_SECTIONS;

  const renderSection = (section: SectionConfig) => {
    const key = section.order;
    const props = { content: section.content, restaurant };

    switch (section.type) {
      case 'hero':
        return <ShineSushiHero key={key} {...props} />;
      case 'infobar':
        return <ShineSushiInfoBar key={key} {...props} />;
      case 'about':
        return <ShineSushiAbout key={key} {...props} />;
      case 'menu':
        return <ShineSushiMenu key={key} {...props} />;
      case 'experience':
        return <ShineSushiExperience key={key} {...props} />;
      case 'locations':
        return <ShineSushiLocations key={key} {...props} />;
      case 'testimonials':
        return <ShineSushiTestimonials key={key} {...props} />;
      case 'cta':
        return <ShineSushiCTA key={key} {...props} />;
      case 'footer':
        return <ShineSushiFooter key={key} {...props} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        backgroundColor: SHINE_COLORS.bg,
        '--selection-bg': SHINE_COLORS.orange,
        '--selection-color': SHINE_COLORS.bg,
      } as React.CSSProperties}
    >
      <ShineSushiHeader />
      <main>
        {sectionsToRender.map(renderSection)}
      </main>
      <ShineSushiFloatingCTA />
    </div>
  );
}
