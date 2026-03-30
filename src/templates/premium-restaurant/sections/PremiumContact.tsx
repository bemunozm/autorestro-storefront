'use client';

import { Phone, Mail, Globe, MessageCircle, Clock, Share2 } from 'lucide-react';
import { SectionProps } from '../../types';
import { ScrollReveal } from '../../sections/ScrollReveal';

interface ContactContent {
  phone?: string;
  email?: string;
  website?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  schedule?: string;
}

export function PremiumContact({ content, restaurant }: SectionProps) {
  const typedContent = content as unknown as ContactContent;
  const phone = typedContent.phone || restaurant.phone || '+56 57 244 3313';
  const email = typedContent.email || `contacto@${restaurant.slug}.cl`;
  const website = typedContent.website || `${restaurant.slug}.cl`;
  const whatsapp = typedContent.whatsapp || phone;
  const instagram = typedContent.instagram || '';
  const facebook = typedContent.facebook || '';
  const schedule = typedContent.schedule || 'Lun–Dom: 12:30 – 00:00 (varía por sucursal)';

  const whatsappHref = `https://wa.me/${whatsapp.replace(/\D/g, '')}`;
  const cleanPhone = phone.replace(/\s/g, '');

  return (
    <section className="py-24 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal direction="up" className="text-center mb-16">
          <p className="text-sm font-bold tracking-widest uppercase mb-3 opacity-60"
            style={{ color: 'var(--theme-accent, #EA580C)' }}>
            Estamos para ti
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4"
            style={{ fontFamily: 'var(--theme-heading-font)' }}>
            Contáctanos
          </h2>
          <div className="h-1.5 w-16 mx-auto rounded-full" style={{ background: 'var(--theme-accent, #EA580C)' }} />
        </ScrollReveal>

        {/* WhatsApp CTA — prominent */}
        <ScrollReveal direction="up" delay={100} className="mb-10">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-xl text-white shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-95"
            style={{ background: '#25D366', boxShadow: '0 8px 32px rgba(37, 211, 102, 0.35)' }}
          >
            <MessageCircle className="w-7 h-7" />
            Escribir por WhatsApp
          </a>
        </ScrollReveal>

        {/* Contact grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <ScrollReveal direction="left" delay={150}>
            <a
              href={`tel:${cleanPhone}`}
              className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform"
                style={{ background: 'var(--theme-accent, #EA580C)' }}>
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-0.5">Teléfono</p>
                <p className="text-gray-900 font-bold">{phone}</p>
              </div>
            </a>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={150}>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform"
                style={{ background: 'var(--theme-accent, #EA580C)' }}>
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-0.5">Email</p>
                <p className="text-gray-900 font-bold truncate">{email}</p>
              </div>
            </a>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={200}>
            <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0"
                style={{ background: 'var(--theme-accent, #EA580C)' }}>
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-0.5">Horarios</p>
                <p className="text-gray-900 font-bold text-sm">{schedule}</p>
              </div>
            </div>
          </ScrollReveal>

          {website && (
            <ScrollReveal direction="right" delay={200}>
              <a
                href={`https://${website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform"
                  style={{ background: 'var(--theme-accent, #EA580C)' }}>
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-0.5">Sitio Web</p>
                  <p className="text-gray-900 font-bold">{website}</p>
                </div>
              </a>
            </ScrollReveal>
          )}
        </div>

        {/* Social media */}
        {(instagram || facebook) && (
          <ScrollReveal direction="up" delay={300} className="flex gap-4 justify-center">
            {instagram && (
              <a
                href={`https://instagram.com/${instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white text-sm transition-all duration-300 hover:scale-105 active:scale-95 shadow-md"
                style={{ background: 'linear-gradient(135deg, #E1306C, #F56040, #FFDC80)' }}
              >
                <Share2 className="w-4 h-4" />
                Instagram
              </a>
            )}
            {facebook && (
              <a
                href={`https://facebook.com/${facebook.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#1877F2] font-bold text-white text-sm transition-all duration-300 hover:scale-105 active:scale-95 shadow-md"
              >
                <Share2 className="w-4 h-4" />
                Facebook
              </a>
            )}
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
