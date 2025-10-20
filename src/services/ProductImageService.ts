import { ProductImageRepository } from '../repositories/ProductImageRepository';
import type { ProductImage, CreateProductImage, UpdateProductImage } from '../types/ProductImage';

export class ProductImageService {
  constructor(private productImageRepository: ProductImageRepository) {}

  async create(data: CreateProductImage): Promise<ProductImage> {
    return this.productImageRepository.create(data);
  }

  async findById(id: number): Promise<ProductImage | null> {
    return this.productImageRepository.findById(id);
  }

  async findAll(): Promise<ProductImage[]> {
    return this.productImageRepository.findAll();
  }

  async update(id: number, data: UpdateProductImage): Promise<ProductImage> {
    return this.productImageRepository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    return this.productImageRepository.delete(id);
  }
}
