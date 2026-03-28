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
}
