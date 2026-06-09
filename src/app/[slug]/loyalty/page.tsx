'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRestaurant } from '@/providers/restaurant-provider';
import { useAuthStore } from '@/stores/auth-store';
import {
  useLoyaltyProgram,
  useLoyaltyBalance,
  useLoyaltyRewards,
  useRedeemDiscountReward,
} from '@/hooks/useLoyalty';
import { useCartStore } from '@/stores/cart-store';
import { formatPrice } from '@/lib/format';
import type { LoyaltyTier, LoyaltyReward, LoyaltyProgram, MultiplierEvent } from '@/types/loyalty';
import {
  Star,
  Gift,
  Lock,
  Sparkles,
  LogIn,
  UtensilsCrossed,
  Trophy,
  Percent,
  Tag,
  Copy,
  Check,
  Loader2,
  Zap,
  ChevronRight,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function formatPoints(n: number): string {
  return new Intl.NumberFormat('es-CL').format(n);
}

function isEventActiveNow(event: MultiplierEvent): boolean {
  if (!event.isActive) return false;

  const now = new Date();

  if (event.startDate && new Date(event.startDate) > now) return false;
  if (event.endDate && new Date(event.endDate) < now) return false;

  if (event.daysOfWeek && event.daysOfWeek.length > 0) {
    const jsDay = now.getDay();
    const isoDay = jsDay === 0 ? 7 : jsDay;
    if (!event.daysOfWeek.includes(isoDay)) return false;
  }

  if (event.startTime && event.endTime) {
    const nowTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    if (nowTime < event.startTime || nowTime > event.endTime) return false;
  }

  return true;
}

function getPeriodEndDate(program: LoyaltyProgram): Date | null {
  if (!program.pointsExpirationMonths) return null;
  const start = new Date(program.lastPeriodReset ?? program.createdAt);
  start.setMonth(start.getMonth() + program.pointsExpirationMonths);
  return start;
}

function formatEventSchedule(event: MultiplierEvent): string {
  const dayNames = ['', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const parts: string[] = [];

  if (event.daysOfWeek && event.daysOfWeek.length > 0) {
    parts.push(event.daysOfWeek.map((d) => dayNames[d]).join(', '));
  }

  if (event.startTime && event.endTime) {
    parts.push(`${event.startTime} – ${event.endTime}`);
  }

  return parts.join(' · ') || 'Siempre activo';
}

/* ─── Hero Card ──────────────────────────────────────────────────────────── */

interface HeroCardProps {
  currentBalance: number;
  totalEarned: number;
  totalRedeemed: number;
  currentTierName: string | null;
  currentTierObj: LoyaltyTier | null;
  nextTier: LoyaltyTier | null;
  progressPercent: number;
  pointsToNext: number;
  hasTiers: boolean;
  periodEndDate: Date | null;
}

function HeroCard({
  currentBalance,
  totalEarned,
  totalRedeemed,
  currentTierName,
  currentTierObj,
  nextTier,
  progressPercent,
  pointsToNext,
  hasTiers,
  periodEndDate,
}: HeroCardProps) {
  const periodLabel = periodEndDate
    ? `${String(periodEndDate.getMonth() + 1).padStart(2, '0')}/${String(periodEndDate.getFullYear()).slice(2)}`
    : null;

  return (
    <div
      className="relative bg-(--color-primary) rounded-3xl overflow-hidden"
      style={{ animation: 'fadeInUp 0.5s ease-out forwards' }}
    >
      {/* Decorative background shapes */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/[0.06] pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/[0.04] pointer-events-none" />
      <div className="absolute top-1/2 right-8 -translate-y-1/2 w-20 h-20 rounded-full bg-white/[0.04] pointer-events-none" />

      <div className="relative px-6 pt-5 pb-5">
        {/* Top row: label + badges */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-white/50 text-[10px] font-bold uppercase tracking-[0.15em] flex items-center gap-1.5">
            <Star size={10} />
            Mi Membresía
          </p>
          {currentTierName && currentTierObj && (
            <div className="flex items-center gap-1.5">
              {currentTierObj.multiplier > 1 && (
                <div className="flex items-center gap-1 bg-amber-400/20 border border-amber-300/25 rounded-full px-2 py-0.5">
                  <Zap size={9} className="text-amber-300" />
                  <span className="text-amber-200 text-[10px] font-bold">{currentTierObj.multiplier}x</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 bg-white/12 border border-white/15 rounded-full px-2.5 py-1">
                <Trophy size={10} className="text-white/70" />
                <span className="text-white text-[11px] font-bold">{currentTierName}</span>
              </div>
            </div>
          )}
        </div>

        {/* Balance — the hero number */}
        <p className="text-white text-[2.75rem] font-black tracking-tight leading-none mb-1">
          {formatPoints(currentBalance)}
          <span className="text-white/35 text-base font-semibold ml-1.5">pts</span>
        </p>

        {/* Tier progress bar */}
        {hasTiers && nextTier ? (
          <div className="mt-4 mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-white/40 text-[10px] font-semibold">
                {currentTierName ?? 'Inicio'}
              </span>
              <span className="text-white/60 text-[10px] font-bold">
                {pointsToNext > 0
                  ? `${formatPoints(pointsToNext)} pts para ${nextTier.name}`
                  : 'Nivel máximo'}
              </span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="mt-4" />
        )}

        {/* Bottom bar: stats left + period right */}
        <div className="flex items-end justify-between pt-3 border-t border-white/10">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-white/35 text-[9px] font-semibold uppercase tracking-wider">Ganados</p>
              <p className="text-white/75 text-sm font-bold">{formatPoints(totalEarned)}</p>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div>
              <p className="text-white/35 text-[9px] font-semibold uppercase tracking-wider">Canjeados</p>
              <p className="text-white/75 text-sm font-bold">{formatPoints(totalRedeemed)}</p>
            </div>
          </div>

          {periodLabel && (
            <div className="text-right">
              <p className="text-white/30 text-[8px] font-bold uppercase tracking-[0.2em]">Vence</p>
              <p className="text-white/60 text-sm font-black tracking-wide">{periodLabel}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Multiplier Events ──────────────────────────────────────────────────── */

interface MultiplierEventsProps {
  events: MultiplierEvent[];
  animationDelay: number;
}

function MultiplierEvents({ events, animationDelay }: MultiplierEventsProps) {
  const activeEvents = events.filter((e) => e.isActive);
  if (activeEvents.length === 0) return null;

  return (
    <div
      style={{
        animation: `fadeInUp 0.5s ease-out ${animationDelay}ms forwards`,
        opacity: 0,
      }}
    >
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 mb-3">
        Promociones activas
      </p>
      <div className="space-y-2">
        {activeEvents.map((event, i) => {
          const activeNow = isEventActiveNow(event);
          return (
            <div
              key={i}
              className="flex items-center gap-3 bg-amber-50/70 border border-amber-200/50 rounded-2xl px-4 py-3"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <Zap size={16} className="text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-gray-800 truncate">{event.name}</p>
                  {activeNow && (
                    <span className="flex items-center gap-1 shrink-0 text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Ahora
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-amber-600 mt-0.5">{formatEventSchedule(event)}</p>
              </div>
              <div className="shrink-0 bg-amber-400/20 border border-amber-300/40 rounded-xl px-2.5 py-1.5">
                <span className="text-amber-700 text-sm font-black">{event.multiplier}x</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Tier Cards ─────────────────────────────────────────────────────────── */

interface TierCardProps {
  tier: LoyaltyTier;
  index: number;
  isCurrent: boolean;
  isNext: boolean;
  isLocked: boolean;
}

function TierCard({ tier, index, isCurrent, isNext, isLocked }: TierCardProps) {
  const ringClass = isCurrent
    ? 'ring-2 ring-(--color-primary) ring-offset-2'
    : isNext
    ? 'ring-1 ring-amber-300'
    : '';

  const opacityClass = isLocked && !isNext ? 'opacity-50' : '';

  return (
    <div
      className={`relative shrink-0 w-44 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3 transition-all ${ringClass} ${opacityClass}`}
      style={{ animationDelay: `${(index + 3) * 80}ms` }}
    >
      {isCurrent && (
        <span className="absolute -top-2.5 left-4 bg-(--color-primary) text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
          Tu nivel
        </span>
      )}
      {isLocked && !isNext && (
        <span className="absolute top-3 right-3 text-gray-300">
          <Lock size={13} />
        </span>
      )}
      {isNext && (
        <span className="absolute -top-2.5 left-4 bg-amber-400 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
          Siguiente
        </span>
      )}

      <div className="flex items-center gap-2">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            isCurrent
              ? 'bg-(--color-primary) text-white'
              : isNext
              ? 'bg-amber-100 text-amber-600'
              : 'bg-gray-100 text-gray-400'
          }`}
        >
          <Trophy size={15} />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 leading-tight">{tier.name}</p>
          <p className="text-[11px] text-gray-400">desde {formatPoints(tier.minPoints)} pts</p>
        </div>
      </div>

      <div
        className={`text-xs font-bold px-2.5 py-1 rounded-full self-start ${
          isCurrent
            ? 'bg-primary/10 text-(--color-primary)'
            : 'bg-gray-100 text-gray-500'
        }`}
      >
        {tier.multiplier}x puntos
      </div>

      {tier.benefits && tier.benefits.length > 0 && (
        <ul className="space-y-1">
          {tier.benefits.map((b, i) => (
            <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-500">
              <Sparkles
                size={10}
                className={`mt-0.5 shrink-0 ${isCurrent ? 'text-(--color-primary)' : 'text-gray-300'}`}
              />
              {b}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ─── Tier Progression Section ───────────────────────────────────────────── */

interface TierProgressionProps {
  sortedTiers: LoyaltyTier[];
  currentTierName: string | null;
  nextTier: LoyaltyTier | null;
  currentBalance: number;
  animationDelay: number;
}

function TierProgression({
  sortedTiers,
  currentTierName,
  nextTier,
  currentBalance,
  animationDelay,
}: TierProgressionProps) {
  if (sortedTiers.length === 0) return null;

  return (
    <div
      style={{
        animation: `fadeInUp 0.5s ease-out ${animationDelay}ms forwards`,
        opacity: 0,
      }}
    >
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1 mb-3">
        Niveles
      </p>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scrollbar-none">
        {sortedTiers.map((tier, i) => {
          const isCurrent = tier.name === currentTierName;
          const isNext = nextTier?.name === tier.name && !isCurrent;
          const isLocked = currentBalance < tier.minPoints;
          return (
            <div key={tier.name} className="snap-start">
              <TierCard
                tier={tier}
                index={i}
                isCurrent={isCurrent}
                isNext={isNext}
                isLocked={isLocked}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Reward Card ────────────────────────────────────────────────────────── */

interface RewardCardProps {
  reward: LoyaltyReward;
  index: number;
  canRedeem: boolean;
  missingPoints: number;
  onRedeem: () => void;
  onRedeemDiscount: (reward: LoyaltyReward) => void;
}

function RewardCard({
  reward,
  index,
  canRedeem,
  missingPoints,
  onRedeem,
  onRedeemDiscount,
}: RewardCardProps) {
  const [added, setAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isDiscount = reward.type === 'discount';
  const isPromo = reward.type === 'promo';

  const handleRedeemProduct = () => {
    onRedeem();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleRedeemDiscount = () => {
    setIsLoading(true);
    onRedeemDiscount(reward);
    // Fallback reset — parent dialog opening causes re-render that clears state naturally
    setTimeout(() => setIsLoading(false), 5000);
  };

  const discountLabel = (() => {
    if (!isDiscount || reward.discountValue === null) return null;
    if (reward.discountType === 'percentage') return `-${reward.discountValue}%`;
    return `-${formatPrice(reward.discountValue)}`;
  })();

  const typeBg = isDiscount ? 'bg-violet-50' : isPromo ? 'bg-blue-50' : 'bg-amber-50';
  const typeText = isDiscount ? 'text-violet-600' : isPromo ? 'text-blue-600' : 'text-amber-600';
  const typeIcon = isDiscount ? <Percent size={20} /> : isPromo ? <Tag size={20} /> : <Gift size={20} />;
  const typeLabel = isDiscount ? 'Descuento' : isPromo ? 'Promo' : 'Producto';

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      style={{ animation: `fadeInUp 0.4s ease-out ${index * 70}ms forwards`, opacity: 0 }}
    >
      <div className="flex">
        {/* Thumbnail — left side */}
        <div className={`relative w-28 shrink-0 ${reward.imageUrl ? 'bg-gray-100' : typeBg}`}>
          {reward.imageUrl ? (
            <Image src={reward.imageUrl} alt={reward.name} fill className="object-cover" />
          ) : (
            <div className="h-full flex items-center justify-center opacity-30">
              {typeIcon}
            </div>
          )}
          {!canRedeem && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px]" />
          )}
        </div>

        {/* Content — right side */}
        <div className="flex-1 min-w-0 px-4 py-3.5 flex flex-col">
          {/* Badges row */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className={`text-[10px] font-bold ${typeText} ${typeBg} px-2 py-0.5 rounded-full`}>
              {isDiscount && discountLabel ? discountLabel : typeLabel}
            </span>
            <span className="flex items-center gap-0.5 text-[11px] font-black text-gray-900">
              <Star size={10} className="text-amber-400" />
              {formatPoints(reward.pointsCost)}
            </span>
          </div>

          {/* Title + description */}
          <p className="text-sm font-bold text-gray-900 leading-tight truncate">{reward.name}</p>
          {reward.description && (
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 leading-snug">{reward.description}</p>
          )}

          {/* Button — always visible, pushed to bottom */}
          <div className="mt-auto pt-2.5">
            {canRedeem ? (
              isDiscount ? (
                <button
                  onClick={handleRedeemDiscount}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-1.5 h-9 rounded-xl text-[11px] font-bold uppercase tracking-wide transition-all active:scale-[0.97] bg-(--color-primary) text-white hover:opacity-90 disabled:opacity-60"
                >
                  {isLoading ? <Loader2 size={12} className="animate-spin" /> : <><Tag size={12} /> Obtener código</>}
                </button>
              ) : (
                <button
                  onClick={handleRedeemProduct}
                  className={`w-full flex items-center justify-center gap-1.5 h-9 rounded-xl text-[11px] font-bold uppercase tracking-wide transition-all active:scale-[0.97] ${
                    added
                      ? 'bg-emerald-500 text-white'
                      : 'bg-(--color-primary) text-white hover:opacity-90'
                  }`}
                >
                  {added ? <><Sparkles size={12} /> Agregado</> : <><Gift size={12} /> Canjear</>}
                </button>
              )
            ) : (
              <button
                disabled
                className="w-full flex items-center justify-center gap-1.5 h-9 rounded-xl text-[11px] font-bold uppercase tracking-wide bg-gray-100 text-gray-400 cursor-not-allowed"
              >
                <Lock size={11} />
                Faltan {formatPoints(missingPoints)} pts
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Discount Code Dialog ───────────────────────────────────────────────── */

interface DiscountCodeDialogProps {
  open: boolean;
  onClose: () => void;
  promoCode: string;
  rewardName: string;
}

function DiscountCodeDialog({ open, onClose, promoCode, rewardName }: DiscountCodeDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(promoCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="max-w-sm mx-auto rounded-2xl">
        <DialogHeader>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Tag size={22} className="text-(--color-primary)" />
          </div>
          <DialogTitle className="text-center text-gray-900">¡Código obtenido!</DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-500">
            Canjea <span className="font-semibold text-gray-700">{rewardName}</span> en el checkout.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-between gap-3 bg-gray-50 border border-gray-200 hover:bg-gray-100 active:scale-[0.98] transition-all rounded-xl px-4 py-3 group"
          >
            <span className="font-mono text-lg font-black text-gray-900 tracking-widest">
              {promoCode}
            </span>
            <span className="shrink-0 text-gray-400 group-hover:text-(--color-primary) transition-colors">
              {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
            </span>
          </button>
          <p className="text-[11px] text-gray-400 text-center mt-2">
            Toca para copiar. También fue enviado a tu email.
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full h-11 rounded-xl bg-(--color-primary) text-white text-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Entendido
        </button>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Loading Skeleton ───────────────────────────────────────────────────── */

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-lg mx-auto p-4 space-y-4 pt-6">
        <div className="h-52 rounded-3xl bg-gray-200 animate-pulse" />
        <div className="h-8 rounded bg-gray-100 animate-pulse w-40" />
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse flex">
              <div className="w-28 shrink-0 bg-gray-100 min-h-28" />
              <div className="flex-1 p-3.5 space-y-2">
                <div className="flex gap-2">
                  <div className="h-4 bg-gray-100 rounded-full w-16" />
                  <div className="h-4 bg-gray-100 rounded w-10" />
                </div>
                <div className="h-3.5 bg-gray-200 rounded w-3/4" />
                <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                <div className="h-9 bg-gray-100 rounded-xl mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function LoyaltyPage() {
  const { basePath } = useRestaurant();
  const { isAuthenticated } = useAuthStore();

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const { data: program, isLoading: loadingProgram } = useLoyaltyProgram();
  const { data: balance, isLoading: loadingBalance } = useLoyaltyBalance();
  const { data: rewards, isLoading: loadingRewards } = useLoyaltyRewards();
  const { addLoyaltyReward } = useCartStore();
  const { mutate: redeemDiscountReward } = useRedeemDiscountReward();

  const [discountDialog, setDiscountDialog] = useState<{
    promoCode: string;
    rewardName: string;
  } | null>(null);

  // SSR hydration safety — match server render (unauthenticated) until mounted
  const authed = hasMounted && isAuthenticated;

  /* ── Loading ── */
  if (!hasMounted || loadingProgram || (authed && loadingBalance)) {
    return <LoadingSkeleton />;
  }

  /* ── Not authenticated ── */
  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div
          className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5"
          style={{ animation: 'fadeInUp 0.4s ease-out forwards' }}
        >
          <Star size={28} className="text-(--color-primary)" />
        </div>
        <h1
          className="text-xl font-black text-gray-900 mb-2 text-center"
          style={{ animation: 'fadeInUp 0.4s ease-out 80ms forwards', opacity: 0 }}
        >
          Mis Puntos
        </h1>
        <p
          className="text-sm text-gray-500 text-center max-w-xs mb-8"
          style={{ animation: 'fadeInUp 0.4s ease-out 160ms forwards', opacity: 0 }}
        >
          Inicia sesión para ver tu saldo de puntos, historial y beneficios de fidelidad.
        </p>
        <Link
          href={`${basePath}/auth/login`}
          className="flex items-center gap-2 px-6 h-12 rounded-2xl bg-(--color-primary) text-white text-sm font-bold hover:opacity-90 active:scale-[0.97] transition-all"
          style={{ animation: 'fadeInUp 0.4s ease-out 240ms forwards', opacity: 0 }}
        >
          <LogIn size={16} />
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  /* ── No active program ── */
  if (!program?.isActive) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
          <Star size={28} className="text-gray-300" />
        </div>
        <h1 className="text-xl font-black text-gray-900 mb-2 text-center">
          Sin programa activo
        </h1>
        <p className="text-sm text-gray-500 text-center max-w-xs mb-8">
          Este restaurante aún no tiene un programa de fidelidad activo. ¡Vuelve pronto!
        </p>
        <Link
          href={`${basePath}/menu`}
          className="flex items-center gap-2 px-6 h-12 rounded-2xl bg-(--color-primary) text-white text-sm font-bold hover:opacity-90 active:scale-[0.97] transition-all"
        >
          <UtensilsCrossed size={16} />
          Ir al menú
        </Link>
      </div>
    );
  }

  /* ── Tier calculations ── */
  const tiers = program.tiers ?? [];
  const sortedTiers = [...tiers].sort((a, b) => a.minPoints - b.minPoints);
  const hasTiers = sortedTiers.length > 0;

  const currentBalance = balance?.currentBalance ?? 0;
  const currentTierName = balance?.currentTier ?? null;

  const currentTierIndex = sortedTiers.findIndex((t) => t.name === currentTierName);
  const nextTier = currentTierIndex >= 0 ? sortedTiers[currentTierIndex + 1] : sortedTiers[0];
  const currentTierObj = currentTierIndex >= 0 ? sortedTiers[currentTierIndex] : null;

  const progressPercent =
    nextTier && currentTierObj
      ? Math.min(
          100,
          Math.round(
            ((currentBalance - currentTierObj.minPoints) /
              (nextTier.minPoints - currentTierObj.minPoints)) *
              100,
          ),
        )
      : nextTier
      ? Math.min(100, Math.round((currentBalance / nextTier.minPoints) * 100))
      : 100;

  const pointsToNext = nextTier ? Math.max(0, nextTier.minPoints - currentBalance) : 0;

  /* ── Rewards ── */
  const activeRewards = rewards?.filter((r) => r.isActive) ?? [];

  const handleRedeemDiscount = (reward: LoyaltyReward) => {
    redeemDiscountReward(
      { rewardId: reward.id },
      {
        onSuccess: (data) => {
          setDiscountDialog({ promoCode: data.promoCode, rewardName: reward.name });
        },
      },
    );
  };

  /* ── Multiplier events ── */
  const multiplierEvents = program.multiplierEvents ?? [];

  /* ── Compute section animation delays ── */
  let delayAccum = 80;

  const hasMultiplierEvents = multiplierEvents.some((e) => e.isActive);
  const multiplierEventsDelay = 80 + delayAccum;
  delayAccum += hasMultiplierEvents ? 80 : 0;

  const tierProgressionDelay = 80 + delayAccum;
  delayAccum += hasTiers ? 80 : 0;

  const rewardsCatalogDelay = 80 + delayAccum;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <main className="max-w-lg mx-auto p-4 space-y-5 pt-5">

        {/* ── 1. Hero Card ─────────────────────────────────────────── */}
        <HeroCard
          currentBalance={currentBalance}
          totalEarned={balance?.totalPointsEarned ?? 0}
          totalRedeemed={balance?.totalPointsRedeemed ?? 0}
          currentTierName={currentTierName}
          currentTierObj={currentTierObj}
          nextTier={hasTiers ? nextTier ?? null : null}
          progressPercent={progressPercent}
          pointsToNext={pointsToNext}
          hasTiers={hasTiers}
          periodEndDate={getPeriodEndDate(program)}
        />

        {/* ── 2. Active Multiplier Events ──────────────────────────── */}
        {hasMultiplierEvents && (
          <MultiplierEvents
            events={multiplierEvents}
            animationDelay={multiplierEventsDelay}
          />
        )}

        {/* ── 4. Tier Progression ──────────────────────────────────── */}
        {hasTiers && (
          <TierProgression
            sortedTiers={sortedTiers}
            currentTierName={currentTierName}
            nextTier={nextTier ?? null}
            currentBalance={currentBalance}
            animationDelay={tierProgressionDelay}
          />
        )}

        {/* ── 5. Rewards Catalog ───────────────────────────────────── */}
        <div
          style={{
            animation: `fadeInUp 0.5s ease-out ${rewardsCatalogDelay}ms forwards`,
            opacity: 0,
          }}
        >
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 mb-3">
            Recompensas disponibles
          </p>

          {loadingRewards ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-32 bg-gray-100" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                    <div className="h-10 bg-gray-100 rounded-xl mt-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : activeRewards.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center py-10 px-5 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-3">
                <Gift size={22} className="text-amber-300" />
              </div>
              <p className="text-sm font-semibold text-gray-400">No hay recompensas disponibles aún</p>
              <p className="text-xs text-gray-300 mt-1">
                ¡El restaurante pronto agregará recompensas para ti!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {[...activeRewards]
                .sort((a, b) => a.pointsCost - b.pointsCost)
                .map((reward, i) => {
                  const canRedeem = currentBalance >= reward.pointsCost;
                  const missing = reward.pointsCost - currentBalance;
                  return (
                    <RewardCard
                      key={reward.id}
                      reward={reward}
                      index={i}
                      canRedeem={canRedeem}
                      missingPoints={missing}
                      onRedeem={() => addLoyaltyReward(reward)}
                      onRedeemDiscount={handleRedeemDiscount}
                    />
                  );
                })}
            </div>
          )}

          {/* Earn more CTA */}
          <Link
            href={`${basePath}/menu`}
            className="mt-3 flex items-center justify-center gap-2 w-full h-11 rounded-2xl bg-white border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 active:scale-[0.98] transition-all"
          >
            <UtensilsCrossed size={15} className="text-(--color-primary)" />
            Ir al menú para ganar puntos
            <ChevronRight size={14} className="text-gray-400" />
          </Link>
        </div>

      </main>

      {/* ── Discount code dialog ─────────────────────────────────────── */}
      {discountDialog && (
        <DiscountCodeDialog
          open
          onClose={() => setDiscountDialog(null)}
          promoCode={discountDialog.promoCode}
          rewardName={discountDialog.rewardName}
        />
      )}
    </div>
  );
}
