import prisma from '../config/db';
import type { Product, CreateProduct, UpdateProduct } from '../types/Product';
import type { Prisma } from '@prisma/client';

export class ProductRepository {
  async create(data: CreateProduct): Promise<Product> {
    const expiresAt = data.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    const prismaData: Prisma.ProductCreateInput = {
      title: data.title,
      description: data.description,
      price: data.price,
      user: { connect: { id: data.userId } },
      category: data.categoryId ? { connect: { id: data.categoryId } } : undefined,
      status: data.status ?? 'PENDING',
      priority: data.priority ?? false,
      views: data.views ?? 0,
      expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return prisma.product.create({ data: prismaData });
  }

  async findById(id: number): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        category: true,
        user: {
          select: {
            id: true,
            userName: true,
            email: true,
            phoneNumber: true,
            whatsappNumber: true,
            shopLink: true
          }
        }
      }
    });
  }

  async findAll(categoryId?: number, status?: 'PENDING' | 'APPROVED' | 'REJECTED', ownerId?: number): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        ...(categoryId && { categoryId }),
        ...(status && { status }),
        ...(ownerId && { userId: ownerId })
      },
      include: {
        images: true,
        category: true,
        user: {
          select: {
            id: true,
            userName: true,
            email: true,
            phoneNumber: true,
            whatsappNumber: true,
            shopLink: true
          }
        }
      }
    });
  }

  async update(id: number, data: UpdateProduct): Promise<Product> {
    const prismaData: Prisma.ProductUpdateInput = {};
    if (data.title !== undefined) prismaData.title = data.title;
    if (data.description !== undefined) prismaData.description = data.description;
    if (data.price !== undefined) prismaData.price = data.price;
    if (data.userId !== undefined) prismaData.user = { connect: { id: data.userId } };
    if (data.categoryId !== undefined) prismaData.category = data.categoryId ? { connect: { id: data.categoryId } } : { disconnect: true };
    if (data.status !== undefined) prismaData.status = data.status;
    if (data.priority !== undefined) prismaData.priority = data.priority;
    if (data.views !== undefined) prismaData.views = data.views;
    if (data.expiresAt !== undefined) prismaData.expiresAt = data.expiresAt;
    return prisma.product.update({ where: { id }, data: prismaData });
  }

  async delete(id: number): Promise<void> {
    await prisma.product.delete({ where: { id } });
  }
}
