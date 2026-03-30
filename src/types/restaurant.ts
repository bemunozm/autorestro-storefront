export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  coverImageUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  description?: string;
  address?: string;
  phone?: string;
  openingHours?: Record<string, unknown>;
  features?: { delivery?: boolean; pickup?: boolean; dineIn?: boolean };
  isPro?: boolean;
  landingConfig?: LandingConfig;
}

export interface LandingConfig {
  template: string;
  sections?: SectionConfig[];
  theme?: ThemeConfig;
  seo?: { title?: string; description?: string; ogImage?: string };
}

export interface SectionConfig {
  type: string;
  order: number;
  visible: boolean;
  content: Record<string, unknown>;
}

export interface ThemeConfig {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  headingFont?: string;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  customCSS?: string;
}
