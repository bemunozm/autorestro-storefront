'use client';

import { Star } from 'lucide-react';
import { useLoyaltyProgram, useLoyaltyBalance } from '@/hooks/useLoyalty';
import { useAuthStore } from '@/stores/auth-store';

export function LoyaltyBadge() {
  const { isAuthenticated } = useAuthStore();
  const { data: program } = useLoyaltyProgram();
  const { data: balance } = useLoyaltyBalance();

  if (!program?.isActive || !isAuthenticated) return null;

  return (
    <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold border border-amber-200">
      <Star size={14} className="fill-amber-400 text-amber-400" />
      <span>{balance?.currentBalance ?? 0}</span>
      {balance?.currentTier && (
        <span className="text-amber-500 font-medium">· {balance.currentTier}</span>
      )}
    </div>
  );
}
