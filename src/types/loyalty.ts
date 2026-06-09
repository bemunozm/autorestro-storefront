export interface MultiplierEvent {
  name: string;
  multiplier: number;
  daysOfWeek?: number[];
  startTime?: string;   // HH:mm
  endTime?: string;     // HH:mm
  startDate?: string;   // YYYY-MM-DD
  endDate?: string;     // YYYY-MM-DD
  isActive: boolean;
}

export interface LoyaltyProgram {
  id: string;
  restaurantId: string;
  isActive: boolean;
  pointsPerCurrencyUnit: number;
  pointsRedemptionRate: number;
  welcomeBonus: number;
  minimumRedemption: number;
  tiers: LoyaltyTier[] | null;
  multiplierEvents: MultiplierEvent[] | null;
  birthdayBonus: number;
  pointsExpirationMonths: number | null;
  lastPeriodReset: string | null;  // ISO date string
  createdAt: string;               // ISO date string
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

export interface LoyaltyReward {
  id: string;
  restaurantId: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  pointsCost: number;
  productId: string | null;
  productIds: string[];
  isActive: boolean;
  sortOrder: number;
  type: 'product' | 'discount' | 'promo';
  discountType: 'percentage' | 'fixed' | null;
  discountValue: number | null;
}
