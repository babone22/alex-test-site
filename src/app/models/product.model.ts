export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  subcategory?: string;
  brand?: string;
  sku?: string;
  stock: number;
  isAvailable: boolean;
  rating?: number;
  reviewCount?: number;
  features?: string[];
  specifications?: { [key: string]: string };
  tags?: string[];
  priceRanges?: PriceRange[];
  sizes?: ProductSize[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PriceRange {
  sizeRange: string;
  price: number;
  stock?: number;
  isAvailable?: boolean;
}

export interface ProductSize {
  size: number;
  stock: number;
  price: number;
  isAvailable: boolean;
}

export interface CartItem {
  product: Product;
  size: number;
  quantity: number;
  price: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerInfo: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerInfo {
  companyName: string;
  companyAddress: string;
  vat: string;
  deliveryAddress: string;
  phoneNumber: string;
  emailAddress: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: number;
  children?: ProductCategory[];
}

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  inStock?: boolean;
  search?: string;
}

