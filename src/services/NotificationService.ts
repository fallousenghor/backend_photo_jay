import { NotificationRepository } from '../repositories/NotificationRepository';
import type { Notification, CreateNotification, UpdateNotification } from '../types/Notification';

export class NotificationService {
  constructor(private notificationRepository: NotificationRepository) {}

  async create(data: CreateNotification): Promise<Notification> {
    return this.notificationRepository.create(data);
  }

  async findById(id: number): Promise<Notification | null> {
    return this.notificationRepository.findById(id);
  }

  async findAll(): Promise<Notification[]> {
    return this.notificationRepository.findAll();
  }

  async findByUserId(userId: number): Promise<Notification[]> {
    return this.notificationRepository.findByUserId(userId);
  }

  async markAsRead(notificationId: number, userId: number): Promise<Notification> {
    // First check if the notification belongs to the user
    const notification = await this.notificationRepository.findById(notificationId);
    if (!notification || notification.userId !== userId) {
      throw new Error('Notification not found or access denied');
    }

    return this.notificationRepository.update(notificationId, { isRead: true });
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.notificationRepository.markAllAsRead(userId);
  }

  async getUnreadCount(userId: number): Promise<number> {
    return this.notificationRepository.getUnreadCount(userId);
  }

  async update(id: number, data: UpdateNotification): Promise<Notification> {
    return this.notificationRepository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    return this.notificationRepository.delete(id);
  }
}
