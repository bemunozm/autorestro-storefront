'use client';

import Image from 'next/image';
import { Phone, Mail, MapPin } from 'lucide-react';
import { SectionProps } from '../../types';
import { SHINE_COLORS } from '../data/defaults';

// Inline SVG icons — lucide-react in this project version doesn't include brand icons
function IconInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconFacebook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function ShineSushiFooter({ content, restaurant }: SectionProps) {
  const email = (content.email as string | undefined) || 'contacto@shinesushi.cl';
  const phone = (content.phone as string | undefined) || restaurant.phone || '+56 57 244 3313';
  const instagram = (content.instagram as string | undefined) || 'https://instagram.com/shinesushi_';
  const facebook = (content.facebook as string | undefined) || 'https://facebook.com/shinesushii';
  const whatsapp = content.whatsapp as string | undefined;

  return (
    <footer
      className="py-16 px-6"
      style={{ backgroundColor: SHINE_COLORS.primary, borderTop: `1px solid ${SHINE_COLORS.gold}15` }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand column */}
          <div>
            {restaurant.logoUrl ? (
              <div className="relative h-16 w-16 mb-5">
                <Image
                  src={restaurant.logoUrl}
                  alt={restaurant.name}
                  fill
                  className="object-contain"
                  loading="lazy"
                />
              </div>
            ) : null}
            <h3 className="font-black text-white text-xl mb-3 tracking-wider uppercase">
              {restaurant.name}
            </h3>
            <p
              className="text-sm leading-relaxed mb-5"
              style={{ color: `${SHINE_COLORS.cream}70` }}
            >
              Restobar & Delivery · Fusión Nikkei Premium
            </p>
            <div
              className="h-px w-12"
              style={{ background: `linear-gradient(to right, ${SHINE_COLORS.gold}, transparent)` }}
            />
          </div>

          {/* Contact column */}
          <div>
            <p
              className="text-xs font-bold tracking-[0.3em] uppercase mb-6"
              style={{ color: SHINE_COLORS.gold }}
            >
              Contacto
            </p>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-3 text-sm transition-colors hover:opacity-80"
                  style={{ color: `${SHINE_COLORS.cream}CC` }}
                >
                  <Phone className="w-4 h-4 shrink-0" style={{ color: SHINE_COLORS.gold }} />
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 text-sm transition-colors hover:opacity-80"
                  style={{ color: `${SHINE_COLORS.cream}CC` }}
                >
                  <Mail className="w-4 h-4 shrink-0" style={{ color: SHINE_COLORS.gold }} />
                  {email}
                </a>
              </li>
              {restaurant.address && (
                <li>
                  <span
                    className="flex items-start gap-3 text-sm"
                    style={{ color: `${SHINE_COLORS.cream}CC` }}
                  >
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: SHINE_COLORS.gold }} />
                    {restaurant.address}
                  </span>
                </li>
              )}
              {whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm transition-colors hover:opacity-80"
                    style={{ color: `${SHINE_COLORS.cream}CC` }}
                  >
                    <span
                      className="w-4 h-4 shrink-0 text-center font-bold text-xs"
                      style={{ color: SHINE_COLORS.gold }}
                    >
                      WA
                    </span>
                    WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Social + Delivery column */}
          <div>
            <p
              className="text-xs font-bold tracking-[0.3em] uppercase mb-6"
              style={{ color: SHINE_COLORS.gold }}
            >
              Síguenos
            </p>
            <div className="flex gap-4 mb-8">
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{
                  background: `${SHINE_COLORS.gold}15`,
                  color: SHINE_COLORS.gold,
                  border: `1px solid ${SHINE_COLORS.gold}30`,
                }}
                aria-label="Instagram Shine Sushi"
              >
                <IconInstagram className="w-4 h-4" />
              </a>
              <a
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{
                  background: `${SHINE_COLORS.gold}15`,
                  color: SHINE_COLORS.gold,
                  border: `1px solid ${SHINE_COLORS.gold}30`,
                }}
                aria-label="Facebook Shine Sushi"
              >
                <IconFacebook className="w-4 h-4" />
              </a>
            </div>
            <p
              className="text-xs font-bold tracking-[0.3em] uppercase mb-4"
              style={{ color: `${SHINE_COLORS.cream}50` }}
            >
              Pide a Domicilio
            </p>
            <div className="flex gap-3">
              <span
                className="px-3 py-1.5 text-xs font-bold tracking-wider uppercase"
                style={{
                  color: `${SHINE_COLORS.cream}CC`,
                  background: `${SHINE_COLORS.cream}08`,
                  border: `1px solid ${SHINE_COLORS.cream}15`,
                }}
              >
                Rappi
              </span>
              <span
                className="px-3 py-1.5 text-xs font-bold tracking-wider uppercase"
                style={{
                  color: `${SHINE_COLORS.cream}CC`,
                  background: `${SHINE_COLORS.cream}08`,
                  border: `1px solid ${SHINE_COLORS.cream}15`,
                }}
              >
                Uber Eats
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px w-full mb-8"
          style={{
            background: `linear-gradient(to right, transparent, ${SHINE_COLORS.gold}20, transparent)`,
          }}
        />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: `${SHINE_COLORS.cream}40` }}>
            © {new Date().getFullYear()} {restaurant.name}. Todos los derechos reservados.
          </p>
          <p
            className="text-xs tracking-[0.2em] uppercase"
            style={{ color: `${SHINE_COLORS.cream}30` }}
          >
            Powered by AutoRestro Chile
          </p>
        </div>
      </div>
    </footer>
  );
}
