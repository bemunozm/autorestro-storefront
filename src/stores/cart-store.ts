import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/menu';

export interface CartItem {
  product: Product;
  quantity: number;
  comment?: string;
}

interface CartState {
  items: CartItem[];
  restaurantSlug: string | null;
  addItem: (product: Product, quantity: number, comment?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateComment: (productId: string, comment: string) => void;
  updateItem: (productId: string, updates: { quantity?: number; comment?: string }) => void;
  clearCart: () => void;
  setRestaurantSlug: (slug: string) => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantSlug: null,
      addItem: (product, quantity, comment) => {
        const { items } = get();
        // If adding from different restaurant, clear cart
        const existing = items.find(i => i.product.id === product.id);
        if (existing) {
          set({ items: items.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + quantity, comment: comment !== undefined ? comment : i.comment } : i) });
        } else {
          set({ items: [...items, { product, quantity, comment }] });
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
      clearCart: () => set({ items: [] }),
      setRestaurantSlug: (slug) => {
        if (get().restaurantSlug !== slug) set({ items: [], restaurantSlug: slug });
        else set({ restaurantSlug: slug });
      },
      getTotal: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'autorestro-cart' }
  )
);
