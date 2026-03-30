'use client';

import { Star, ShieldCheck, Zap } from 'lucide-react';
import { SectionProps } from '../../types';
import { SocialProofContent } from '../../types';

const DEFAULT_CONTENT: SocialProofContent = {
  rating: 4.0,
  reviewCount: 200,
  platform: 'TripAdvisor',
  badges: ['Delivery Certificado', 'Pago Seguro', 'Fusión Nikkei'],
};

export function SocialProofBar({ content }: SectionProps) {
  const typedContent = content as unknown as Partial<SocialProofContent>;
  const rating = typedContent.rating ?? DEFAULT_CONTENT.rating;
  const reviewCount = typedContent.reviewCount ?? DEFAULT_CONTENT.reviewCount;
  const platform = typedContent.platform ?? DEFAULT_CONTENT.platform;
  const badges = typedContent.badges && typedContent.badges.length > 0 ? typedContent.badges : DEFAULT_CONTENT.badges;

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  return (
    <section className="py-6 px-6 bg-gray-950 border-y border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Rating block */}
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < fullStars ? 'fill-amber-400 text-amber-400' : i === fullStars && hasHalfStar ? 'fill-amber-400/50 text-amber-400' : 'text-gray-600'}`}
                />
              ))}
            </div>
            <span className="text-white font-black text-xl">{rating.toFixed(1)}</span>
            <span className="text-gray-500 text-sm">
              +{reviewCount} reseñas en {platform}
            </span>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-8 bg-white/10" />

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-4 justify-center">
            {badges.map((badge: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2 text-sm font-medium"
                style={{ color: 'var(--theme-accent, #EA580C)' }}>
                {idx % 2 === 0
                  ? <ShieldCheck className="w-4 h-4" />
                  : <Zap className="w-4 h-4" />}
                <span>{badge}</span>
              </div>
            ))}
          </div>

          {/* Delivery platforms */}
          <div className="hidden lg:flex items-center gap-3 text-gray-500 text-sm">
            <span>Disponible en</span>
            <span className="text-white font-bold">Rappi</span>
            <span>&</span>
            <span className="text-white font-bold">Uber Eats</span>
          </div>
        </div>
      </div>
    </section>
  );
}
