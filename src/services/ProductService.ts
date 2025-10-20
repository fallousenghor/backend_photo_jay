import { ProductRepository } from '../repositories/ProductRepository';
import type { Product, CreateProduct, UpdateProduct } from '../types/Product';

export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async create(data: CreateProduct): Promise<Product> {
    return this.productRepository.create(data);
  }

  async findById(id: number): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  async findAll(categoryId?: number, status?: 'PENDING' | 'APPROVED' | 'REJECTED', ownerId?: number): Promise<Product[]> {
    return this.productRepository.findAll(categoryId, status, ownerId);
  }

  async update(id: number, data: UpdateProduct): Promise<Product> {
    return this.productRepository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    return this.productRepository.delete(id);
  }
}
