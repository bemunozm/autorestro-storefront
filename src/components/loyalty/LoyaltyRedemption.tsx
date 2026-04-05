'use client';

import { useState } from 'react';
import { Star, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLoyaltyProgram, useLoyaltyBalance } from '@/hooks/useLoyalty';
import { formatPrice } from '@/lib/format';

interface LoyaltyRedemptionProps {
  onRedeem: (points: number, discountAmount: number) => void;
  onClear: () => void;
  appliedPoints: number;
}

export function LoyaltyRedemption({ onRedeem, onClear, appliedPoints }: LoyaltyRedemptionProps) {
  const { data: program } = useLoyaltyProgram();
  const { data: balance } = useLoyaltyBalance();
  const [pointsToRedeem, setPointsToRedeem] = useState(0);

  if (!program?.isActive || !balance || balance.currentBalance < program.minimumRedemption) {
    return null;
  }

  const maxRedeemable = balance.currentBalance;
  const discountAmount = Math.floor(pointsToRedeem / program.pointsRedemptionRate);

  const handleApply = () => {
    if (pointsToRedeem >= program.minimumRedemption && pointsToRedeem <= maxRedeemable) {
      onRedeem(pointsToRedeem, discountAmount);
    }
  };

  if (appliedPoints > 0) {
    const appliedDiscount = Math.floor(appliedPoints / program.pointsRedemptionRate);
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-700 font-bold text-sm">
            <Gift size={16} />
            <span>{appliedPoints} puntos aplicados (-{formatPrice(appliedDiscount)})</span>
          </div>
          <button onClick={onClear} className="text-green-600 text-xs font-medium hover:underline">
            Quitar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
          <Star size={16} className="fill-amber-400 text-amber-400" />
          Tienes {balance.currentBalance} puntos
        </div>
        {balance.currentTier && (
          <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-medium">
            {balance.currentTier}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <input
          type="range"
          min={program.minimumRedemption}
          max={maxRedeemable}
          step={program.minimumRedemption}
          value={pointsToRedeem || program.minimumRedemption}
          onChange={(e) => setPointsToRedeem(Number(e.target.value))}
          className="flex-1 accent-amber-500"
        />
        <span className="text-sm font-bold text-amber-800 min-w-[60px] text-right">
          {pointsToRedeem} pts
        </span>
      </div>

      {pointsToRedeem > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-amber-600">
            Descuento: {formatPrice(discountAmount)}
          </span>
          <Button
            size="sm"
            className="rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs px-4"
            onClick={handleApply}
          >
            Aplicar
          </Button>
        </div>
      )}
    </div>
  );
}
