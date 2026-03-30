// Default content for Shine Sushi — used as fallback when sections[].content is empty.
// All text is in Spanish (UI language) following project conventions.

export const SHINE_COLORS = {
  primary: '#0D0D0D',
  surface: '#1A1A1A',
  gold: '#D4A437',
  orange: '#E8652B',
  cream: '#F5F0E8',
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
}

export const DEFAULT_DISHES: ShineDish[] = [
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
    name: 'Tiradito Clásico',
    description: 'Láminas de pescado sobre crema de ají amarillo, cilantro y limón',
    price: '$7.200',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800',
  },
  {
    name: 'Dragon Roll',
    description: 'Pepino, cangrejo real, cubierto con palta laminada y salsa teriyaki',
    price: '$8.200',
    imageUrl: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=800',
    popular: true,
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
    title: 'Terraza al Aire Libre',
    description: 'Nuestra terraza outdoor con el clima perfecto de Iquique todo el año',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800',
  },
];

export const DEFAULT_LOCATIONS: ShineLocation[] = [
  {
    name: 'Playa Brava',
    address: 'Av. Arturo Prat 3286, Iquique',
    phone: '+56 57 244 3313',
    features: ['Vista Playa Brava', 'Outdoor Seating', 'Música en Vivo', 'Estacionamiento'],
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
];

export const DEFAULT_TESTIMONIALS: ShineTestimonial[] = [
  {
    name: 'Catalina M.',
    text: 'El mejor sushi de Iquique sin dudas. La vista a Playa Brava mientras comes es una experiencia única que no encuentras en otro lugar.',
    rating: 5,
  },
  {
    name: 'Roberto F.',
    text: 'Probé el Ceviche Nikkei y quedé sin palabras. La fusión japonesa-peruana está perfectamente ejecutada. Volvería mil veces.',
    rating: 5,
  },
  {
    name: 'Andrea P.',
    text: 'Fuimos en la noche de música en vivo. El ambiente es increíble, la comida de primera calidad y el servicio muy atento. 10/10',
    rating: 5,
  },
  {
    name: 'Diego V.',
    text: 'El Shine Roll es el mejor que he comido. Calidad de ingredientes notoria, presentación impecable y precios muy accesibles.',
    rating: 4,
  },
];
