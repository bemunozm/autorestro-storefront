import { Restaurant, SectionConfig, ThemeConfig } from '@/types/restaurant';

export type { SectionConfig };

export interface TemplateProps {
  restaurant: Restaurant;
  sections?: SectionConfig[];
  theme?: ThemeConfig;
}

export interface SectionProps {
  content: Record<string, unknown>;
  restaurant: Restaurant;
  theme?: ThemeConfig;
}
