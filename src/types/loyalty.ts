export interface LoyaltyProgram {
  id: string;
  restaurantId: string;
  isActive: boolean;
  pointsPerCurrencyUnit: number;
  pointsRedemptionRate: number;
  welcomeBonus: number;
  minimumRedemption: number;
  tiers: LoyaltyTier[] | null;
}

export interface LoyaltyTier {
  name: string;
  minPoints: number;
  multiplier: number;
  benefits?: string[];
}

export interface LoyaltyBalance {
  currentBalance: number;
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  currentTier: string | null;
}

export interface LoyaltyTransaction {
  id: string;
  type: 'earn' | 'redeem' | 'bonus' | 'expire' | 'adjustment';
  points: number;
  description: string | null;
  createdAt: string;
}
