'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, X, UtensilsCrossed } from 'lucide-react';
import { useRestaurant } from '@/providers/restaurant-provider';
import { SHINE_COLORS } from '../data/defaults';

const NAV_LINKS = [
  { label: 'Menú', href: '#menu' },
  { label: 'Experiencia', href: '#about' },
  { label: 'Locales', href: '#locations' },
];

export function ShineSushiHeader() {
  const { restaurant, basePath } = useRestaurant();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
          background: scrolled
            ? `rgba(12,8,4,0.92)`
            : 'transparent',
          backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
          borderBottom: scrolled ? `1px solid ${SHINE_COLORS.border}` : '1px solid transparent',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 32px',
            height: scrolled ? '64px' : '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'height 0.4s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          {/* Logo mark */}
          <a
            href="#hero"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            {restaurant?.logoUrl ? (
              <div
                style={{
                  position: 'relative',
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                <Image
                  src={restaurant.logoUrl}
                  alt={restaurant?.name ?? 'Shine Sushi'}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: `linear-gradient(135deg, ${SHINE_COLORS.orange}, #b85510)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  flexShrink: 0,
                }}
              >
                <UtensilsCrossed size={18} />
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span
                style={{
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
          </a>

          {/* Desktop nav — centered */}
          <nav
            className="hidden lg:flex"
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '40px',
            }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  color: SHINE_COLORS.muted,
                  textDecoration: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  transition: 'color 0.25s, opacity 0.25s',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = SHINE_COLORS.cream;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = SHINE_COLORS.muted;
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a
              href={`${basePath}/menu`}
              className="hidden lg:flex"
              style={{
                alignItems: 'center',
                gap: '8px',
                background: SHINE_COLORS.orange,
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                padding: '10px 22px',
                borderRadius: '2px',
                transition: 'all 0.25s',
                boxShadow: `0 0 24px ${SHINE_COLORS.orangeGlow}`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px rgba(232,117,26,0.35)`;
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${SHINE_COLORS.orangeGlow}`;
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              Pedir Ahora
            </a>

            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden"
              style={{
                background: 'transparent',
                border: `1px solid ${SHINE_COLORS.border}`,
                cursor: 'pointer',
                color: SHINE_COLORS.cream,
                padding: '8px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                transition: 'border-color 0.2s',
              }}
              aria-label="Abrir menú"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 60,
          background: SHINE_COLORS.bg,
          display: 'flex',
          flexDirection: 'column',
          padding: '28px',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '56px' }}>
          <span
            style={{
              color: SHINE_COLORS.orange,
              fontSize: '0.65rem',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            Shine Sushi
          </span>
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              background: 'transparent',
              border: `1px solid ${SHINE_COLORS.border}`,
              borderRadius: '6px',
              cursor: 'pointer',
              color: SHINE_COLORS.muted,
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {[{ label: 'Inicio', href: '#hero' }, ...NAV_LINKS].map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                color: SHINE_COLORS.cream,
                textDecoration: 'none',
                fontSize: 'clamp(2rem, 8vw, 3rem)',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                padding: '14px 0',
                borderBottom: `1px solid rgba(239,246,255,0.06)`,
                transition: 'color 0.2s',
                animationDelay: `${i * 60}ms`,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = SHINE_COLORS.orange; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = SHINE_COLORS.cream; }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={`${basePath}/menu`}
          onClick={() => setMenuOpen(false)}
          style={{
            background: SHINE_COLORS.orange,
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.9rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            padding: '20px 24px',
            textAlign: 'center',
            borderRadius: '2px',
            marginTop: '32px',
            boxShadow: `0 8px 40px rgba(232,117,26,0.3)`,
          }}
        >
          Pedir Ahora
        </a>
      </div>
    </>
  );
}
