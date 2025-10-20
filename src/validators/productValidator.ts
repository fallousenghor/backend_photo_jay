import { z } from 'zod';
import { ERROR_MESSAGES } from '../utils/messages/errorMessage';

export const createProductSchema = z.object({
  title: z.string().min(1, ERROR_MESSAGES.PRODUCT_TITLE_REQUIRED),
  description: z.string().min(1, ERROR_MESSAGES.PRODUCT_DESCRIPTION_REQUIRED),
  price: z.number().optional(),
  userId: z.number().int().positive(ERROR_MESSAGES.USER_ID_INVALID),
  categoryId: z.number().int().positive().optional(),
  expiresAt: z.string().datetime(ERROR_MESSAGES.PRODUCT_EXPIRES_AT_INVALID).transform((val) => new Date(val)).optional(),
  priority: z.boolean().optional(),
});

export const updateProductSchema = z.object({
  title: z.string().min(1, ERROR_MESSAGES.PRODUCT_TITLE_REQUIRED).optional(),
  description: z.string().min(1, ERROR_MESSAGES.PRODUCT_DESCRIPTION_REQUIRED).optional(),
  price: z.number().optional(),
  categoryId: z.number().int().positive().optional(),
  expiresAt: z.string().datetime(ERROR_MESSAGES.PRODUCT_EXPIRES_AT_INVALID).transform((val) => new Date(val)).optional(),
  priority: z.boolean().optional(),
});
