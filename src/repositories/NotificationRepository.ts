import prisma from '../config/db';
import type { Notification, CreateNotification, UpdateNotification } from '../types/Notification';
import type { Prisma } from '@prisma/client';

export class NotificationRepository {
  async create(data: CreateNotification): Promise<Notification> {
    const prismaData: Prisma.NotificationCreateInput = {
      user: { connect: { id: data.userId } },
      type: data.type,
      message: data.message,
      isRead: data.isRead ?? false,
      createdAt: new Date(),
    };
    return prisma.notification.create({ data: prismaData });
  }

  async findById(id: number): Promise<Notification | null> {
    return prisma.notification.findUnique({ where: { id } });
  }

  async findAll(): Promise<Notification[]> {
    return prisma.notification.findMany();
  }

  async findByUserId(userId: number): Promise<Notification[]> {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async markAllAsRead(userId: number): Promise<void> {
    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false
      },
      data: { isRead: true }
    });
  }

  async getUnreadCount(userId: number): Promise<number> {
    return prisma.notification.count({
      where: {
        userId,
        isRead: false
      }
    });
  }

  async update(id: number, data: UpdateNotification): Promise<Notification> {
    const prismaData: Prisma.NotificationUpdateInput = {};
    if (data.userId !== undefined) prismaData.user = { connect: { id: data.userId } };
    if (data.type !== undefined) prismaData.type = data.type;
    if (data.message !== undefined) prismaData.message = data.message;
    if (data.isRead !== undefined) prismaData.isRead = data.isRead;
    return prisma.notification.update({ where: { id }, data: prismaData });
  }

  async delete(id: number): Promise<void> {
    await prisma.notification.delete({ where: { id } });
  }
}
