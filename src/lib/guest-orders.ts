const STORAGE_KEY = 'autorestro_active_orders';

export interface ActiveOrder {
  orderId: string;
  orderNumber: string;
  slug: string;
}

export function saveActiveOrder(order: ActiveOrder): void {
  if (typeof window === 'undefined') return;
  const existing = getActiveOrders();
  // Avoid duplicates, keep newest first
  const filtered = existing.filter(o => o.orderId !== order.orderId);
  filtered.unshift(order);
  // Max 5 active orders
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, 5)));
}

export function getActiveOrders(): ActiveOrder[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getActiveOrder(slug: string): ActiveOrder | null {
  return getActiveOrdersForSlug(slug)[0] ?? null;
}

export function getActiveOrdersForSlug(slug: string): ActiveOrder[] {
  return getActiveOrders().filter(o => o.slug === slug);
}

export function clearActiveOrder(orderId: string): void {
  if (typeof window === 'undefined') return;
  const existing = getActiveOrders();
  const filtered = existing.filter(o => o.orderId !== orderId);
  if (filtered.length === 0) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
}
