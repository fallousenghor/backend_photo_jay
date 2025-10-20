import prisma from '../config/db';
import type { User, CreateUser, UpdateUser } from '../types/User';
import type { Prisma } from '@prisma/client';

export class UserRepository {
  async create(data: CreateUser): Promise<User> {
    const prismaData: Prisma.UserCreateInput = {
      userName: data.userName,
      email: data.email,
      password: data.password,
      role: data.role,
      isVIP: data.isVIP ?? false,
      phoneNumber: data.phoneNumber,
      whatsappNumber: data.whatsappNumber,
      shopLink: data.shopLink,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return prisma.user.create({ data: prismaData });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async update(id: number, data: UpdateUser): Promise<User> {
    const prismaData: Prisma.UserUpdateInput = {};
    if (data.userName !== undefined) prismaData.userName = data.userName;
    if (data.email !== undefined) prismaData.email = data.email;
    if (data.password !== undefined) prismaData.password = data.password;
    if (data.role !== undefined) prismaData.role = data.role;
    if (data.isVIP !== undefined) prismaData.isVIP = data.isVIP;
    if (data.phoneNumber !== undefined) prismaData.phoneNumber = data.phoneNumber;
    if (data.whatsappNumber !== undefined) prismaData.whatsappNumber = data.whatsappNumber;
    if (data.shopLink !== undefined) prismaData.shopLink = data.shopLink;
    return prisma.user.update({ where: { id }, data: prismaData });
  }

  async delete(id: number): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}
