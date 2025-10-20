import { z } from 'zod';
import { ERROR_MESSAGES } from '../utils/messages/errorMessage';

export const createNotificationSchema = z.object({
  userId: z.number().int().positive(ERROR_MESSAGES.USER_ID_INVALID),
  type: z.enum(['REPUBLISH', 'GENERAL']),
  message: z.string().min(1, ERROR_MESSAGES.NOTIFICATION_MESSAGE_REQUIRED),
  isRead: z.boolean().optional(),
});

export const updateNotificationSchema = z.object({
  userId: z.number().int().positive(ERROR_MESSAGES.USER_ID_INVALID).optional(),
  type: z.enum(['REPUBLISH', 'GENERAL']).optional(),
  message: z.string().min(1, ERROR_MESSAGES.NOTIFICATION_MESSAGE_REQUIRED).optional(),
  isRead: z.boolean().optional(),
});
