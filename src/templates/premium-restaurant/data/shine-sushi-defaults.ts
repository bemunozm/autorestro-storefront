import { SectionConfig } from '@/types/restaurant';

export const shineSushiDefaults: SectionConfig[] = [
  {
    type: 'hero',
    order: 0,
    visible: true,
    content: {
      title: 'Shine Sushi',
      subtitle: 'Fusión Nikkei Premium — Sushi japonés con alma peruana, en el corazón de Iquique',
      ctaPrimaryText: 'Ver Menú',
      ctaSecondaryText: 'Reservar Mesa',
      ctaSecondaryHref: 'tel:+56572443313',
      socialProofText: '4.0★ TripAdvisor · 200+ reseñas',
    },
  },
  {
    type: 'value-proposition',
    order: 1,
    visible: true,
    content: {
      title: 'Por qué elegirnos',
      items: [
        {
          icon: 'flame',
          title: 'Fusión Nikkei Premium',
          description: 'Sabores japoneses y peruanos en armonía. Rolls gourmet, ceviches, tiraditos y mucho más.',
        },
        {
          icon: 'mapPin',
          title: '3 Sucursales en Iquique',
          description: 'Playa Brava con vista al mar, Mall Zofri y Alto Hospicio. Siempre cerca de ti.',
        },
        {
          icon: 'truck',
          title: 'Restobar & Delivery',
          description: 'Vive la experiencia completa en el local o pide a domicilio vía Rappi y Uber Eats.',
        },
      ],
    },
  },
  {
    type: 'menu-highlights',
    order: 2,
    visible: true,
    content: {
      title: 'Platos Destacados',
      ctaText: 'Ver Menú Completo',
      dishes: [
        {
          name: 'Shine Roll',
          description: 'Camarón tempura, palta, queso crema, cubierto con salmón y salsa de la casa',
          price: '$7.500',
          imageUrl: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?q=80&w=800',
        },
        {
          name: 'Ceviche Nikkei',
          description: 'Pescado fresco marinado con leche de tigre, ají amarillo y chips de camote',
          price: '$8.900',
          imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800',
        },
        {
          name: 'Tiradito Clásico',
          description: 'Láminas de pescado sobre crema de ají amarillo, cilantro y limón de pica',
          price: '$7.200',
          imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800',
        },
        {
          name: 'Dragon Roll',
          description: 'Pepino, cangrejo real, cubierto con palta laminada y salsa teriyaki',
          price: '$8.200',
          imageUrl: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=800',
        },
        {
          name: 'Promo 40 Rolls',
          description: 'Selección de 40 piezas mixtas para compartir — la mejor relación precio-calidad',
          price: '$10.000',
          imageUrl: 'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?q=80&w=800',
        },
      ],
    },
  },
  {
    type: 'social-proof',
    order: 3,
    visible: true,
    content: {
      rating: 4.0,
      reviewCount: 200,
      platform: 'TripAdvisor',
      badges: ['Delivery Certificado', 'Pago Seguro', 'Fusión Nikkei'],
    },
  },
  {
    type: 'features',
    order: 4,
    visible: true,
    content: {},
  },
  {
    type: 'gallery',
    order: 5,
    visible: true,
    content: {
      images: [
        'https://images.unsplash.com/photo-1617196034183-421b4040ed20?q=80&w=1200',
        'https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=800',
        'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800',
        'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800',
        'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800',
      ],
    },
  },
  {
    type: 'cta',
    order: 6,
    visible: true,
    content: {
      headline: '¿Listo para vivir la fusión?',
      subtext: 'Sushi, ceviches y tiraditos con el alma nikkei que Iquique nunca había probado.',
      ctaText: 'Ver Menú Completo',
      socialProof: 'Más de 500 pedidos este mes',
    },
  },
  {
    type: 'locations',
    order: 7,
    visible: true,
    content: {
      title: 'Nuestras Sucursales',
      locations: [
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
          schedule: 'Dom–Jue: 12:30–23:00 / Vie–Sáb: 12:30–00:00',
          mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mall+Zofri+Iquique',
        },
        {
          name: 'Alto Hospicio',
          address: 'Av. Los Cóndores 3110, Alto Hospicio',
          phone: '+56 57 244 3313',
          features: ['Barrio Residencial', 'Menú del día', 'Para llevar'],
          schedule: 'Lun–Sáb: 11:00 – 19:00',
          mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Av.+Los+Condores+3110+Alto+Hospicio',
        },
      ],
    },
  },
  {
    type: 'contact',
    order: 8,
    visible: true,
    content: {
      phone: '+56 57 244 3313',
      email: 'contacto@shinesushi.cl',
      website: 'shinesushi.cl',
      whatsapp: '+56572443313',
      instagram: '@shinesushiiqq',
      facebook: 'shinesushiiqq',
      schedule: 'Lun–Dom: 12:30 – 00:00 (varía por sucursal)',
    },
  },
];
