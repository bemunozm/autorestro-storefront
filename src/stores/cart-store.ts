import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/menu';
import type { LoyaltyReward } from '@/types/loyalty';

export interface CartItem {
  product: Product;
  quantity: number;
  comment?: string;
  isLoyaltyReward?: boolean;
  rewardId?: string;
  pointsCost?: number;
}

type OrderType = 'pickup' | 'delivery' | 'dine_in' | null;

interface CartState {
  items: CartItem[];
  restaurantSlug: string | null;
  orderType: OrderType;
  orderNotes: string;
  addItem: (product: Product, quantity: number, comment?: string) => void;
  addLoyaltyReward: (reward: LoyaltyReward) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateComment: (productId: string, comment: string) => void;
  updateItem: (productId: string, updates: { quantity?: number; comment?: string }) => void;
  clearCart: () => void;
  setRestaurantSlug: (slug: string) => void;
  setOrderType: (type: OrderType) => void;
  setOrderNotes: (notes: string) => void;
  getTotal: () => number;
  getItemCount: () => number;
  getLoyaltyItems: () => CartItem[];
  getPaidItems: () => CartItem[];
  getTotalPoints: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantSlug: null,
      orderType: null,
      orderNotes: '',
      addItem: (product, quantity, comment) => {
        const { items } = get();
        // Only match against non-loyalty items to avoid ID collision with reward keys
        const existing = items.find(i => !i.isLoyaltyReward && i.product.id === product.id);
        if (existing) {
          set({ items: items.map(i => (!i.isLoyaltyReward && i.product.id === product.id) ? { ...i, quantity: i.quantity + quantity, comment: comment !== undefined ? comment : i.comment } : i) });
        } else {
          set({ items: [...items, { product, quantity, comment }] });
        }
      },
      addLoyaltyReward: (reward) => {
        const { items } = get();
        const existing = items.find(i => i.rewardId === reward.id);
        if (existing) {
          set({ items: items.map(i => i.rewardId === reward.id ? { ...i, quantity: i.quantity + 1 } : i) });
        } else {
          set({
            items: [...items, {
              product: {
                id: `reward-${reward.id}`,
                name: reward.name,
                description: reward.description ?? undefined,
                price: 0,
                imageUrl: reward.imageUrl ?? undefined,
              },
              quantity: 1,
              isLoyaltyReward: true,
              rewardId: reward.id,
              pointsCost: reward.pointsCost,
            }],
          });
        }
      },
      removeItem: (productId) => set({ items: get().items.filter(i => i.product.id !== productId) }),
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) { get().removeItem(productId); return; }
        set({ items: get().items.map(i => i.product.id === productId ? { ...i, quantity } : i) });
      },
      updateComment: (productId, comment) => {
        set({ items: get().items.map(i => i.product.id === productId ? { ...i, comment } : i) });
      },
      updateItem: (productId, updates) => {
        const { quantity, comment } = updates;
        if (quantity !== undefined && quantity <= 0) { get().removeItem(productId); return; }
        set({
          items: get().items.map(i =>
            i.product.id === productId
              ? {
                  ...i,
                  ...(quantity !== undefined ? { quantity } : {}),
                  ...(comment !== undefined ? { comment } : {}),
                }
              : i
          ),
        });
      },
      clearCart: () => set({ items: [], orderType: null, orderNotes: '' }),
      setOrderType: (type) => set({ orderType: type }),
      setOrderNotes: (notes) => set({ orderNotes: notes }),
      setRestaurantSlug: (slug) => {
        if (get().restaurantSlug !== slug) set({ items: [], restaurantSlug: slug });
        else set({ restaurantSlug: slug });
      },
      // Only paid items contribute to the monetary total
      getTotal: () => get().items.filter(i => !i.isLoyaltyReward).reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      // All items count toward the badge
      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      getLoyaltyItems: () => get().items.filter(i => i.isLoyaltyReward),
      getPaidItems: () => get().items.filter(i => !i.isLoyaltyReward),
      getTotalPoints: () => get().items.filter(i => i.isLoyaltyReward).reduce((sum, i) => sum + (i.pointsCost ?? 0) * i.quantity, 0),
    }),
    { name: 'autorestro-cart' }
  )
);
