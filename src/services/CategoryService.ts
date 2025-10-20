import { CategoryRepository } from '../repositories/CategoryRepository';
import type { Category, CreateCategory, UpdateCategory } from '../types/Category';

export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async create(data: CreateCategory): Promise<Category> {
    return this.categoryRepository.create(data);
  }

  async findById(id: number): Promise<Category | null> {
    return this.categoryRepository.findById(id);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async update(id: number, data: UpdateCategory): Promise<Category> {
    return this.categoryRepository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    return this.categoryRepository.delete(id);
  }
}
