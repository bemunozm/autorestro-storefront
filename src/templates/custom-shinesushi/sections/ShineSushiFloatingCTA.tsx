'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useRestaurant } from '@/providers/restaurant-provider';
import { SHINE_COLORS } from '../data/defaults';

export function ShineSushiFloatingCTA() {
  const { basePath } = useRestaurant();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <a
      href={`${basePath}/menu`}
      aria-label="Pedir Ahora"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 40,
        backgroundColor: SHINE_COLORS.orange,
        color: '#fff',
        borderRadius: '50px',
        padding: '14px 24px',
        fontWeight: 700,
        fontSize: '0.88rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        textDecoration: 'none',
        boxShadow: `0 8px 32px ${SHINE_COLORS.orange}60`,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(80px) scale(0.8)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <ShoppingBag size={18} />
      Pedir Ahora
    </a>
  );
}
