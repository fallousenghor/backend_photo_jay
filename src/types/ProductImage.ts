import type { Product } from './Product';

export interface ProductImage {
  id: number;
  productId: number;
  product?: Product;
  url: string;
  publicId: string;
  createdAt: Date;
}

export interface CreateProductImage {
  productId: number;
  url: string;
  publicId: string;
}

export interface UpdateProductImage {
  productId?: number;
  url?: string;
  publicId?: string;
}
