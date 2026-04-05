// Default content for Shine Sushi — used as fallback when sections[].content is empty.

export const SHINE_COLORS = {
  bg: '#0C0804',              // warm obsidian
  surface: '#120E08',         // warm dark surface
  card: '#1C1408',            // warm elevated card
  orange: '#E8751A',          // Shine brand orange (primary)
  orangeGlow: 'rgba(232,117,26,0.18)',
  orangeDim: 'rgba(232,117,26,0.08)',
  gold: '#C8973A',            // premium gold accent
  goldDim: 'rgba(200,151,58,0.12)',
  cream: '#FFF8F0',           // warm white text
  muted: 'rgba(255,248,240,0.55)',
  dim: 'rgba(255,248,240,0.25)',
  border: 'rgba(232,117,26,0.15)',
  borderGold: 'rgba(200,151,58,0.2)',
} as const;

export interface ShineDish {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  popular?: boolean;
}

export interface ShineExperience {
  title: string;
  description: string;
  imageUrl: string;
}

export interface ShineLocation {
  name: string;
  address: string;
  phone: string;
  features: string[];
  schedule: string;
  mapsUrl: string;
}

export interface ShineTestimonial {
  name: string;
  text: string;
  rating: number;
  avatar?: string;
  platform?: 'google' | 'tripadvisor';
}

export const DEFAULT_DISHES: ShineDish[] = [
  {
    name: 'Acevichado Roll',
    description: 'Roll frito bañado en leche de tigre, ceviche de corvina y ají amarillo',
    price: '$8.900',
    imageUrl: 'https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?q=80&w=800',
    popular: true,
  },
  {
    name: 'Shine Roll',
    description: 'Camarón tempura, palta, queso crema, cubierto con salmón y salsa de la casa',
    price: '$7.500',
    imageUrl: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?q=80&w=800',
    popular: true,
  },
  {
    name: 'Ceviche Nikkei',
    description: 'Pescado fresco marinado con leche de tigre, ají amarillo y chips de camote',
    price: '$8.900',
    imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800',
  },
  {
    name: 'Dragon Roll',
    description: 'Pepino, cangrejo real, cubierto con palta laminada y salsa teriyaki',
    price: '$8.200',
    imageUrl: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=800',
  },
  {
    name: 'Tiradito Clásico',
    description: 'Láminas de pescado sobre crema de ají amarillo, cilantro y limón de pica',
    price: '$7.200',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800',
  },
];

export const DEFAULT_EXPERIENCES: ShineExperience[] = [
  {
    title: 'Vista al Mar',
    description: 'Disfruta tu roll favorito frente a Playa Brava, la playa más icónica de Iquique',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800',
  },
  {
    title: 'Música en Vivo',
    description: 'Noches con artistas en vivo que transforman cada cena en una experiencia única',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800',
  },
  {
    title: 'Terraza Exterior',
    description: 'Nuestra terraza outdoor con el clima perfecto de Iquique todo el año',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800',
  },
];

export const DEFAULT_LOCATIONS: ShineLocation[] = [
  {
    name: 'Playa Brava',
    address: 'Av. Arturo Prat 3286, Iquique',
    phone: '+56 57 244 3313',
    features: ['Vista Playa Brava', 'Terraza Outdoor', 'Música en Vivo', 'Estacionamiento'],
    schedule: 'Lun–Dom: 12:30 – 00:00',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Av.+Arturo+Prat+3286+Iquique',
  },
  {
    name: 'Mall Zofri',
    address: 'Mall Zofri, Local 302, Iquique',
    phone: '+56 57 244 3313',
    features: ['Local en Mall', 'Estacionamiento Gratis', 'CMR Falabella'],
    schedule: 'Dom–Jue: 12:30 – 23:00 / Vie–Sáb: 12:30 – 00:00',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mall+Zofri+Iquique',
  },
  {
    name: 'Alto Hospicio',
    address: 'Av. Los Cóndores 3110, Alto Hospicio',
    phone: '+56 57 279 0722',
    features: ['Barrio Residencial', 'Menú del Día', 'Para Llevar'],
    schedule: 'Lun–Sáb: 11:00 – 19:00',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Av.+Los+Condores+3110+Alto+Hospicio',
  },
  {
    name: 'Mall Plaza',
    address: 'Mall Plaza Iquique, Iquique',
    phone: '+56 57 244 3313',
    features: ['Local en Mall', 'Estacionamiento', 'Patio de Comidas'],
    schedule: 'Lun–Dom: 11:00 – 22:00',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mall+Plaza+Iquique',
  },
];

export const DEFAULT_TESTIMONIALS: ShineTestimonial[] = [
  {
    name: 'Catalina M.',
    text: 'El mejor sushi de Iquique sin dudas. La vista a Playa Brava mientras comes es una experiencia única que no encuentras en ningún otro lugar.',
    rating: 5,
    platform: 'google',
  },
  {
    name: 'Roberto F.',
    text: 'Probé el Acevichado Roll y quedé sin palabras. La fusión japonesa-peruana está perfectamente ejecutada. Volvería mil veces.',
    rating: 5,
    platform: 'google',
  },
  {
    name: 'Andrea P.',
    text: 'Fuimos en la noche de música en vivo. El ambiente es increíble, la comida de primera calidad y el servicio muy atento. 10/10',
    rating: 5,
    platform: 'google',
  },
  {
    name: 'Diego V.',
    text: 'El Shine Roll es el mejor que he comido. Calidad de ingredientes notoria, presentación impecable y precios muy accesibles.',
    rating: 4,
    platform: 'google',
  },
];
