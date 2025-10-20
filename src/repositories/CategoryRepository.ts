import prisma from '../config/db';
import type { Category, CreateCategory, UpdateCategory } from '../types/Category';
import type { Prisma } from '@prisma/client';

export class CategoryRepository {
  async create(data: CreateCategory): Promise<Category> {
    const prismaData: Prisma.CategoryCreateInput = {
      name: data.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return prisma.category.create({ data: prismaData });
  }

  async findById(id: number): Promise<Category | null> {
    return prisma.category.findUnique({ where: { id } });
  }

  async findAll(): Promise<Category[]> {
    return prisma.category.findMany();
  }

  async update(id: number, data: UpdateCategory): Promise<Category> {
    const prismaData: Prisma.CategoryUpdateInput = {};
    if (data.name !== undefined) prismaData.name = data.name;
    return prisma.category.update({ where: { id }, data: prismaData });
  }

  async delete(id: number): Promise<void> {
    await prisma.category.delete({ where: { id } });
  }
}
