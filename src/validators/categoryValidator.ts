import { z } from 'zod';
import { ERROR_MESSAGES } from '../utils/messages/errorMessage';

export const createCategorySchema = z.object({
  name: z.string().min(1, ERROR_MESSAGES.CATEGORY_NAME_REQUIRED),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, ERROR_MESSAGES.CATEGORY_NAME_REQUIRED).optional(),
});
