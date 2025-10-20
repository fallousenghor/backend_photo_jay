import type { User } from './User';
import type { NotificationType } from '@prisma/client';

export interface Notification {
  id: number;
  userId: number;
  user?: User;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface CreateNotification {
  userId: number;
  type: NotificationType;
  message: string;
  isRead?: boolean;
}

export interface UpdateNotification {
  userId?: number;
  type?: NotificationType;
  message?: string;
  isRead?: boolean;
}
