import { z } from 'zod';
import { ERROR_MESSAGES } from '../utils/messages/errorMessage';

export const createProductImageSchema = z.object({
  productId: z.coerce.number().int().positive(ERROR_MESSAGES.PRODUCT_ID_INVALID),
  url: z.string().url(ERROR_MESSAGES.PRODUCT_IMAGE_URL_INVALID),
  publicId: z.string()
});

export const updateProductImageSchema = z.object({
  productId: z.number().int().positive(ERROR_MESSAGES.PRODUCT_ID_INVALID).optional(),
  url: z.string().url(ERROR_MESSAGES.PRODUCT_IMAGE_URL_INVALID).optional(),
  publicId: z.string().optional()
});
