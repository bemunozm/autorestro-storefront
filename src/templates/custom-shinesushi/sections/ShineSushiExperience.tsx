'use client';

import Image from 'next/image';
import { SectionProps } from '../../types';
import { ScrollReveal } from '../../sections/ScrollReveal';
import { SHINE_COLORS, DEFAULT_EXPERIENCES, ShineExperience } from '../data/defaults';

export function ShineSushiExperience({ content }: SectionProps) {
  const rawExperiences = content.experiences as ShineExperience[] | undefined;
  const experiences =
    rawExperiences && rawExperiences.length > 0 ? rawExperiences : DEFAULT_EXPERIENCES;
  const title = (content.title as string | undefined) || 'La Experiencia Shine';

  return (
    <section
      style={{
        backgroundColor: SHINE_COLORS.bg,
        padding: 'clamp(80px, 12vh, 140px) 0',
        overflow: 'hidden',
      }}
    >
      {/* Section header */}
      <ScrollReveal direction="up">
        <div
          style={{
            padding: '0 clamp(24px, 6vw, 80px)',
            maxWidth: '1400px',
            margin: '0 auto 64px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          <div>
            <p
              style={{
                color: SHINE_COLORS.orange,
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}
            >
              Vive el Momento
            </p>
            <h2
              style={{
                color: SHINE_COLORS.cream,
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1,
                margin: 0,
              }}
            >
              {title}
            </h2>
          </div>
          <p
            style={{
              color: SHINE_COLORS.muted,
              fontSize: '0.9rem',
              lineHeight: 1.7,
              maxWidth: '380px',
              margin: 0,
            }}
          >
            Un ambiente único que combina sabor, música y la mejor vista del norte de Chile
          </p>
        </div>
      </ScrollReveal>

      {/* Full-width experience cards — horizontal strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${experiences.length}, 1fr)`,
          gap: '2px',
        }}
        className="experience-grid"
      >
        {experiences.map((exp: ShineExperience, idx: number) => (
          <ScrollReveal key={idx} direction="none" delay={idx * 80}>
            <div
              style={{
                position: 'relative',
                aspectRatio: '3/4',
                overflow: 'hidden',
                cursor: 'pointer',
                minHeight: '480px',
              }}
              className="experience-card group"
            >
              {exp.imageUrl ? (
                <Image
                  src={exp.imageUrl}
                  alt={exp.title}
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                />
              ) : (
                <div style={{ position: 'absolute', inset: 0, background: SHINE_COLORS.surface }} />
              )}

              {/* Persistent cinematic gradient */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(to top, rgba(12,8,4,0.98) 0%, rgba(12,8,4,0.5) 45%, rgba(12,8,4,0.1) 100%)`,
                }}
              />

              {/* Number watermark */}
              <div
                style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  color: `rgba(232,117,26,0.12)`,
                  fontSize: '5rem',
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: '-0.05em',
                  userSelect: 'none',
                  transition: 'color 0.5s',
                }}
                className="experience-num"
              >
                {String(idx + 1).padStart(2, '0')}
              </div>

              {/* Top blue accent line — expands on hover */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '2px',
                  width: '0',
                  background: SHINE_COLORS.orange,
                  transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
                }}
                className="experience-line"
              />

              {/* Content */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '32px',
                  transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)',
                }}
                className="experience-content"
              >
                <p
                  style={{
                    color: SHINE_COLORS.orange,
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    letterSpacing: '0.35em',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                    opacity: 0,
                    transition: 'opacity 0.4s 0.1s',
                  }}
                  className="experience-desc-label"
                >
                  Experiencia {String(idx + 1).padStart(2, '0')}
                </p>

                <h3
                  style={{
                    color: SHINE_COLORS.cream,
                    fontSize: 'clamp(1.4rem, 2vw, 1.9rem)',
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                    margin: '0 0 12px',
                  }}
                >
                  {exp.title}
                </h3>

                <p
                  style={{
                    color: SHINE_COLORS.muted,
                    fontSize: '0.85rem',
                    lineHeight: 1.65,
                    margin: 0,
                    maxHeight: '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.4s',
                    opacity: 0,
                  }}
                  className="experience-desc"
                >
                  {exp.description}
                </p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .experience-grid {
            grid-template-columns: 1fr !important;
          }
          .experience-card {
            aspect-ratio: 16/9 !important;
            min-height: 300px !important;
          }
        }
        .experience-card:hover .experience-line {
          width: 100% !important;
        }
        .experience-card:hover .experience-num {
          color: rgba(232,117,26,0.25) !important;
        }
        .experience-card:hover .experience-desc-label {
          opacity: 1 !important;
        }
        .experience-card:hover .experience-desc {
          max-height: 120px !important;
          opacity: 1 !important;
        }
      `}</style>
    </section>
  );
}
