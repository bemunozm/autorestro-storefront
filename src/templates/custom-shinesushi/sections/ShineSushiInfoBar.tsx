'use client';

import { SectionProps } from '../../types';
import { SHINE_COLORS } from '../data/defaults';

const MARQUEE_ITEMS = [
  '4 Sucursales en Iquique',
  'Delivery 30–45 min',
  '4.5★ Google Reviews',
  'Fusión Nikkei Premium',
  'Abierto Lun–Dom',
  '+500 Reseñas Verificadas',
  'Acevichado Roll — Plato Insignia',
  'Vista al Mar en Playa Brava',
];

export function ShineSushiInfoBar({ content }: SectionProps) {
  void content;
  return (
    <div
      style={{
        backgroundColor: SHINE_COLORS.surface,
        borderTop: `1px solid ${SHINE_COLORS.border}`,
        borderBottom: `1px solid ${SHINE_COLORS.border}`,
        overflow: 'hidden',
        position: 'relative',
        padding: '14px 0',
      }}
    >
      {/* Fade edges */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '120px',
          background: `linear-gradient(to right, ${SHINE_COLORS.surface}, transparent)`,
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '120px',
          background: `linear-gradient(to left, ${SHINE_COLORS.surface}, transparent)`,
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Scrolling marquee — pure CSS animation */}
      <div
        style={{
          display: 'flex',
          width: 'max-content',
          animation: 'marquee 28s linear infinite',
        }}
      >
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              padding: '0 28px',
              whiteSpace: 'nowrap',
            }}
          >
            <span
              style={{
                color: SHINE_COLORS.muted,
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              {item}
            </span>
            <span
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: SHINE_COLORS.orange,
                flexShrink: 0,
              }}
            />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
