"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductImageSchema = exports.createProductImageSchema = void 0;
const zod_1 = require("zod");
const errorMessage_1 = require("../utils/messages/errorMessage");
exports.createProductImageSchema = zod_1.z.object({
    productId: zod_1.z.coerce.number().int().positive(errorMessage_1.ERROR_MESSAGES.PRODUCT_ID_INVALID),
    url: zod_1.z.string().url(errorMessage_1.ERROR_MESSAGES.PRODUCT_IMAGE_URL_INVALID),
    publicId: zod_1.z.string()
});
exports.updateProductImageSchema = zod_1.z.object({
    productId: zod_1.z.number().int().positive(errorMessage_1.ERROR_MESSAGES.PRODUCT_ID_INVALID).optional(),
    url: zod_1.z.string().url(errorMessage_1.ERROR_MESSAGES.PRODUCT_IMAGE_URL_INVALID).optional(),
    publicId: zod_1.z.string().optional()
});
