'use client';

import Image from 'next/image';
import { Phone, Mail, MapPin } from 'lucide-react';

function InstagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
import { SectionProps } from '../../types';
import { SHINE_COLORS } from '../data/defaults';
import { useRestaurant } from '@/providers/restaurant-provider';

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function ShineSushiFooter({ content, restaurant }: SectionProps) {
  const { basePath } = useRestaurant();
  const email = (content.email as string | undefined) || 'contacto@shinesushi.cl';
  const phone = (content.phone as string | undefined) || restaurant.phone || '+56 57 244 3313';
  const instagram = (content.instagram as string | undefined) || 'https://instagram.com/shinesushi_';
  const facebook = (content.facebook as string | undefined) || 'https://facebook.com/shinesushii';

  const navLinks = [
    { label: 'Inicio', href: '#hero' },
    { label: 'Menú', href: `${basePath}/menu` },
    { label: 'Nosotros', href: '#about' },
    { label: 'Sucursales', href: '#locations' },
  ];

  return (
    <footer
      style={{
        backgroundColor: SHINE_COLORS.bg,
        borderTop: `1px solid ${SHINE_COLORS.border}`,
        padding: 'clamp(56px, 8vh, 96px) clamp(24px, 6vw, 80px) clamp(32px, 4vh, 48px)',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Main footer grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'clamp(40px, 6vw, 80px)',
            marginBottom: '64px',
          }}
        >
          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              {restaurant.logoUrl ? (
                <div
                  style={{
                    position: 'relative',
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src={restaurant.logoUrl}
                    alt={restaurant.name}
                    fill
                    className="object-contain"
                    loading="lazy"
                  />
                </div>
              ) : null}
              <div style={{ lineHeight: 1 }}>
                <span
                  style={{
                    display: 'block',
                    color: SHINE_COLORS.cream,
                    fontWeight: 900,
                    fontSize: '1rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                  }}
                >
                  Shine
                </span>
                <span
                  style={{
                    display: 'block',
                    color: SHINE_COLORS.orange,
                    fontWeight: 300,
                    fontSize: '0.6rem',
                    letterSpacing: '0.35em',
                    textTransform: 'uppercase',
                  }}
                >
                  Sushi
                </span>
              </div>
            </div>

            <p
              style={{
                color: SHINE_COLORS.muted,
                fontSize: '0.82rem',
                lineHeight: 1.75,
                margin: '0 0 20px',
                maxWidth: '220px',
              }}
            >
              Fusión Nikkei Premium. Rolls artesanales, ceviches y tiraditos del Pacífico.
            </p>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Shine Sushi"
                style={{
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: SHINE_COLORS.orangeDim,
                  border: `1px solid ${SHINE_COLORS.border}`,
                  color: SHINE_COLORS.orange,
                  borderRadius: '6px',
                  transition: 'all 0.25s',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = SHINE_COLORS.orange;
                  (e.currentTarget as HTMLElement).style.color = '#fff';
                  (e.currentTarget as HTMLElement).style.borderColor = SHINE_COLORS.orange;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = SHINE_COLORS.orangeDim;
                  (e.currentTarget as HTMLElement).style.color = SHINE_COLORS.orange;
                  (e.currentTarget as HTMLElement).style.borderColor = SHINE_COLORS.border;
                }}
              >
                <InstagramIcon />
              </a>
              <a
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Shine Sushi"
                style={{
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: SHINE_COLORS.orangeDim,
                  border: `1px solid ${SHINE_COLORS.border}`,
                  color: SHINE_COLORS.orange,
                  borderRadius: '6px',
                  transition: 'all 0.25s',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = SHINE_COLORS.orange;
                  (e.currentTarget as HTMLElement).style.color = '#fff';
                  (e.currentTarget as HTMLElement).style.borderColor = SHINE_COLORS.orange;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = SHINE_COLORS.orangeDim;
                  (e.currentTarget as HTMLElement).style.color = SHINE_COLORS.orange;
                  (e.currentTarget as HTMLElement).style.borderColor = SHINE_COLORS.border;
                }}
              >
                <FacebookIcon />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p
              style={{
                color: SHINE_COLORS.orange,
                fontSize: '0.62rem',
                fontWeight: 700,
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              Explorar
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    style={{
                      color: SHINE_COLORS.muted,
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = SHINE_COLORS.cream; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = SHINE_COLORS.muted; }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p
              style={{
                color: SHINE_COLORS.orange,
                fontSize: '0.62rem',
                fontWeight: 700,
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              Contacto
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>
                <a
                  href={`tel:${phone}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: SHINE_COLORS.muted,
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = SHINE_COLORS.cream; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = SHINE_COLORS.muted; }}
                >
                  <Phone size={13} style={{ color: SHINE_COLORS.orange, flexShrink: 0 }} />
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: SHINE_COLORS.muted,
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = SHINE_COLORS.cream; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = SHINE_COLORS.muted; }}
                >
                  <Mail size={13} style={{ color: SHINE_COLORS.orange, flexShrink: 0 }} />
                  {email}
                </a>
              </li>
              {restaurant.address && (
                <li>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      color: SHINE_COLORS.muted,
                      fontSize: '0.85rem',
                    }}
                  >
                    <MapPin size={13} style={{ color: SHINE_COLORS.orange, flexShrink: 0, marginTop: '2px' }} />
                    {restaurant.address}
                  </span>
                </li>
              )}
            </ul>
          </div>

          {/* Delivery + hours */}
          <div>
            <p
              style={{
                color: SHINE_COLORS.orange,
                fontSize: '0.62rem',
                fontWeight: 700,
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              Pide a Domicilio
            </p>
            <div style={{ marginBottom: '20px' }}>
              <span
                style={{
                  display: 'inline-block',
                  color: SHINE_COLORS.muted,
                  background: SHINE_COLORS.orangeDim,
                  border: `1px solid ${SHINE_COLORS.border}`,
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  padding: '6px 14px',
                }}
              >
                Uber Eats
              </span>
            </div>
            <p
              style={{
                color: SHINE_COLORS.dim,
                fontSize: '0.75rem',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Lun–Dom · 12:30 – 00:00<br />
              4 sucursales en Iquique<br />
              y Alto Hospicio
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            paddingTop: '24px',
            borderTop: `1px solid ${SHINE_COLORS.border}`,
          }}
        >
          <p style={{ color: SHINE_COLORS.dim, fontSize: '0.72rem', margin: 0 }}>
            © {new Date().getFullYear()} {restaurant.name}. Todos los derechos reservados.
          </p>
          <p
            style={{
              color: SHINE_COLORS.dim,
              fontSize: '0.62rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            Powered by AutoRestro
          </p>
        </div>
      </div>
    </footer>
  );
}
