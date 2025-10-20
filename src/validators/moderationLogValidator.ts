import { z } from 'zod';
import { ERROR_MESSAGES } from '../utils/messages/errorMessage';

export const createModerationLogSchema = z.object({
  productId: z.number().int().positive(ERROR_MESSAGES.PRODUCT_ID_INVALID),
  moderatorId: z.number().int().positive(ERROR_MESSAGES.MODERATOR_ID_INVALID),
  action: z.enum(['APPROVED', 'REJECTED']),
  reason: z.string().optional(),
});

export const updateModerationLogSchema = z.object({
  productId: z.number().int().positive(ERROR_MESSAGES.PRODUCT_ID_INVALID).optional(),
  moderatorId: z.number().int().positive(ERROR_MESSAGES.MODERATOR_ID_INVALID).optional(),
  action: z.enum(['APPROVED', 'REJECTED']).optional(),
  reason: z.string().optional(),
});
