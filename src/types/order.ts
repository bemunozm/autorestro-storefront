export interface OrderItem {
  id: string;
  productId: string;
  productName?: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  comment?: string;
  status: 'pending' | 'in_preparation' | 'ready' | 'delivered';
  price?: number; // keep for backward compat with existing pages
}

export interface Order {
  id: string;
  orderNumber?: string;
  type: 'pickup' | 'delivery' | 'dine_in';
  status: 'awaiting_payment' | 'pending' | 'in_progress' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled';
  paymentStatus?: string;
  paymentMethod?: string;
  items: OrderItem[];
  createdAt: string;
  total?: number;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  table?: { id: string; tableNumber: number } | null;
  transaction?: {
    id: string;
    externalId?: string;
    status: string;
    provider: string;
  } | null;
  restaurant?: { name: string; slug: string; logoUrl?: string };
}
