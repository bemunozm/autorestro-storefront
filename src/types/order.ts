export interface OrderItem {
  id: string;
  productId: string;
  productName?: string;
  quantity: number;
  comment?: string;
  status: 'pending' | 'in_preparation' | 'ready' | 'delivered';
  price: number;
}

export interface Order {
  id: string;
  type: 'pickup' | 'delivery' | 'dine_in';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  items: OrderItem[];
  createdAt: string;
  total?: number;
}
