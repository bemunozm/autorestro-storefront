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

export interface MenuDish {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
}

export interface MenuHighlightsContent {
  dishes: MenuDish[];
  title?: string;
  ctaText?: string;
}

export interface SocialProofContent {
  rating: number;
  reviewCount: number;
  platform: string;
  badges: string[];
}

export interface Location {
  name: string;
  address: string;
  phone: string;
  features: string[];
  schedule: string;
  mapsUrl: string;
}

export interface LocationsContent {
  locations: Location[];
  title?: string;
}

export interface ValuePropositionItem {
  icon: string;
  title: string;
  description: string;
}

export interface ValuePropositionContent {
  items: ValuePropositionItem[];
  title?: string;
}
