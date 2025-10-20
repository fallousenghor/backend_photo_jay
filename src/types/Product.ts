import type { User } from './User';
import type { ProductImage } from './ProductImage';
import { ModerationLog } from './ModerationLog';
import type { Category } from './Category';

export interface Seller {
  id: number;
  userName: string;
  email: string;
  phoneNumber: string;
  whatsappNumber: string | null;
  shopLink: string | null;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number | null;
  userId: number;
  user?: Seller;
  categoryId?: number | null;
  category?: Category | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  priority: boolean;
  views: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  images?: ProductImage[];
  moderations?: ModerationLog[];
}

export interface CreateProduct {
  title: string;
  description: string;
  price?: number;
  userId: number;
  categoryId?: number;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  priority?: boolean;
  views?: number;
  expiresAt: Date;
}

export interface UpdateProduct {
  title?: string;
  description?: string;
  price?: number;
  userId?: number;
  categoryId?: number;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  priority?: boolean;
  views?: number;
  expiresAt?: Date;
}
