import prisma from '../config/db';
import type { ProductImage, CreateProductImage, UpdateProductImage } from '../types/ProductImage';
import type { Prisma } from '@prisma/client';

export class ProductImageRepository {
  async create(data: CreateProductImage): Promise<ProductImage> {
    const prismaData: Prisma.ProductImageCreateInput = {
      product: { connect: { id: data.productId } },
      url: data.url,
      publicId: data.publicId,
      createdAt: new Date(),
    };
    return prisma.productImage.create({ data: prismaData });
  }

  async findById(id: number): Promise<ProductImage | null> {
    return prisma.productImage.findUnique({ where: { id } });
  }

  async findAll(): Promise<ProductImage[]> {
    return prisma.productImage.findMany();
  }

  async update(id: number, data: UpdateProductImage): Promise<ProductImage> {
    const prismaData: Prisma.ProductImageUpdateInput = {};
    if (data.productId !== undefined) prismaData.product = { connect: { id: data.productId } };
    if (data.url !== undefined) prismaData.url = data.url;
    if (data.publicId !== undefined) prismaData.publicId = data.publicId;
    return prisma.productImage.update({ where: { id }, data: prismaData });
  }

  async delete(id: number): Promise<void> {
    await prisma.productImage.delete({ where: { id } });
  }
}
