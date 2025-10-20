import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { NotificationService } from '../services/NotificationService';
import type { CreateNotification, UpdateNotification } from '../types/Notification';
import { ERROR_MESSAGES } from '../utils/messages/errorMessage';
import { SuccessCode } from '../utils/codes/successCode';
import { ErrorCode } from '../utils/codes/errorCode';
import { createNotificationSchema, updateNotificationSchema } from '../validators/notificationValidator';

export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = createNotificationSchema.parse(req.body);
      const notification = await this.notificationService.create(data);
      res.status(SuccessCode.CREATED).json(notification);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(ErrorCode.BAD_REQUEST).json({ error: error.issues });
        return;
      }
      res.status(ErrorCode.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const notification = await this.notificationService.findById(id);
      if (!notification) {
        res.status(ErrorCode.NOT_FOUND).json({ error: ERROR_MESSAGES.NOTIFICATION_NOT_FOUND });
        return;
      }
      res.status(SuccessCode.OK).json(notification);
    } catch (error) {
      res.status(ErrorCode.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
  }

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      // Get user ID from auth middleware (assuming it's set)
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(ErrorCode.UNAUTHORIZED).json({ error: 'Utilisateur non authentifié' });
        return;
      }

      const notifications = await this.notificationService.findByUserId(userId);
      res.status(SuccessCode.OK).json(notifications);
    } catch (error) {
      res.status(ErrorCode.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const data = updateNotificationSchema.parse(req.body);
      const notification = await this.notificationService.update(id, data);
      res.status(SuccessCode.OK).json(notification);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(ErrorCode.BAD_REQUEST).json({ error: error.issues });
        return;
      }
      res.status(ErrorCode.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this.notificationService.delete(id);
      res.status(SuccessCode.NO_CONTENT).send();
    } catch (error) {
      res.status(ErrorCode.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
  }

  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(ErrorCode.UNAUTHORIZED).json({ error: 'Utilisateur non authentifié' });
        return;
      }

      const notification = await this.notificationService.markAsRead(id, userId);
      res.status(SuccessCode.OK).json(notification);
    } catch (error) {
      if ((error as Error).message === 'Notification not found or access denied') {
        res.status(ErrorCode.NOT_FOUND).json({ error: (error as Error).message });
        return;
      }
      res.status(ErrorCode.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
  }

  async markAllAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(ErrorCode.UNAUTHORIZED).json({ error: 'Utilisateur non authentifié' });
        return;
      }

      await this.notificationService.markAllAsRead(userId);
      res.status(SuccessCode.OK).json({ message: 'Toutes les notifications ont été marquées comme lues' });
    } catch (error) {
      res.status(ErrorCode.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
  }

  async getUnreadCount(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(ErrorCode.UNAUTHORIZED).json({ error: 'Utilisateur non authentifié' });
        return;
      }

      const count = await this.notificationService.getUnreadCount(userId);
      res.status(SuccessCode.OK).json({ count });
    } catch (error) {
      res.status(ErrorCode.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
  }
}
