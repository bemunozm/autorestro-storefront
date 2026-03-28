export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  imageUrl?: string;
  products: Product[];
}

export interface MenuResponse {
  restaurant: { id: string; name: string; slug: string; logoUrl?: string };
  categories: Category[];
}
